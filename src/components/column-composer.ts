import { IColumnComposer } from "../interfaces";

export class ColumnComposer {

    private rootElement: HTMLElement;
   // TODO: pass parent element when column config should be attached
    constructor(config: IColumnComposer.Configuration) {
        const htmlElement: HTMLElement = document.createElement('DIV');
        htmlElement.innerHTML = 
        `<section class="column-composer-container ${(config && config.cls) || ''} column-composer-container-hidden">
            <div class="hidden-column-list-container">
                <div class="quick-filter-container">
                    <input
                        type"text"    
                        class="quick-filter"
                        placeholder="Type here to seach"
                    />
                </div>
            </div>
            <div class="visible-column-list-container">
                <div class="quick-filter-container">
                    <input
                        type"text"    
                        class="quick-filter"
                        placeholder="Type here to seach"
                    />
                </div>
                
            </div>
        <section>`;
        this.rootElement = htmlElement.firstChild as HTMLElement
        this._initialise(config);
        const parent = config.parentId ? document.body.querySelector(`#${config.parentId}`) : document.body;
        parent.appendChild(this.rootElement)
    }

    // TODO: Should we use access identifiers
    _initialise(config: IColumnComposer.Configuration) {
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
    _getColumnConfig(column: any): HTMLElement {
        const element = document.createElement('LI');
        element.classList.add('column-config');
        element.innerHTML = 
        `
            <div>${column.hide ? 'hidden': 'visible'}</div>
            <div>${column.hide ? '' : column.pinned}</div>    
            <div>${column.headerName ? column.headerName : column.field}</div>
        
        `;
        return element;
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

  }