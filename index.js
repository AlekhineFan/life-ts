"use strict";
var CellState;
(function (CellState) {
    CellState[CellState["Dead"] = 0] = "Dead";
    CellState[CellState["Live"] = 1] = "Live";
})(CellState || (CellState = {}));
var Cell = /** @class */ (function () {
    function Cell(coordinates) {
        this.currentState = this.decideInitialState();
        this.nextState = CellState.Dead;
        this.coordinates = coordinates;
    }
    Cell.prototype.decideInitialState = function () {
        var rnd = Math.floor(Math.random() * 8);
        return rnd === 5 ? CellState.Live : CellState.Dead;
    };
    Cell.prototype.getCurrentState = function () {
        return this.currentState;
    };
    Cell.prototype.setNextState = function (cellState) {
        this.nextState = cellState;
    };
    return Cell;
}());
var CellDictionary = /** @class */ (function () {
    function CellDictionary() {
        this.Search = {};
    }
    return CellDictionary;
}());
var TableManager = /** @class */ (function () {
    function TableManager(cells, htmlCells) {
        this.cellRows = cells;
        this.htmlCells = htmlCells;
        this.start();
    }
    TableManager.prototype.getStatesSetColors = function () {
        var _this = this;
        this.cellRows.forEach(function (row) {
            row.forEach(function (cell) {
                var currentState = cell.currentState;
                var key = cell.coordinates.positionX + ":" + cell.coordinates.positionY;
                var htmlCell = _this.htmlCells.Search[key];
                var isLiving = currentState === 1 ? true : false;
                _this.setCellColor(htmlCell, isLiving);
            });
        });
    };
    TableManager.prototype.setCellColor = function (htmlCell, isLiving) {
        if (isLiving) {
            htmlCell.classList.remove('cell-dead');
            htmlCell.classList.add('cell-living');
        }
        else {
            htmlCell.classList.remove('cell-living');
            htmlCell.classList.add('cell-dead');
        }
    };
    TableManager.prototype.getNeigboursAndSetNextState = function (cell) {
        var _a = cell.coordinates, positionX = _a.positionX, positionY = _a.positionY;
        var neighbours = [];
        if (positionY - 1 > 0) {
            neighbours.push(this.cellRows[positionX][positionY - 1]);
            if (positionX - 1 > 0) {
                neighbours.push(this.cellRows[positionX - 1][positionY - 1]);
            }
        }
        if (positionX - 1 > 0) {
            neighbours.push(this.cellRows[positionX - 1][positionY]);
            if (positionY + 1 < 49) {
                neighbours.push(this.cellRows[positionX - 1][positionY + 1]);
            }
        }
        if (positionY + 1 < 49) {
            neighbours.push(this.cellRows[positionX][positionY + 1]);
            if (positionX + 1 < 49) {
                neighbours.push(this.cellRows[positionX + 1][positionY + 1]);
            }
        }
        if (positionX + 1 < 49) {
            neighbours.push(this.cellRows[positionX + 1][positionY]);
            if (positionY - 1 > 0) {
                neighbours.push(this.cellRows[positionX + 1][positionY - 1]);
            }
        }
        var numberOfConnections = neighbours.filter(function (cell) { return cell.currentState === CellState.Live; }).length;
        if (cell.currentState === CellState.Live) {
            if (numberOfConnections === 2 || numberOfConnections === 3) {
                cell.nextState = CellState.Live;
            }
            else {
                cell.nextState = CellState.Dead;
            }
        }
        else {
            if (numberOfConnections === 3) {
                cell.nextState = CellState.Live;
            }
        }
    };
    TableManager.prototype.setNextStateForTable = function () {
        var _this = this;
        this.cellRows.forEach(function (row) {
            row.forEach(function (cell) {
                _this.getNeigboursAndSetNextState(cell);
            });
        });
        this.switchToNext();
    };
    TableManager.prototype.switchToNext = function () {
        this.cellRows.forEach(function (row) {
            row.forEach(function (cell) {
                cell.currentState = cell.nextState;
            });
        });
    };
    TableManager.prototype.start = function () {
        var _this = this;
        setInterval(function () {
            _this.getStatesSetColors();
            _this.setNextStateForTable();
        }, 500);
    };
    return TableManager;
}());
function createCells(size) {
    var cellRows = [];
    for (var i = 0; i < size; i++) {
        var cells = [];
        for (var j = 0; j < size; j++) {
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
    var tableCells = new CellDictionary();
    var table = document.createElement('table');
    for (var i = 0; i < size; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < size; j++) {
            var data = document.createElement('td');
            data.setAttribute('row', i.toString());
            data.setAttribute('col', j.toString());
            setInitialAttribute(data);
            row.appendChild(data);
            var key = i.toString() + ":" + j.toString();
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
var tableCells = setupTable(50);
var cellRepresentations = createCells(50);
var manager = new TableManager(cellRepresentations, tableCells);
