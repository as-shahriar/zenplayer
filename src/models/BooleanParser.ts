export type BooleanType = 'TRUE' | 'FALSE';

export class Boolean {
    static parseToBoolean = (value?: boolean): BooleanType => (value ? 'TRUE' : 'FALSE');
    static parseToNative = (value: BooleanType): boolean => value === 'TRUE';
}
