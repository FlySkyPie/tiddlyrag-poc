import { World } from 'miniplex';
import { nanoid } from 'nanoid';
import EventEmitter from 'eventemitter3';

import type { Entity } from '../../../core/entity-component/entities';
import type {
  IWorldProvider,
  IUnExploredFolders,
  Query,
} from '../../../core/entity-component/interfaces/world-provider';
import type {
  WorldEvents,
  WorldObservable,
} from '../../../core/entity-component/interfaces/world-observable';

export class WorldAdapter implements IWorldProvider, WorldObservable {
  private _world: World<Entity> = new World();

  private _withTitle: Query<Pick<Entity, 'title'>>;

  private _unExploredFolder: IUnExploredFolders;

  private _event: EventEmitter<WorldEvents>;

  constructor() {
    this._withTitle = this._world.with('title');

    this._unExploredFolder = this._world
      .with('owner', 'repo', 'fsPath', 'fsName', 'isFsDir')
      .without('isExplored');

    this._event = new EventEmitter();
  }

  public get withTitle(): Query<Pick<Entity, 'title'>> {
    return this._withTitle;
  }

  public get unExploredFolders(): IUnExploredFolders {
    return this._unExploredFolder;
  }

  public addEntity(entity: Entity): void {
    const result = this._world.add(
      Object.assign(entity, {
        uid: nanoid(),
      }),
    );

    this._event.emit('entity-added', structuredClone(result));
  }

  public removeEntity(entity: Entity): void {
    this._world.remove(entity);

    this._event.emit('entity-removed', structuredClone(entity));
  }

  public addComponent(
    entity: Entity,
    key: keyof Entity,
    value: Entity[keyof Entity],
  ): void {
    this._world.addComponent(entity, key, value);

    this._event.emit('entity-updated', structuredClone(entity));
  }

  public removeComponent(entity: Entity, key: keyof Entity): void {
    this._world.removeComponent(entity, key);

    this._event.emit('entity-updated', structuredClone(entity));
  }

  public on<K extends keyof WorldEvents>(
    eventName: K,
    listener: (...args: WorldEvents[K]) => void,
  ): this {
    this._event.on(eventName, listener);
    return this;
  }

  public off<K extends keyof WorldEvents>(
    eventName: K,
    listener: (...args: WorldEvents[K]) => void,
  ): this {
    this._event.off(eventName, listener);
    return this;
  }

  public dispose() {
    this._event.removeAllListeners();
    this._world.clear();
  }
}
