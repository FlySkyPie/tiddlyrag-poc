import type { FileDto } from './file.dto';

export interface CreateWikiStructureParamDto {
  repoType: string;
  repoUrl: string;
  repoName: string;
  languageName: string;
  files: FileDto[];
  readme: string;
  isComprehensiveView: boolean;
}
