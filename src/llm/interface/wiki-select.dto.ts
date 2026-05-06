/**
 * @todo Implement this with vanilla Typescript, DO NOT reply on zod.
 */

export interface WikiSelect {
  title: string;
  pages: {
    page_ref: string[];
  };
  subsections?: {
    section_ref: string;
  };
}
