import { ProcessingItemStatus } from './enums/ProcessingItemStatus';
import { ProcessingItemType } from './enums/ProcessingItemType';

export type ProcessingItem = {
    id: number;
    status: ProcessingItemStatus;
    type: ProcessingItemType;
};
