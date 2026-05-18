import { create } from 'zustand'

export interface Entity {
    uid: string;

    [key: string]: unknown;
};

interface EntityStore {
    entities: Entity[];

    selected?: Entity | undefined;

    add(value: Entity): void;
    remove(value: Entity): void;
    updated(value: Entity): void;

    select(value?: Entity): void;
}

export const useEntityStore = create<EntityStore>((set) => ({
    entities: [],
    add: (value: Entity) => {
        set(({ entities }) => {
            return { entities: [...entities, value] }
        });
    },
    remove: (value: Entity) => {
        set(({ entities }) => {
            return { entities: entities.filter(item => item.uid !== value.uid) }
        });
    },
    updated: (value: Entity) => {
        set(({ entities }) => {
            return {
                entities: entities.map(item => {
                    if (item.uid === value.uid) {
                        return value;
                    }
                    return item;
                })
            }
        });
    },
    select: (value: Entity) => { set({ selected: value }) },
}));
