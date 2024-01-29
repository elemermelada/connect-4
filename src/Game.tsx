import "./Game.css";

import { Column, Move, renderColumn } from "./Column";

export class Game {
  row_count: number;
  col_count: number;

  columns: Column[];

  constructor(row_count: number, col_count: number) {
    this.row_count = row_count;
    this.col_count = col_count;

    this.columns = [];
    for (let i = 0; i < col_count; i++) {
      this.columns.push(new Column(row_count));
    }
  }

  playMove = (move: Move, columnIndex: number) => {
    if (this.isComplete()) return false;
    return this.columns[columnIndex].playMove(move);
  };

  playRandomMove = (move: Move) => {
    if (this.isComplete()) return false;
    var randomMove = Math.floor(Math.random() * 0.999 * this.col_count);
    while (!this.playMove(move, randomMove)) {
      randomMove = Math.floor(Math.random() * 0.999 * this.col_count);
    }
    return true;
  };

  isComplete = () => {
    const winStatus = this.checkWin();
    if (winStatus !== 0) {
      alert(winStatus);
      return true;
    }
    return this.columns.reduce((prev, col) => prev && col.isComplete(), true);
  };

  checkWin = () => {
    // Check columns
    for (let i = 0; i < this.col_count; i++) {
      const winStatus = this.columns[i].checkWin();
      if (winStatus === 0) continue;
      return winStatus;
    }

    // Check rows
    for (let i = 0; i < this.row_count; i++) {
      const winStatus = checkVectorWin(this.getRow(i));
      if (winStatus === 0) continue;
      return winStatus;
    }

    return 0;
  };

  getRow = (rowIndex: number) => {
    const row: Move[] = [];
    for (let i = 0; i < this.col_count; i++) {
      row.push(this.columns[i].rows[rowIndex]);
    }
    return row;
  };
}

export const renderGame = (
  game: Game,
  selectedColumn: number,
  mouseEnterHandler: (arg0: number) => void,
  clickHandler: (arg0: number) => void,
  gameCompleted: boolean
) => {
  return (
    <div className="game">
      {game.columns.map((c, i) =>
        renderColumn(
          c,
          i,
          selectedColumn === i,
          mouseEnterHandler,
          clickHandler,
          gameCompleted
        )
      )}
    </div>
  );
};

export const checkVectorWin = (vector: Move[]) => {
  console.log(vector);

  var lastMove = vector[0];
  var moveCount = 1;

  for (let i = 1; i < vector.length; i++) {
    const currMove = vector[i];
    console.log(currMove);
    if (currMove === lastMove) {
      moveCount++;
      if (moveCount === 4) return currMove;
      continue;
    }
    lastMove = currMove;
    moveCount = 1;
  }

  return 0;
};
