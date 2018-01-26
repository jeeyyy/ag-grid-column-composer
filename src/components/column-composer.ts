import { IColumnComposer } from "../interfaces";

export class ColumnComposer {

    private rootElement: HTMLElement;
    private columns: IColumnComposer.ColumnDefinition[];
    private configUpdated: Function;

    private _handleColumnPin = function($event) {
        this.onColumnPin($event);
    }.bind(this);

   // TODO: pass parent element when column config should be attached
    constructor(config: IColumnComposer.Configuration) {
        const htmlElement: HTMLElement = document.createElement('DIV');
        htmlElement.innerHTML = 
        `<section class="column-composer-container ${(config && config.cls) || ''} column-composer-container-hidden">
            <div class="hidden-column-list-container">
                <div class="quick-filter-container">
                    <div class="h3 bold caps">
                        Hidden Columns
                    </div>
                    <input
                        type"text"    
                        class="quick-filter"
                        placeholder="Type here to seach"
                    />
                </div>
            </div>
            <div class="visible-column-list-container">
                <div class="quick-filter-container">
                    <div class="h3 bold caps">
                        Visible Columns
                    </div>
                    <input
                        type"text"    
                        class="quick-filter"
                        placeholder="Type here to seach"
                    />
                </div>
                
            </div>
        <section>`;
        this.rootElement = htmlElement.firstChild as HTMLElement
        const parent = config.parentId && document.body.querySelector(`#${config.parentId}`);
        if(!parent) {
            if(console) {
                console.error(`Invalid configuration passed, cannot find parent container for column configuration.`);
            }
        }
        this.columns = config.columns;
        this._initialise(config);
        parent.appendChild(this.rootElement);
    }

    open() {
        this.rootElement.classList.remove('column-composer-container-hidden')
    }

    close() {
        this.rootElement.classList.add('column-composer-container-hidden')
    }

    refresh(config: IColumnComposer.Configuration) {
        this._initialise(config);
    }

    destroy() {
        // TODO: Cleanup        
    }

    onColumnPin($event) {
        debugger;
        console.log($event);
        // this.columns.filter(column => (id === `${column.field}-pin-left`) || (id === `${column.field}-pin-right`) )
    }

    private _initialise(config: IColumnComposer.Configuration) {
        const existingLists = [this.rootElement.querySelector('.hidden-column-list-container>.column-list'), this.rootElement.querySelector('.visible-column-list-container>.column-list')];
        const hiddenColumnList: HTMLElement = document.createElement('UL');
        const visibleColumnList: HTMLElement = document.createElement('UL');
        hiddenColumnList.classList.add('column-list');
        visibleColumnList.classList.add('column-list');
        config.columns.forEach((column) => {
            // TODO: User reduce to create 2 arrays and then process vs if else.

            if(column.hide) {
                hiddenColumnList.appendChild(this._getColumnConfig(column));
            } else {
                visibleColumnList.appendChild(this._getColumnConfig(column));
            }
        });

        if(existingLists[0]) {
            this.rootElement.querySelector('.hidden-column-list-container').replaceChild(hiddenColumnList, existingLists[0]);
        } else {
            this.rootElement.querySelector('.hidden-column-list-container').appendChild(hiddenColumnList);
        }
        if(existingLists[1]) {
            this.rootElement.querySelector('.visible-column-list-container').replaceChild(visibleColumnList, existingLists[1]);
            this._removeEvents(existingLists[1]);
        } else {
            this.rootElement.querySelector('.visible-column-list-container').appendChild(visibleColumnList);
        }
        this._addEvents(visibleColumnList);
    }

    private _addEvents(columnList: Element) {
        const columns: any = columnList.querySelectorAll('.column-config');
        columns.forEach((column: Element) => {
            column.addEventListener('click', this._handleColumnPin);
        });
    }

    private _removeEvents(columnList: Element) {
        const columns: any = columnList.querySelectorAll('.column-config');
        columns.forEach((element: Element) => {
            element.removeEventListener('click', this._handleColumnPin);
        });
    }

    // TODO: THis should be another component
    private _getColumnConfig(column: IColumnComposer.ColumnDefinition): HTMLElement {
        const element = document.createElement('LI');
        element.classList.add('column-config');
        element.innerHTML = 
        `
            ${column.hide 
                ? '<div id="show-column" class="plus-circle"></div>'
                : '<div id="hide-column" class="cross-circle"></div>'
            }
            <div class="pin-icon">
                <div class="pinned-menu">
                    <div id="${column.field}-pin-left" class="">
                        Pin Left
                    </div>
                    <div id="pin-right" class="">
                        Pin Right
                    </div>
                </div>
                <div class="${column.hide ? '' : 'eye'}">
                </div>
            </div>    
            <div>${column.headerName ? column.headerName : column.field}</div>
        `;
        return element;
    }

    private _pincolumn(column: IColumnComposer.ColumnDefinition, direction: string) {
        column.pinned = column.pinned !== direction ? direction : '';
    }
    
}