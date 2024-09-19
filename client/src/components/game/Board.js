import { useState } from 'react'
import white from '../../assets/white.png'
import red from '../../assets/red.png'
import redking from '../../assets/redking.png'
import whiteking from '../../assets/whiteking.png'

function Board({ grid, socket, globalUserName, clickSquare, setFen }) {
  const [flip, setFlip] = useState("");

  socket.on("recieve_fen", (data) => {
    data && setFen(data);
  })
  // Align the board so the current player is always at the bottom
  socket.emit("request_flip");
  socket.on("recieve_flip", () => {
    setFlip("-flip");
  })

  return (
    <div className={`board ${flip}`} >
      {grid.map((row) => row.map((square) => {
        return (
          <div key={square.id} onClick={() => { clickSquare(square.position); }}
            className={`${square.cssStyle} square ${square.highlight}`} >
            {square.pieceType === "white" && <img className={`piece ${flip}`} src={white} alt="white" />}
            {square.pieceType === "whiteking" && <img className={`piece ${flip}`} src={whiteking} alt="white-king" />}
            {square.pieceType === "red" && <img className={`piece ${flip}`} src={red} alt="red" />}
            {square.pieceType === "redking" && <img className={`piece ${flip}`} src={redking} alt="red-king" />}
          </div>
        )
      }))}
    </div >
  );
}
export default Board;
