import { BooleanType } from './BooleanParser';

export type EntityModel = {
    id: number;
    name: string;
    path: string;
    parent: number;
    directory: BooleanType;
};
