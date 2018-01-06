export declare namespace IColumnComposer {
    enum ConfigType {
        ANGULAR = 0,
        AG_GRID = 1,
    }
    type columnDefinitions = any;
    interface Configuration {
        type: ConfigType;
        columns: columnDefinitions[];
        cls?: string;
    }
}
