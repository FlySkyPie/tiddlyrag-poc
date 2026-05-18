import type { IWorldProvider } from '../../../entity-component/interfaces/world-provider';
import type { IGiteaRepository } from '../../../repository/gitea.repository';

import type { TickableActionNode } from '../../interfaces/tickable-action-node';

export class ExplodeFolderDepthlyNode implements TickableActionNode {
  constructor(
    private readonly worldProvider: IWorldProvider,
    private readonly giteaRepository: IGiteaRepository,
  ) {}

  async tick(): Promise<boolean> {
    const { unExploredFolders } = this.worldProvider;
    interface IFolder {
      folderEntity: {
        owner: string;
        repo: string;
        fsName: string;
        fsPath: string;
      };
      depth: number;
    }
    let mostDepthFolder: IFolder | null = null;
    for (const folder of unExploredFolders) {
      if (!mostDepthFolder) {
        const depth = folder.fsPath.split('/').length;
        mostDepthFolder = {
          folderEntity: folder,
          depth,
        };
        continue;
      }
      const depth = folder.fsPath.split('/').length;
      if (depth > mostDepthFolder.depth) {
        mostDepthFolder = {
          folderEntity: folder,
          depth,
        };
      }
    }

    if (!mostDepthFolder) {
      return true;
    }
    const { repo, fsPath, owner } = mostDepthFolder.folderEntity;
    const result = await this.giteaRepository.readPath(repo, fsPath);
    for (const conent of result) {
      if (conent.type === 'file') {
        const { path, name, size } = conent;
        this.worldProvider.addEntity({
          owner,
          repo,
          fsPath: path,
          fsName: name,
          name: name,
          fsSize: size,
          isFsFile: true,
          isExplored: undefined,
        });
        continue;
      }
      if (conent.type === 'dir') {
        const { path, name } = conent;
        this.worldProvider.addEntity({
          owner,
          repo,
          fsPath: path,
          fsName: name,
          name: name + '/',
          fsSize: 0,
          isFsDir: true,
          isExplored: undefined,
        });
        continue;
      }
      if (conent.type === 'symlink') {
        console.warn('Traversaled symlink, ignored');
        continue;
      }
      if (conent.type === 'submodule') {
        console.warn('Traversaled submodule, ignored');
        continue;
      }
    }

    this.worldProvider.addComponent(
      mostDepthFolder.folderEntity,
      'isExplored',
      true,
    );

    return false;
  }
}
