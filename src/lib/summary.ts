import type {
  Field,
  InstrumentDefinition,
  Localized,
  Model,
  Step,
} from "@/data/instruments/types";
import {
  OTHER_OPTION_ID,
  type FieldValue,
  type UploadedImage,
} from "@/data/instruments/values";

/** Resolve the selected model (first creation step). */
export function getModel(
  def: InstrumentDefinition,
  modelId: string | null | undefined,
): Model | undefined {
  return def.models.find((m) => m.id === modelId);
}

export type SummaryEntry = {
  stepId: string;
  stepTitle: Localized;
  fieldId: string;
  fieldLabel: Localized;
  kind: "choice" | "text";
  answered: boolean;
  /** Label of the chosen option (choice fields). */
  valueLabel?: Localized;
  swatch?: string;
  /** Reference photo of the chosen option, when it has one. */
  image?: string;
  isOther: boolean;
  otherText?: string;
  text?: string;
  images: UploadedImage[];
};

export function isFieldVisible(
  field: Field,
  values: Record<string, FieldValue>,
): boolean {
  if (!field.visibleWhen) return true;
  return values[field.visibleWhen.fieldId]?.optionId === field.visibleWhen.equals;
}

export function visibleFields(
  step: Step,
  values: Record<string, FieldValue>,
): Field[] {
  return step.fields.filter((f) => isFieldVisible(f, values));
}

/**
 * Flattens the user's selections against the instrument definition into
 * display-ready entries. Single source of truth for the review screen, the
 * PDF and the WhatsApp summary — both languages resolved from the data file.
 */
export function buildSummary(
  def: InstrumentDefinition,
  values: Record<string, FieldValue>,
): SummaryEntry[] {
  const entries: SummaryEntry[] = [];

  for (const step of def.steps) {
    for (const field of visibleFields(step, values)) {
      const value = values[field.id];

      if (field.kind === "text") {
        const text = value?.text?.trim();
        entries.push({
          stepId: step.id,
          stepTitle: step.title,
          fieldId: field.id,
          fieldLabel: field.label,
          kind: "text",
          answered: Boolean(text),
          text,
          isOther: false,
          images: [],
        });
        continue;
      }

      const isOther = value?.optionId === OTHER_OPTION_ID;
      const option = field.options.find((o) => o.id === value?.optionId);
      entries.push({
        stepId: step.id,
        stepTitle: step.title,
        fieldId: field.id,
        fieldLabel: field.label,
        kind: "choice",
        answered: Boolean(value?.optionId),
        valueLabel: option?.label,
        swatch: option?.swatch,
        image: option?.image,
        isOther,
        otherText: isOther ? value?.otherText?.trim() : undefined,
        images: isOther ? (value?.images ?? []) : [],
      });
    }
  }

  return entries;
}

/** Validation errors per field id for one step. Returns an empty map when ok. */
export function validateStep(
  step: Step,
  values: Record<string, FieldValue>,
): Record<string, "required" | "otherText"> {
  const errors: Record<string, "required" | "otherText"> = {};
  for (const field of visibleFields(step, values)) {
    if (field.kind !== "choice") continue;
    const value = values[field.id];
    if (field.required && !value?.optionId) {
      errors[field.id] = "required";
    } else if (
      value?.optionId === OTHER_OPTION_ID &&
      !value.otherText?.trim()
    ) {
      errors[field.id] = "otherText";
    }
  }
  return errors;
}

/** Short plain-text summary (model + top choices) for the WhatsApp message. */
export function shortSummary(
  def: InstrumentDefinition,
  modelId: string | null | undefined,
  values: Record<string, FieldValue>,
  lang: "pt" | "en",
  max = 5,
): string {
  const parts: string[] = [];
  const model = getModel(def, modelId);
  if (model) parts.push(`${lang === "pt" ? "Modelo" : "Model"}: ${model.name}`);
  for (const entry of buildSummary(def, values)) {
    if (parts.length >= max) break;
    if (!entry.answered || entry.kind !== "choice") continue;
    const valueText = entry.isOther
      ? `${lang === "pt" ? "Outro" : "Other"}: ${entry.otherText ?? ""}`
      : (entry.valueLabel?.[lang] ?? "");
    parts.push(`${entry.fieldLabel[lang]}: ${valueText}`);
  }
  return parts.join(" · ");
}
