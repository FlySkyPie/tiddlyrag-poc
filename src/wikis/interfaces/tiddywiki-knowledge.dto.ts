import { Tiddler } from './tiddler.dto';

export interface TiddywikiKnowledge {
  title: string;
  subtitle: string;

  tiddlers: Tiddler[];
}
