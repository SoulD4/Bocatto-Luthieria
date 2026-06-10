import { create } from "zustand";
import type { FieldValue } from "@/data/instruments/values";

export { OTHER_OPTION_ID } from "@/data/instruments/values";
export type { FieldValue, UploadedImage } from "@/data/instruments/values";

type ConfiguratorState = {
  values: Record<string, FieldValue>;
  setValue: (fieldId: string, value: FieldValue) => void;
  patchValue: (fieldId: string, patch: Partial<FieldValue>) => void;
  reset: () => void;
};

export const useConfigurator = create<ConfiguratorState>((set) => ({
  values: {},
  setValue: (fieldId, value) =>
    set((s) => ({ values: { ...s.values, [fieldId]: value } })),
  patchValue: (fieldId, patch) =>
    set((s) => ({
      values: {
        ...s.values,
        [fieldId]: { ...s.values[fieldId], ...patch },
      },
    })),
  reset: () => set({ values: {} }),
}));
