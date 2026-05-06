/**
 * @todo Implement this with vanilla Typescript, DO NOT reply on zod.
 */

import type { WikiArticle } from './wiki-article.dto';

export interface WikiStructure {
  wiki_structure: {
    title: string;
    description: string;
    articles: {
      article: WikiArticle[];
    };
  };
}
