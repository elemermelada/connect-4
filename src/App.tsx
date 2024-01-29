import "./App.css";
import Board from "./Board";

const cols = 7;
const rows = 5;

function App() {
  return (
    <div className="main_container">
      <Board cols={cols} rows={rows} />
    </div>
  );
}

export default App;
