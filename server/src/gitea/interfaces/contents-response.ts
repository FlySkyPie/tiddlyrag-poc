export interface ContentsResponse {
  /**
   * `content` is populated when `type` is `file`, otherwise null
   */
  content?: string;
  /**
   * DownloadURL is the direct download URL for this file
   */
  download_url?: string;
  /**
   * `encoding` is populated when `type` is `file`, otherwise null
   */
  encoding?: string;
  /**
   * GitURL is the Git API URL for this blob or tree
   */
  git_url?: string;
  /**
   * HTMLURL is the web URL for this file or directory
   */
  html_url?: string;
  last_author_date?: string;
  /**
   * LastCommitMessage is the message of the last commit that affected this file
   */
  last_commit_message?: string;
  /**
   * LastCommitSHA is the SHA of the last commit that affected this file
   */
  last_commit_sha?: string;
  last_committer_date?: string;
  /**
   * LfsOid is the Git LFS object ID if this file is stored in LFS
   */
  lfs_oid?: string;
  /**
   * LfsSize is the file size if this file is stored in LFS
   */
  lfs_size?: number;
  /**
   * Name is the file or directory name
   */
  name?: string;
  /**
   * Path is the full path to the file or directory
   */
  path?: string;
  /**
   * SHA is the Git blob or tree SHA
   */
  sha?: string;
  /**
   * Size is the file size in bytes
   */
  size?: number;
  /**
   * `submodule_git_url` is populated when `type` is `submodule`, otherwise null
   */
  submodule_git_url?: string;
  /**
   * `target` is populated when `type` is `symlink`, otherwise null
   */
  target?: string;
  /**
   * `type` will be `file`, `dir`, `symlink`, or `submodule`
   */
  type?: 'file' | 'dir' | 'symlink' | 'submodule';
  /**
   * URL is the API URL for this file or directory
   */
  url?: string;
}
