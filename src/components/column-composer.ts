import { IColumnComposer } from "../interfaces";

export class ColumnComposer {

    private rootElement: HTMLElement;
    private columns: IColumnComposer.ColumnDefinition[];
    private onConfigUpdate: Function;

    private _handleColumnPin = function ($event) {
        this.onColumnPin($event);
    }.bind(this);

    private _addToVisibleList = function ($event) {
        this.addToVisibleColumns($event);
    }.bind(this);

    private _addToHiddenList = function ($event) {
        this.addToHiddenColumns($event);
    }.bind(this);

    private _onSave = function($event) {
        // TODO: Return clone?
        this.onConfigUpdate(this.columns);
    }.bind(this);

    private _searchColumnList = function($event) {
        this.onSearch($event);
    }.bind(this);

    constructor(config: IColumnComposer.Configuration) {
        const htmlElement: HTMLElement = document.createElement('DIV');
        htmlElement.innerHTML =
            `<section class="column-composer-container ${(config && config.cls) || ''} column-composer-container-hidden">
                <section class="title-bar">
                    <div class="title h1 all-caps">
                        ${config.title ? config.title : 'column configuration'}
                    </div>
                    <div class="actions">
                        <input class="primary-btn" id="btn-save" type="button" value="Save" />
                        <input type="button" value="Cancel"/>
                    </div>
                </section>
                <section class="body">
                    <div class="hidden-column-list-container">
                        <div class="h3 bold caps">
                            Hidden Columns
                        </div>
                        <div class="quick-filter-container">
                            <input
                                type"text"    
                                class="quick-filter"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                    <div class="visible-column-list-container">
                        <div class="h3 bold caps">
                            Visible Columns
                        </div>
                        <div class="quick-filter-container">
                            <input
                                type"text"    
                                class="quick-filter"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                </section>
            <section>`;
        this.rootElement = htmlElement.firstChild as HTMLElement;
        this._initialise(config);
        const parent = config.parentId && document.body.querySelector(`#${config.parentId}`);
        if (!parent) {
            if (console) {
                console.error(`Invalid configuration passed, cannot find parent container for column configuration.`);
            }
        }
        parent.appendChild(this.rootElement);
    }

    open() {
        this.rootElement.classList.remove('column-composer-container-hidden')
    }

    close() {
        this.rootElement.classList.add('column-composer-container-hidden')
    }

    _initialise(config: IColumnComposer.Configuration) {
        this.onConfigUpdate = config.onConfigUpdate;
        // Save Button
        this.rootElement.querySelector('.actions #btn-save').addEventListener('click', this._onSave);
        // Quick Filters
        debugger;
        this.rootElement.querySelector('.hidden-column-list-container .quick-filter-container input.quick-filter')
            .addEventListener('keyup', this._searchColumnList);
        this.rootElement.querySelector('.visible-column-list-container .quick-filter-container input.quick-filter')
            .addEventListener('keyup', this._searchColumnList);

        this._initialiseColumns(config.columns);
    }

    refresh(columnDefiniton: IColumnComposer.ColumnDefinition) {
        this._initialiseColumns(columnDefiniton);
    }

    destroy() {
        const saveBtn: Element = this.rootElement.querySelector('.actions #btn-save');
        saveBtn.removeEventListener('click', this._onSave);
        // TODO: Remove all events
    }

    onSearch($event: Event) {
        const test = $event.srcElement['value'];
        const container = $event.srcElement.parentElement.parentElement;
        if(!test) {
            (container.querySelectorAll(`.column-list li`) as any).forEach((elem) => {
                elem.classList.remove('display-none');
            });
            return;
        }
        (container.querySelectorAll(`.column-list li:not([data-val*="${test.toLowerCase()}"])`) as any).forEach((elem) => {
            elem.classList.add('display-none');
        });
        (container.querySelectorAll(`.column-list li[data-val*="${test.toLowerCase()}"]`) as any).forEach((elem) => {
            elem.classList.remove('display-none');
        });
    }

