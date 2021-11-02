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
    this.currentState = this.decideInitialState();
    this.nextState = CellState.Dead;
    this.coordinates = coordinates;
  }

  decideInitialState(): CellState {
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
  cellRows: Array<Array<Cell>>;
  htmlCells: CellDictionary;
}

class TableManager {
  constructor(cells: Array<Array<Cell>>, htmlCells: CellDictionary) {
    this.cellRows = cells;
    this.htmlCells = htmlCells;

    this.start();
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

    const numberOfConnections = neighbours.filter(cell => cell.currentState === CellState.Live).length;

    if (cell.currentState === CellState.Live) {
      if(numberOfConnections === 2 || numberOfConnections === 3) {
        cell.nextState = CellState.Live;
      } else {
        cell.nextState = CellState.Dead;
      }
    } else {
      if (numberOfConnections === 3) {
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
    setInterval(() => {
      this.getStatesSetColors();
      this.setNextStateForTable();
    }, 500);
  }
}

function createCells(size: number): Array<Array<Cell>> {
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

function setupTable(size: number): CellDictionary {
  const tableCells = new CellDictionary();
  const table = document.createElement('table');
  for(let i = 0; i < size; i ++) {
    const row = document.createElement('tr');
    for(let j = 0; j < size; j++) {
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
  document.querySelector('#main-table')?.append(table);
  return tableCells;
}

function setInitialAttribute(tableCell: HTMLTableDataCellElement): void {
  tableCell.classList.add('table-cell');
}

const tableCells = setupTable(50);
const cellRepresentations = createCells(50);

const manager = new TableManager(cellRepresentations, tableCells);