import "./Game.css";

import { Column, Move, renderColumn } from "./Column";
import { coordinates } from "./Board";

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
    if (this.isComplete().status) return false;
    return this.columns[columnIndex].playMove(move);
  };

  playRandomMove = (move: Move) => {
    if (this.isComplete().status) return false;
    var randomMove = Math.floor(Math.random() * 0.999 * this.col_count);
    while (!this.playMove(move, randomMove)) {
      randomMove = Math.floor(Math.random() * 0.999 * this.col_count);
    }
    return true;
  };

  isComplete = () => {
    const winStatus = this.checkWin();
    if (winStatus.winner !== 0) {
      //  alert(winStatus);
      return { status: true, ...winStatus };
    }
    return {
      status: this.columns.reduce(
        (prev, col) => prev && col.isComplete(),
        true
      ),
      winner: 0 as 0,
    };
  };

  checkDiagonalWin = (col: number, row: number, direction: 1 | -1 = 1) => {
    const diagonal: Move[] = [];
    while (true) {
      // Could definitelly refactor this
      const move = this.columns[col].rows[row];
      diagonal.push(move);
      col += direction;
      row++;
      if (col === this.col_count || row === this.row_count) break;
      if (col === -1 || row === -1) break;
    }
    const winStatus = checkVectorWin(diagonal);
    if (winStatus.winner === 0) return { winner: 0 as 0, coordinates: [] };

    const winCoordinates: coordinates[] = Array(4)
      .fill(0)
      .map((_, index) => {
        return {
          col: col + winStatus.pos + index * direction - 5 * direction,
          row: row + winStatus.pos + index - 5,
        };
      });
    return { winner: winStatus.winner, coordinates: winCoordinates };
  };

  checkWin = () => {
    // Check columns
    for (let i = 0; i < this.col_count; i++) {
      const winStatus = this.columns[i].checkWin();
      if (winStatus.winner === 0) continue;

      const winCoordinates: coordinates[] = Array(4)
        .fill(0)
        .map((_, index) => {
          return { col: i, row: winStatus.pos + index };
        });
      return { winner: winStatus.winner, coordinates: winCoordinates };
    }

    // Check rows
    for (let i = 0; i < this.row_count; i++) {
      const winStatus = checkVectorWin(this.getRow(i));
      if (winStatus.winner === 0) continue;

      const winCoordinates: coordinates[] = Array(4)
        .fill(0)
        .map((_, index) => {
          return { col: winStatus.pos + index, row: i };
        });
      return { winner: winStatus.winner, coordinates: winCoordinates };
    }

    // Check diagonals
    // This could be improved if cols>rows is guaranteed (repeating many checks now)
    for (let i = 0; i < this.row_count; i++) {
      let winStatus = this.checkDiagonalWin(0, i, 1);
      if (winStatus.winner !== 0) return winStatus;
      winStatus = this.checkDiagonalWin(0, i, -1);
      if (winStatus.winner !== 0) return winStatus;
      winStatus = this.checkDiagonalWin(this.col_count - 1, i, 1);
      if (winStatus.winner !== 0) return winStatus;
      winStatus = this.checkDiagonalWin(this.col_count - 1, i, -1);
      if (winStatus.winner !== 0) return winStatus;
    }
    for (let i = 0; i < this.col_count; i++) {
      let winStatus = this.checkDiagonalWin(i, 0, 1);
      if (winStatus.winner !== 0) return winStatus;
      winStatus = this.checkDiagonalWin(i, 0, -1);
      if (winStatus.winner !== 0) return winStatus;
      // winStatus = this.checkDiagonalWin(i, this.row_count - 1, 1);
      // if (winStatus.winner !== 0) return winStatus;
      // winStatus = this.checkDiagonalWin(i, this.row_count - 1, -1);
      // if (winStatus.winner !== 0) return winStatus;
    }

    return { winner: 0 as 0 };
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
  gameCompleted: boolean,
  winner: Move,
  winCoordinates: coordinates[]
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
          gameCompleted,
          winner,
          winCoordinates
        )
      )}
    </div>
  );
};

export const checkVectorWin = (vector: Move[]) => {
  var lastMove = vector[0];
  var moveCount = 1;

  for (let i = 1; i < vector.length; i++) {
    const currMove = vector[i];
    if (currMove === lastMove && currMove !== 0) {
      moveCount++;
      if (moveCount === 4) return { winner: currMove, pos: i - 3 };
      continue;
    }
    lastMove = currMove;
    moveCount = 1;
  }

  return { winner: 0 as 0, pos: null };
};
