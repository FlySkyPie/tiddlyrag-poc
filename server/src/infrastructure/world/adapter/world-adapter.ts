import { World } from 'miniplex';

import type { Entity } from '../../../core/entity-component/entities';
import type {
  IWorldProvider,
  IUnExploredFolders,
  Query,
} from '../../../core/entity-component/interfaces/world-provider';

export class WorldAdapter implements IWorldProvider {
  private _world: World<Entity> = new World();

  private _withTitle: Query<Pick<Entity, 'title'>>;

  private _unExploredFolder: IUnExploredFolders;

  constructor() {
    this._withTitle = this._world.with('title');

    this._unExploredFolder = this._world
      .with('owner', 'repo', 'fsPath', 'fsName', 'isFsDir')
      .without('isExplored');
  }

  get withTitle(): Query<Pick<Entity, 'title'>> {
    return this._withTitle;
  }

  get unExploredFolders(): IUnExploredFolders {
    return this._unExploredFolder;
  }

  addEntity(entity: Entity): void {
    this._world.add(entity);
  }

  removeEntity(entity: Entity): void {
    this._world.remove(entity);
    throw new Error('Method not implemented.');
  }

  addComponent(
    entity: Entity,
    key: keyof Entity,
    value: Entity[keyof Entity],
  ): void {
    this._world.addComponent(entity, key, value);
  }
}
