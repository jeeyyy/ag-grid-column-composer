import { IColumnComposer } from "../interfaces";

export class ColumnComposer {

    private rootElement: HTMLElement;

    constructor(config: IColumnComposer.Configuration) {
        const htmlElement: HTMLElement = document.createElement('DIV');
        htmlElement.innerHTML = 
        `<section class="column-composer-container ${(config && config.cls) || ''} column-composer-container-hidden">
            <div class="quick-filter-container">
                <input
                    type"text"    
                    class="quick-filter"
                    placeholder="Type here to seach"
                />
            </div>
            <div class="column-list-container">
            </div>
        <section>`;
        this.rootElement = htmlElement.firstChild as HTMLElement
        this._initialise(config);
        document.body.appendChild(this.rootElement)
    }

    // TODO: Should we use access identifiers
    _initialise(config: IColumnComposer.Configuration) {
        const existingList = this.rootElement.querySelector('.column-list');
        const columnList: HTMLElement = document.createElement('UL');
        columnList.classList.add('column-list');
        config.columns.forEach((column) => {
            columnList.appendChild(this._getColumnConfig(column));
        });
        if(existingList) {
            this.rootElement.querySelector('.column-list-container').replaceChild(columnList, existingList);
        } else {
            this.rootElement.querySelector('.column-list-container').appendChild(columnList);
        }
        
    }

    _getColumnConfig(column: any): HTMLElement {
        const element = document.createElement('LI');
        element.classList.add('column-config');
        element.innerHTML = 
        `<span>${column.headerName}</span>
        <span>${column.hide}</span>
        <span>${column.pinned}</span>
        <span>${column.field}</span>
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