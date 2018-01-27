// import * as ColumnComposer from '../dist/ag-grid-column-composer.js';
import './index.pcss';
import { IColumnComposer } from '../src/index';
import { ColumnComposer } from '../src/index';

const columns = [
    {
        headerName: 'Header Field1',
        field: 'field1',
        hide: false,
        pinned: false,
        displayOrder: 3
    }, {
        headerName: 'Header Field2',
        field: 'field2',
        hide: false,
        pinned: 'left',
        displayOrder: 2
    }, {
        headerName: 'Header Field3',
        field: 'field3',
        hide: true,
        pinned: false,
        displayOrder: 4
    }, {
        headerName: 'Header Field4',
        field: 'field4',
        hide: false,
        pinned: 'right',
        displayOrder: 1
    }, {
        headerName: '1 Header Field4',
        field: 'field5',
        hide: true,
        pinned: 'right',
        displayOrder: 6
    }];

/* const config: IColumnComposer.Configuration = {
    columns,
    type: IColumnComposer.ConfigType.AG_GRID
}
 */

const handleConfigUpdate = (newConfig) => {
    console.log(`config Updated: `, newConfig);
};

const config: IColumnComposer.Configuration = {
    columns,
    type: 1,
    parentId: 'config-container',
    onConfigUpdate: handleConfigUpdate
}

const columnComposer = new ColumnComposer(config);
columnComposer.open();

