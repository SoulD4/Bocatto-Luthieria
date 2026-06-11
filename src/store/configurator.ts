import { create } from "zustand";
import type { FieldValue, UploadedImage } from "@/data/instruments/values";

export { OTHER_OPTION_ID } from "@/data/instruments/values";
export type { FieldValue, UploadedImage } from "@/data/instruments/values";

type ConfiguratorState = {
  /** Selected model id (first creation step). */
  modelId: string | null;
  values: Record<string, FieldValue>;
  /** "Referências e Observações" step: free notes + general reference photos. */
  extra: { observations: string; references: UploadedImage[] };

  setModel: (id: string) => void;
  setValue: (fieldId: string, value: FieldValue) => void;
  patchValue: (fieldId: string, patch: Partial<FieldValue>) => void;
  setObservations: (text: string) => void;
  setReferences: (images: UploadedImage[]) => void;
  reset: () => void;
};

export const useConfigurator = create<ConfiguratorState>((set) => ({
  modelId: null,
  values: {},
  extra: { observations: "", references: [] },

  setModel: (id) => set({ modelId: id }),
  setValue: (fieldId, value) =>
    set((s) => ({ values: { ...s.values, [fieldId]: value } })),
  patchValue: (fieldId, patch) =>
    set((s) => ({
      values: {
        ...s.values,
        [fieldId]: { ...s.values[fieldId], ...patch },
      },
    })),
  setObservations: (text) =>
    set((s) => ({ extra: { ...s.extra, observations: text } })),
  setReferences: (images) =>
    set((s) => ({ extra: { ...s.extra, references: images } })),
  reset: () =>
    set({ modelId: null, values: {}, extra: { observations: "", references: [] } }),
}));
