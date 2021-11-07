"use strict";
var CellState;
(function (CellState) {
    CellState[CellState["Dead"] = 0] = "Dead";
    CellState[CellState["Live"] = 1] = "Live";
})(CellState || (CellState = {}));
var Cell = /** @class */ (function () {
    function Cell(coordinates) {
        this.currentState = this.getRandomInitialState();
        this.nextState = CellState.Dead;
        this.coordinates = coordinates;
    }
    Cell.prototype.getRandomInitialState = function () {
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
    function TableManager(rowSize) {
        this.rowSize = rowSize;
        this.cellRows = this.createCells(this.rowSize);
        this.htmlCells = this.createHtmlCellDictionary(this.rowSize);
        this.timer = undefined;
        this.start();
    }
    TableManager.prototype.createCells = function (size) {
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
    };
    TableManager.prototype.createHtmlCellDictionary = function (size) {
        var _a;
        var tableCells = new CellDictionary();
        var table = document.createElement('table');
        for (var i = 0; i < size; i++) {
            var row = document.createElement('tr');
            for (var j = 0; j < size; j++) {
                var data = document.createElement('td');
                data.setAttribute('row', i.toString());
                data.setAttribute('col', j.toString());
                this.setInitialAttribute(data);
                row.appendChild(data);
                var key = i.toString() + ":" + j.toString();
                tableCells.Search[key] = data;
            }
            table.appendChild(row);
        }
        (_a = document.querySelector('#main-table')) === null || _a === void 0 ? void 0 : _a.append(table);
        return tableCells;
    };
    TableManager.prototype.setInitialAttribute = function (tableCell) {
        tableCell.classList.add('table-cell');
    };
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
        var edge = this.rowSize - 1;
        if (positionY - 1 > 0) {
            neighbours.push(this.cellRows[positionX][positionY - 1]);
            if (positionX - 1 > 0) {
                neighbours.push(this.cellRows[positionX - 1][positionY - 1]);
            }
        }
        if (positionX - 1 > 0) {
            neighbours.push(this.cellRows[positionX - 1][positionY]);
            if (positionY + 1 < edge) {
                neighbours.push(this.cellRows[positionX - 1][positionY + 1]);
            }
        }
        if (positionY + 1 < edge) {
            neighbours.push(this.cellRows[positionX][positionY + 1]);
            if (positionX + 1 < edge) {
                neighbours.push(this.cellRows[positionX + 1][positionY + 1]);
            }
        }
        if (positionX + 1 < edge) {
            neighbours.push(this.cellRows[positionX + 1][positionY]);
            if (positionY - 1 > 0) {
                neighbours.push(this.cellRows[positionX + 1][positionY - 1]);
            }
        }
        var connectionsWithLiveCells = neighbours.filter(function (cell) { return cell.currentState === CellState.Live; }).length;
        this.setNextStateForCell(connectionsWithLiveCells, cell);
    };
    TableManager.prototype.setNextStateForCell = function (connectionsWithLiveCells, cell) {
        if (cell.currentState === CellState.Live) {
            if (connectionsWithLiveCells === 2 || connectionsWithLiveCells === 3) {
                cell.nextState = CellState.Live;
            }
            else {
                cell.nextState = CellState.Dead;
            }
        }
        else {
            if (connectionsWithLiveCells === 3) {
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
        this.timer = setInterval(function () {
            _this.getStatesSetColors();
            _this.setNextStateForTable();
        }, 400);
    };
    TableManager.prototype.pause = function () {
        clearInterval(this.timer);
    };
    return TableManager;
}());
var manager = new TableManager(170);
