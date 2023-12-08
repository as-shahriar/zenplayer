import { ProcessingItemStatus } from './enums/ProcessingItemStatus';

export type ProcessingItem = {
    id: number;
    status: ProcessingItemStatus;
};
