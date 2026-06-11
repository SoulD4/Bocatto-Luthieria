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

/** A group of fields shown as one stage of the creation (Madeiras, Construção…). */
export type Step = {
  id: string;
  title: Localized;
  intro?: Localized;
  fields: Field[];
};

/** Body-shape hint consumed by the 3D viewer. */
export type BodyShape =
  | "om"
  | "dreadnought"
  | "jumbo"
  | "parlor"
  | "auditorio"
  | "classico";

/** A concrete instrument the customer can start from (first creation step). */
export type Model = {
  id: string;
  /** Proper name, identical across languages (e.g. "Bocatto OM"). */
  name: string;
  /** Scale length, e.g. "645 mm". */
  scale: string;
  description: Localized;
  characteristics: Localized[];
  shape: BodyShape;
};

/**
 * One instrument family (e.g. steel-string acoustic). Adding nylon guitars,
 * electric guitars, basses or violas later means creating a sibling
 * InstrumentDefinition and registering it — the wizard, summary, PDF and 3D
 * viewer are all driven by this data, so no screens need to change.
 */
export type InstrumentDefinition = {
  id: string;
  /** Family key: "violao-aco" | "violao-nylon" | "guitarra" | "baixo" | "viola". */
  family: string;
  name: Localized;
  /** String type tied to the family (replaces the old nylon/steel question). */
  strings: "aco" | "nylon";
  /** Models offered — the first, mandatory creation step. */
  models: Model[];
  /** Field groups shown after the model is chosen. */
  steps: Step[];
};
