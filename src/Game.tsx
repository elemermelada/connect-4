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
    return this.columns.reduce((prev, col) => prev && col.isComplete(), true);
  };
}

export const renderGame = (
  game: Game,
  selectedColumn: number,
  mouseEnterHandler: (arg0: number) => void,
  clickHandler: (arg0: number) => void
) => {
  return (
    <div className="game">
      {game.columns.map((c, i) =>
        renderColumn(
          c,
          i,
          selectedColumn === i,
          mouseEnterHandler,
          clickHandler
        )
      )}
    </div>
  );
};
