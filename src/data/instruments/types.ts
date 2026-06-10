import type { Localized } from "@/data/catalog";

export type { Localized };

export type Option = {
  id: string;
  label: Localized;
  description?: Localized;
  /** Wood/finish color hint used by the 3D viewer and option swatches. */
  swatch?: string;
};

export type ChoiceField = {
  kind: "choice";
  id: string;
  label: Localized;
  required?: boolean;
  options: Option[];
  /** Every choice field gets an "Other" option unless explicitly disabled. */
  allowOther?: boolean;
  /** Render only when another field currently has the given option selected. */
  visibleWhen?: { fieldId: string; equals: string };
};

export type TextField = {
  kind: "text";
  id: string;
  label: Localized;
  placeholder?: Localized;
  visibleWhen?: { fieldId: string; equals: string };
};

export type Field = ChoiceField | TextField;

export type Step = {
  id: string;
  title: Localized;
  intro?: Localized;
  fields: Field[];
};

export type InstrumentDefinition = {
  id: string;
  name: Localized;
  steps: Step[];
};
