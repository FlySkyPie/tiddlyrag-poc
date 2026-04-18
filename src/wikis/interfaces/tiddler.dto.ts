export interface Tiddler {
  tags: string[];
  title: string;
  text: string;

  type?: string;
  created?: string;
  modified?: string;
  revision?: string;
  bag?: string;

  [key: string]: any;
}
