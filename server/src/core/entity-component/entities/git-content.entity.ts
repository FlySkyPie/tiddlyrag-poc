export interface GitContentEntity {
  /**
   * owner of the repo
   */
  owner: string;

  /**
   * name of the repo
   */
  repo: string;

  /**
   * `content` is populated when `type` is `file`, otherwise null
   */
  content?: string;

  /**
   * Name is the file or directory name
   */
  fsName?: string;

  /**
   * Size is the file size in bytes
   */
  fsSize?: number;

  /**
   * Path is the full path to the file or directory
   */
  fsPath?: string;

  /**
   * Flag determined the entity is file.
   */
  isFsFile?: true;

  /**
   * Flag determined the entity is directory.
   */
  isFsDir?: true;

  /**
   * Flag determined the entity is symlink.
   */
  isFsSymlink?: true;

  /**
   * Flag determined the entity is submodule.
   */
  isFsSubmodule?: true;

  /**
   * `encoding` is populated when `type` is `file`, otherwise null
   */
  fsEncoding?: string;

  /**
   * The flag of chilren items are explored when the item is folder.
   */
  isExplored?: true;
}
