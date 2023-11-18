import { EntityType } from './EntityType';

export type EntityModel = {
    id: number;
    name: string;
    path: string;
    parent: number;
    type: EntityType;
};
