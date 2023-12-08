import { EntityType } from './enums/EntityType';

export type EntityModel = {
    id: number;
    name: string;
    path: string;
    parent: number;
    type: EntityType;
    progress?: number;
};
