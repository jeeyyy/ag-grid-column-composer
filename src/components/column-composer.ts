import { IColumnComposer } from "../interfaces";

export class ColumnComposer {

    private rootElement: HTMLElement;
    private columns: IColumnComposer.ColumnDefinitions[];
    private configUpdated: Function;

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
        parent.appendChild(this.rootElement)
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

    private _initialise(config: IColumnComposer.Configuration) {
        const existingList = this.rootElement.querySelector('.column-list');
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

        if(existingList) {
            this.rootElement.querySelector('.hidden-column-list-container').replaceChild(hiddenColumnList, existingList);
            this.rootElement.querySelector('.visible-column-list-container').replaceChild(visibleColumnList, existingList);
        } else {
            this.rootElement.querySelector('.hidden-column-list-container').appendChild(hiddenColumnList);
            this.rootElement.querySelector('.visible-column-list-container').appendChild(visibleColumnList);
        }
        
    }

    // TODO: THis should be another component
    private _getColumnConfig(column: any): HTMLElement {
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
                    <div id="pin-left" class="pb025 hover-accent ng-binding" ng-click="col.colDef.pinned = col.colDef.pinned !== 'left' ? 'left' : ''">
                        Pin Left
                    </div>
                    <div id="pin-right" class="hover-accent ng-binding" ng-click="col.colDef.pinned = col.colDef.pinned !== 'right' ? 'right' : ''">
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

}