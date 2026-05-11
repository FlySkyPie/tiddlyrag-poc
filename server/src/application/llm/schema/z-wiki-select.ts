import { z } from 'zod';

export const zWikiSelect = z.object({
  title: z.string(),
  pages: z.object({ page_ref: z.array(z.string()) }),
  subsections: z.object({ section_ref: z.string() }).optional(),
});
