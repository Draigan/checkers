import { useRef, useEffect, useState } from 'react'
import Square from "./Square";
import useFetch from '../../hooks/useFetch'

function Board({ grid, socket, clickSquare, fen, setFen, readFen, writeFen }) {

  const [flip, setFlip] = useState("");

  socket.on("recieve_fen", (data) => {
    data && setFen(data);
    // console.log(data)
    // console.log("fen", fen);
  })

  function onMove() {
    socket.emit("request_fen", writeFen());
  }

  // Align the board so the current player is always at the bottom
  socket.emit("request_flip");
  // useEffect(() => {
  socket.on("recieve_flip", () => {
    // console.log("FLIPPED")
    setFlip("-flip");
  })

  // }, [socket])



  readFen();



  return (
    <div className={`board ${flip}`} >
      {grid.current.map((row) => row.map((square) => {
        return (
          <div key={square.id} onClick={() => { clickSquare(square.position); }}
            className={`${square.cssStyle} square ${square.highlight}`} >
            {square.pieceType}
            {/* <Square key={square.id} grid={grid.current} square={square} /> */}

          </div>
        )
      }))};
    </div >


  );
}
export default Board;
