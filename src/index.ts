enum CellState {
  Dead,
  Live
}

interface Coordinates {
  positionX: number,
  positionY: number
}

interface Cell {
  currentState: CellState,
  nextState: CellState,
  coordinates: Coordinates
}

class Cell {
  constructor(coordinates: Coordinates) {
    this.currentState = this.getRandomInitialState();
    this.nextState = CellState.Dead;
    this.coordinates = coordinates;
  }

  getRandomInitialState(): CellState {
    const rnd = Math.floor(Math.random() * 8);
    return rnd === 5? CellState.Live : CellState.Dead;
  }

  getCurrentState(): CellState {
    return this.currentState;
  }

  setNextState(cellState: CellState): void {
    this.nextState = cellState;
  }
}

interface Dictionary<HTMLTableDataCellElement> {
  [key: string]: HTMLTableDataCellElement
}

class CellDictionary {
  Search: Dictionary<HTMLTableDataCellElement> = {};
}

interface TableManager {
  rowSize: number;
  cellRows: Array<Array<Cell>>;
  htmlCells: CellDictionary;
  timer: number | undefined;
}

class TableManager {
  constructor(rowSize: number) {
    this.rowSize = rowSize;
    this.cellRows = this.createCells(this.rowSize);
    this.htmlCells = this.createHtmlCellDictionary(this.rowSize);

    this.timer = undefined;
    this.start();
  }

  createCells(size: number): Array<Array<Cell>> {
    const cellRows = [];
    for(let i = 0; i < size; i++) {
      const cells = [];
      for(let j = 0; j < size; j++) {
        cells.push(new Cell({
          positionX: i,
          positionY: j,
        }));
      }
      cellRows.push(cells);
    }
    return cellRows;
  }

  createHtmlCellDictionary(size: number): CellDictionary {
    const tableCells = new CellDictionary();
    const table = document.createElement('table');
    for(let i = 0; i < size; i ++) {
      const row = document.createElement('tr');
      for(let j = 0; j < size; j++) {
        const data = document.createElement('td');
        data.setAttribute('row', i.toString());
        data.setAttribute('col', j.toString());
        this.setInitialAttribute(data);
        row.appendChild(data);
        const key = `${i.toString()}:${j.toString()}`;
        tableCells.Search[key] = data;
      }
      table.appendChild(row);
    }
    document.querySelector('#main-table')?.append(table);
    return tableCells;
  }

  setInitialAttribute(tableCell: HTMLTableDataCellElement): void {
    tableCell.classList.add('table-cell');
  }

  getStatesSetColors(): void {
    this.cellRows.forEach(row => {
      row.forEach(cell => {
        const { currentState } = cell;
        const key = `${cell.coordinates.positionX}:${cell.coordinates.positionY}`;
        const htmlCell = this.htmlCells.Search[key];
        const isLiving = currentState === 1? true : false;
        this.setCellColor(htmlCell, isLiving);
      });
    });
  }

  setCellColor(htmlCell: HTMLTableDataCellElement, isLiving: boolean): void {
    if(isLiving) {
      htmlCell.classList.remove('cell-dead');
      htmlCell.classList.add('cell-living');
    } else {
      htmlCell.classList.remove('cell-living');
      htmlCell.classList.add('cell-dead');
    }
  }

  getNeigboursAndSetNextState(cell: Cell): void {
    const { positionX, positionY } = cell.coordinates;
    const neighbours = [];
    const edge = this.rowSize - 1;

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

    const connectionsWithLiveCells = neighbours.filter(cell => cell.currentState === CellState.Live).length;

    this.setNextStateForCell(connectionsWithLiveCells, cell);
  }

  setNextStateForCell(connectionsWithLiveCells: number, cell: Cell): void {
    if (cell.currentState === CellState.Live) {
      if(connectionsWithLiveCells === 2 || connectionsWithLiveCells === 3) {
        cell.nextState = CellState.Live;
      } else {
        cell.nextState = CellState.Dead;
      }
    } else {
      if (connectionsWithLiveCells === 3) {
        cell.nextState = CellState.Live;
      }
    }
  }

  setNextStateForTable(): void {
    this.cellRows.forEach(row => {
      row.forEach(cell => {
        this.getNeigboursAndSetNextState(cell);
      });
    });
    this.switchToNext();
  }

  switchToNext(): void {
    this.cellRows.forEach(row => {
      row.forEach(cell => {
        cell.currentState = cell.nextState;
      });
    });
  }

  start(): void {
    this.timer = setInterval(() => {
      this.getStatesSetColors();
      this.setNextStateForTable();
    }, 400);
  }

  pause(): void {
    clearInterval(this.timer);
  }
}

const manager = new TableManager(170);