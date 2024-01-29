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
