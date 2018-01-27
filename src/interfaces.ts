export namespace IColumnComposer {

    export enum ConfigType {
        ANGULAR, AG_GRID
    }

    // TODO: This should accept Angular or AG Grid Column configs. Should we add libraries or types as dev dependencies?
    export type ColumnDefinition = any;

    export interface Configuration {
        type: ConfigType,
        columns: ColumnDefinition[] 
        cls?: string,
        parentId: string,
        onConfigUpdate: Function
    }

}