import "./Board.css";

import { useState } from "react";
import { Game, renderGame } from "./Game";

const Board = ({ ...props }) => {
  const rows: number = props.rows;
  const cols: number = props.cols;

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const [game, setGame] = useState<Game>(new Game(rows, cols));
  const [selectedColumn, setSelectedColumn] = useState<number>(-1);

  const startGameHandler = () => {
    setIsStarted(true);
  };

  const renderStartGame = () => {
    return (
      <div className="start_button" onClick={startGameHandler}>
        START
      </div>
    );
  };

  return (
    <div className="board">
      {isStarted
        ? renderGame(
            game,
            selectedColumn,
            setSelectedColumn,
            (i) => {
              if (!game.playMove(1, i)) return;
              if (!game.playRandomMove(-1) || game.isComplete()) {
                setSelectedColumn(-1);
                setGameCompleted(true);
              }

              setGame({ ...game });
            },
            gameCompleted
          )
        : renderStartGame()}
    </div>
  );
};

export default Board;
