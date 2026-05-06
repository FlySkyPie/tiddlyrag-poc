import type { FileContentDto } from './file-content.dto';
import type { FileUrlDto } from './file-url.dto';

export interface CreateWikiArticleParamDto {
  repoType: string;
  repoUrl: string;
  repoName: string;
  languageName: string;
  files: FileContentDto[];
  fileUrls: FileUrlDto[];
  title: string;
}
