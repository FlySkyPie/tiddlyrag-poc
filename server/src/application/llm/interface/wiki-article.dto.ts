export interface WikiArticle {
  title: string;
  description: string;
  importance: string;
  relevant_files: {
    file_path: string[];
  };
  related_articles: {
    related: string[];
  };
  '@_id': string;
}
