"use strict";
var CellState;
(function (CellState) {
    CellState[CellState["Dead"] = 0] = "Dead";
    CellState[CellState["Live"] = 1] = "Live";
})(CellState || (CellState = {}));
class Cell {
    constructor(coordinates) {
        this.currentState = this.decideInitialState();
        this.nextState = CellState.Dead;
        this.coordinates = coordinates;
    }
    decideInitialState() {
        const rnd = Math.floor(Math.random() * 10);
        return rnd === 5 ? CellState.Live : CellState.Dead;
    }
    getCurrentState() {
        return this.currentState;
    }
    setNextState(cellState) {
        this.nextState = cellState;
    }
}
class CellDictionary {
    constructor() {
        this.Search = {};
    }
}
class TableManager {
    constructor(cells, htmlCells) {
        this.cellRows = cells;
        this.htmlCells = htmlCells;
        this.start();
    }
    getStatesSetColors() {
        this.cellRows.forEach(row => {
            row.forEach(cell => {
                const { currentState } = cell;
                const key = `${cell.coordinates.positionX}:${cell.coordinates.positionY}`;
                const htmlCell = this.htmlCells.Search[key];
                const isLiving = currentState === 1 ? true : false;
                this.setCellColor(htmlCell, isLiving);
            });
        });
    }
    setCellColor(htmlCell, isLiving) {
        if (isLiving) {
            htmlCell.classList.remove('cell-dead');
            htmlCell.classList.add('cell-living');
        }
        else {
            htmlCell.classList.remove('cell-living');
            htmlCell.classList.add('cell-dead');
        }
    }
    getNeigboursAndSetNextState(cell) {
        const { positionX, positionY } = cell.coordinates;
        const neighbours = [];
        if (positionY - 1 > 0) {
            neighbours.push(this.cellRows[positionX][positionY - 1]);
        }
        if (positionX - 1 > 0) {
            neighbours.push(this.cellRows[positionX - 1][positionY]);
        }
        if (positionY + 1 < 49) {
            neighbours.push(this.cellRows[positionX][positionY + 1]);
        }
        if (positionX + 1 < 49) {
            neighbours.push(this.cellRows[positionX + 1][positionY]);
        }
        const numberOfConnections = neighbours.filter(cell => cell.currentState === CellState.Live).length;
        if (numberOfConnections < 2 || numberOfConnections > 3) {
            cell.nextState = CellState.Dead;
        }
        else {
            cell.nextState = CellState.Live;
        }
    }
    setNextStateForTable() {
        this.cellRows.forEach(row => {
            row.forEach(cell => {
                this.getNeigboursAndSetNextState(cell);
            });
        });
        this.switchToNext();
    }
    switchToNext() {
        this.cellRows.forEach(row => {
            row.forEach(cell => {
                cell.currentState = cell.nextState;
            });
        });
    }
    start() {
        setInterval(() => {
            this.getStatesSetColors();
            this.setNextStateForTable();
        }, 500);
    }
}
function createCells(size) {
    const cellRows = [];
    for (let i = 0; i < size; i++) {
        const cells = [];
        for (let j = 0; j < size; j++) {
            cells.push(new Cell({
                positionX: i,
                positionY: j,
            }));
        }
        cellRows.push(cells);
    }
    return cellRows;
}
function setupTable(size) {
    var _a;
    const tableCells = new CellDictionary();
    const table = document.createElement('table');
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            const data = document.createElement('td');
            data.setAttribute('row', i.toString());
            data.setAttribute('col', j.toString());
            setInitialAttribute(data);
            row.appendChild(data);
            const key = `${i.toString()}:${j.toString()}`;
            tableCells.Search[key] = data;
        }
        table.appendChild(row);
    }
    (_a = document.querySelector('#main-table')) === null || _a === void 0 ? void 0 : _a.append(table);
    return tableCells;
}
function setInitialAttribute(tableCell) {
    tableCell.classList.add('table-cell');
}
const tableCells = setupTable(50);
const cellRepresentations = createCells(50);
const manager = new TableManager(cellRepresentations, tableCells);
