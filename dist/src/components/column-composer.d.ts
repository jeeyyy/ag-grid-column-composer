import { IColumnComposer } from "../interfaces";
export declare class ColumnComposer {
    private rootElement;
    constructor(config: IColumnComposer.Configuration);
    _initialise(config: IColumnComposer.Configuration): void;
    _getColumnConfig(column: any): HTMLElement;
    open(): void;
    close(): void;
    refresh(config: IColumnComposer.Configuration): void;
    destroy(): void;
}
