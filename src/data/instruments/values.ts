/** Pure value types shared by client state, server validation and the PDF. */

export const OTHER_OPTION_ID = "__other__";

export type UploadedImage = { url: string; name: string };

export type FieldValue = {
  /** Selected option id, or OTHER_OPTION_ID. Unset for text fields. */
  optionId?: string;
  /** Free-text description when "Other" is selected. */
  otherText?: string;
  /** Reference photos attached to an "Other" selection. */
  images?: UploadedImage[];
  /** Value of kind="text" fields. */
  text?: string;
};
