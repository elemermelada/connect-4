import "./Column.css";
import { checkVectorWin } from "./Game";

export type Move = 0 | -1 | 1; // None, CPU, Player

export class Column {
  row_count: number;
  rows: Move[];

  constructor(row_count: number) {
    this.row_count = row_count;
    this.rows = Array(row_count).fill(0);
  }

  playMove = (move: Move) => {
    const first_empty = this.rows.indexOf(0);
    if (first_empty === -1) return false;
    this.rows[first_empty] = move;
    return true;
  };

  isComplete = () => {
    const first_empty = this.rows.indexOf(0);
    if (first_empty === -1) return true;
    return false;
  };

  checkWin = () => {
    const first_empty = this.rows.indexOf(0);
    if (first_empty < 3) return 0;
    return checkVectorWin(this.rows);
  };
}

export const renderMove = (move: Move, isSelected: boolean) => {
  var col = "white";
  if (move === 1) col = "green";
  if (move === -1) col = "red";

  return (
    <div
      className={isSelected ? "move selected" : "move"}
      style={{ backgroundColor: col }}
    ></div>
  );
};

export const renderColumn = (
  column: Column,
  index: number,
  isSelected: boolean,
  mouseEnterHandler: (arg0: number) => void,
  clickHandler: (arg0: number) => void,
  gameCompleted: boolean
) => {
  return (
    <div
      className="column"
      style={{ cursor: gameCompleted ? "default" : "pointer" }}
      onMouseEnter={() => {
        if (gameCompleted) return;
        mouseEnterHandler(index);
      }}
      onClick={() => {
        if (gameCompleted) return;
        clickHandler(index);
      }}
    >
      {column.rows.map((m, i) => {
        if (m === 0 && isSelected) {
          isSelected = false;
          return renderMove(m, true);
        }
        return renderMove(m, false);
      })}
    </div>
  );
};
