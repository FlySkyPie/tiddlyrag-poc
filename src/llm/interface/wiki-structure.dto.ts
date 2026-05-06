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
