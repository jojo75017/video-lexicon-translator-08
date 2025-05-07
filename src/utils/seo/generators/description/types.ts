
// Common types and interfaces for the description generator
export interface DescriptionOptions {
  maxLength?: number;
  addExtension?: boolean;
}

export interface GeneratedDescriptions {
  short: string;
  long: string;
}

export type DescriptionTemplate = string[];
