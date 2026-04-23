import { TiddlerTable } from './tiddler';
import { WikiTable } from './wiki';

export interface Database {
  wiki: WikiTable;
  tiddler: TiddlerTable;
}
