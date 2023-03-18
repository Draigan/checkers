import { useRef, useEffect, useState } from 'react'
import Square from "./Square";
import useFetch from '../../hooks/useFetch'

function Board({ grid, socket, clickSquare, fen, setFen, readFen, writeFen }) {

  const [flip, setFlip] = useState("");
  const { data } = useFetch('http://localhost:4001/api');

  // RECIEVE SIGNAL FROM SOCKET
  // CONTACT API
  // SET FEN TO API DATA
  // RERENDER BOARD
  socket.on("recieve_fen", () => {
    console.log("recieved")
    data && setFen(data);
  })

  function onMove() {
    // setFen("0102010120102020010101010000000000000000403030404444444444303030")
    socket.emit("request_fen", writeFen());
  }

  // Align the board so the current player is always at the bottom
  socket.emit("request_flip");
  useEffect(() => {
    socket.on("recieve_flip", () => {
      console.log("FLIPPED")
      setFlip("-flip");
    })

  }, [socket])



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
      <button onClick={() => onMove()}>testFen</button>
    </div >


  );
}
export default Board;
