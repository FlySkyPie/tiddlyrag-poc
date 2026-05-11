export interface WikiSelect {
  title: string;
  pages: {
    page_ref: string[];
  };
  subsections?: {
    section_ref: string;
  };
}