    private _initialiseColumns(columns: IColumnComposer.ColumnDefinition) {
        // TODO: store clone array?
        this.columns = columns;

        const existingLists: HTMLElement[] = [
            this.rootElement.querySelector('.hidden-column-list-container>.column-list'),
            this.rootElement.querySelector('.visible-column-list-container>.column-list')
        ];
        const newColumnLists: HTMLElement[] = [
            this._createColumnList(columns, true),
            this._createColumnList(columns, false)
        ];

        newColumnLists.forEach(
            (listElement, index) => this._addOrReplaceListElementToContainer(listElement, existingLists[index], index === 0)
        );
    }

    private _createColumnList(columns: IColumnComposer.ColumnDefinition[], isHiddenList) {
        const cols = this._getSortedListByType(columns, isHiddenList);
        const columnList: HTMLElement = document.createElement('UL');
        columnList.classList.add('column-list');
        cols.forEach((column) => {
            columnList.appendChild(this._getColumnConfig(column));
        });
        return columnList;
    }

    private _addOrReplaceListElementToContainer(listElement: HTMLElement, existingElement: HTMLElement, isHiddenList: boolean) {
        const container = isHiddenList
            ? this.rootElement.querySelector('.hidden-column-list-container')
            : this.rootElement.querySelector('.visible-column-list-container');
        if (existingElement) {
            this._removeEvents(existingElement, isHiddenList);
            container.replaceChild(listElement, existingElement);
        } else {
            container.appendChild(listElement);
            this._addEvents(listElement, isHiddenList);
        }
    }

    private _getSortedListByType(columns, hidden: boolean) {
        return hidden
            ? columns.filter(column => column.hide).sort(this._sortByNameFn)
            : columns.filter(column => !column.hide).sort(this._sortByDisplayOrderFn);
    }

    private _sortByNameFn = function (a, b) {
        return a.headerName.toLowerCase().localeCompare(b.headerName.toLowerCase());
    }

    private _sortByDisplayOrderFn = function (a, b) {
        return a.displayOrder < b.displayOrder ? -1 : a.displayOrder > b.displayOrder ? 1 : 0;
    }

    private _addEvents(columnList: Element, isHiddenColumnList: boolean) {
        if (isHiddenColumnList) {
            const addIcons: any = columnList.querySelectorAll('.plus-circle');
            addIcons.forEach((addIcon: Element) => {
                addIcon.addEventListener('click', this._addToVisibleList);
            });
        } else {
            const pinButtons: any = columnList.querySelectorAll('.pin-button');
            pinButtons.forEach((pinButton: Element) => {
                pinButton.addEventListener('click', this._handleColumnPin);
            });
            const removeIcons: any = columnList.querySelectorAll('.cross-circle');
            removeIcons.forEach((removeIcon: Element) => {
                removeIcon.addEventListener('click', this._addToHiddenList);
            });
        }
    }

    private _removeEvents(columnConfig: Element, isHiddenColumnList: boolean) {
        if (isHiddenColumnList) {
            const addIcons: any = columnConfig.querySelectorAll('.plus-circle');
            addIcons.forEach((addIcon: Element) => {
                addIcon.removeEventListener('click', this._addToVisibleList);
            });
        } else {
            const pinButtons: any = columnConfig.querySelectorAll('.pin-button');
            pinButtons.forEach((pinButton: Element) => {
                pinButton.removeEventListener('click', this._handleColumnPin);
            });
            const removeIcons: any = columnConfig.querySelectorAll('.cross-circle');
            removeIcons.forEach((removeIcon: Element) => {
                removeIcon.removeEventListener('click', this._addToHiddenList);
            });
        }
    }

    private _getColIndex(column) {
        const sortedList = this._getSortedListByType(this.columns, column.hide);
        sortedList.forEach((element, index )=> {
            return element.field === column.field;
        })

    }

