import type { Entity } from '../entities';

export interface Query<E> {
  [Symbol.iterator](): {
    next: () => {
      value: E;
      done: boolean;
    };
  };
}

export type IUnExploredFolders = Query<
  Pick<Entity, 'owner' | 'repo' | 'fsName' | 'fsPath' | 'isFsDir'>
>;

export interface IWorldProvider {
  /**
   * Just a sample.
   */
  get withTitle(): Query<Pick<Entity, 'title'>>;

  get unExploredFolders(): IUnExploredFolders;

  addEntity(entity: Entity): void;

  removeEntity(entity: Entity): void;

  addComponent(
    entity: Entity,
    key: keyof Entity,
    value: Entity[keyof Entity],
  ): void;
}
