import * as ColumnComposer from '../dist/ag-grid-column-composer.js';
// import { IColumnComposer } from '../dist/src/index.d.ts';

const columns = [
    {
        headerName: 'Header Field1',
        field: 'field1',
        hide: false,
        pinned: false
    }, {
        headerName: 'Header Field2',
        field: 'field2',
        hide: false,
        pinned: 'left'
    }, {
        headerName: 'Header Field3',
        field: 'field3',
        hide: true,
        pinned: false
    }, {
        headerName: 'Header Field4',
        field: 'field4',
        hide: false,
        pinned: 'right'
    }];

/* const config: IColumnComposer.Configuration = {
    columns,
    type: IColumnComposer.ConfigType.AG_GRID
}
 */

const config = {
    columns,
    type: 1
}

const columnComposer = new ColumnComposer(config);
debugger;
columnComposer.open();

