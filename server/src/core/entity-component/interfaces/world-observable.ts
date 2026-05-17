import type { Entity } from '../entities';

export interface WorldEvents {
  'entity-added': [entity: Entity];
  'entity-removed': [entity: Entity];
  'entity-updated': [entity: Entity];
}

export interface WorldObservable<
  E extends { [eventName in keyof E]: any[] } = WorldEvents,
> {
  on<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void): this;
  off<K extends keyof E>(eventName: K, listener: (...args: E[K]) => void): this;
}
