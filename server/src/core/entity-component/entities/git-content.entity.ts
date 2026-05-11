export interface GitContentEntity {
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
   * `type` will be `file`, `dir`, `symlink`, or `submodule`
   */
  fsType?: 'file' | 'dir' | 'symlink' | 'submodule';

  /**
   * `encoding` is populated when `type` is `file`, otherwise null
   */
  fsEncoding?: string;
}
