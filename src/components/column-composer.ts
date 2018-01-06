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
                <ul class="column-list">
                </ul>
            </div>
        <section>`;
        this.rootElement = htmlElement.firstChild as HTMLElement
        this._initialise(config);
        document.body.appendChild(this.rootElement)
    }

    // TODO: Should we use access identifiers
    _initialise(config: IColumnComposer.Configuration) {
        const columns = config.columns.reduce((arr, column) => {
            return `<li class="column-config">
                        ${column.headerName || column.field} - ${column.hide} - ${column.pinned || '' }
                    </li>`;
        }, []);
        this.rootElement.querySelector('.column-list').appendChild(columns.join(''));
        debugger;
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