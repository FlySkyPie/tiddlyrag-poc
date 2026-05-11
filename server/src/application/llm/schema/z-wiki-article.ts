import { z } from 'zod';

export const zWikiArticle = z.object({
  title: z.string().describe('Title of the article.'),
  description: z.string().describe('Summary of the article'),
  importance: z.string(),
  relevant_files: z.object({ file_path: z.array(z.string()) }),
  related_articles: z
    .object({ related: z.array(z.string()) })
    .describe('Id of the other articles.'),
  '@_id': z.string().describe('Id of the article.'),
});
