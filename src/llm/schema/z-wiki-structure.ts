import { z } from 'zod';

import { zWikiArticle } from './z-wiki-article';

export const zWikiStructure = z.object({
  wiki_structure: z
    .object({
      title: z.string().describe('The tile of the Wiki document.'),
      description: z.string().describe('Summary of the Wiki document.'),
      articles: z.object({
        article: z.array(zWikiArticle),
      }),
    })
    .describe('A Wiki document containing multiple articles'),
});