    private onColumnPin($event) {
        const direction: string = $event.srcElement.id.indexOf(`-pin-left`) > -1
            ? `left`
            : $event.srcElement.id.indexOf(`-pin-right`) > -1
                ? `right`
                : '';
        this.columns
            .filter(column => ($event.srcElement.id === `${column.field}-pin-left`) || ($event.srcElement.id === `${column.field}-pin-right`))
            .forEach((column) => {
                const isPinRemoved: boolean = column.pinned === direction;
                if(isPinRemoved) {
                    column.pinned = '';
                    event.srcElement.classList.remove('active');
                } else {
                    column.pinned && $event.srcElement.parentElement.querySelector(`#${column.field}-pin-${column.pinned}`).classList.remove('active');
                    column.pinned = direction;
                    event.srcElement.classList.add('active');
                }
            });
    }

    private _findConfigElement(element: Element): Element {
        let parent: Element = element.parentElement;
        while (parent && parent.tagName.toLowerCase() !== 'body') {
            if(parent.classList.contains('column-config')) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    // TODO: addToVisibleColumns and addToHiddenColumns can be merged to single function
    private addToVisibleColumns($event) {
        const configElement = $event.srcElement.parentNode;
        let insertPosition = -1;

        const column = this.columns
            .filter(column => (configElement.id === `${column.field}`))[0];
        this._removeEvents(configElement, true);
        configElement.parentNode.removeChild(configElement);
        if (column) {
            column.hide = false;
            const colConfig = this._getColumnConfig(column);
            const insertIndex = this._getInsertIndex(column, this.columns);
            const configs: NodeListOf<Element> = this.rootElement.querySelectorAll('.visible-column-list-container .column-list .column-config');
            this.rootElement.querySelector('.visible-column-list-container .column-list').insertBefore(colConfig, configs[insertIndex]);
            this._addEvents(colConfig, false);
        }
    }

    private addToHiddenColumns($event) {
        const configElement = $event.srcElement.parentNode;
        const column = this.columns
            .filter(column => (configElement.id === `${column.field}`))[0];
        this._removeEvents(configElement, false);
        configElement.parentNode.removeChild(configElement);
        if (column) {
            column.hide = true;
            const colConfig = this._getColumnConfig(column);
            const insertIndex = this._getInsertIndex(column, this.columns);
            const configs: NodeListOf<Element> = this.rootElement.querySelectorAll('.hidden-column-list-container .column-list .column-config');
            this.rootElement.querySelector('.hidden-column-list-container .column-list').insertBefore(colConfig, configs[insertIndex]);
            this._addEvents(colConfig, true);
        }
    }

    private _getInsertIndex(column: IColumnComposer.ColumnDefinition, columns: IColumnComposer.ColumnDefinition[]) {
        let index = -1;
        const isHidden: boolean = column.hide;
        const sortedArr: IColumnComposer.ColumnDefinition[] = this._getSortedListByType(columns, isHidden);
        // TODO: fallback to classic for loop as none of fancy es6 functions worked.
        for(let i = 0; i < sortedArr.length; i ++) {
            if(sortedArr[i].field === column.field) {
                index = i;
                break;
            }
        }
        return index;
    }

    // TODO: THis should be another component
    private _getColumnConfig(column: IColumnComposer.ColumnDefinition): HTMLElement {
        const element = document.createElement('LI');
        element.classList.add('column-config');
        element.id = column.field;
        element.setAttribute('data-val', column.headerName.toLowerCase())
        element.innerHTML =
            `
            ${column.hide
                ? '<div id="show-column" class="plus-circle"></div>'
                : '<div id="hide-column" class="cross-circle"></div>'
            }
            <div class="pin-icon">
                <div class="pinned-menu">
                    <div id="${column.field}-pin-left" class="pin-button ${column.pinned === 'left' ? 'active': ''}">
                        Pin Left
                    </div>
                    <div id="${column.field}-pin-right" class="pin-button ${column.pinned === 'right' ? 'active': ''}">
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