import { useRef, useEffect, useState } from 'react'
import Square from "./Square";
import useFetch from '../../hooks/useFetch'
import white from '../../assets/white.png'
import whiteking from '../../assets/whiteking.png'
import red from '../../assets/red.png'
import redking from '../../assets/redking.png'

function Board({ grid, socket, clickSquare, fen, setFen, readFen, writeFen }) {

  const [flip, setFlip] = useState("");

  socket.on("recieve_fen", (data) => {
    data && setFen(data);
    // console.log(data)
    // console.log("fen", fen);
  })


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

            {square.pieceType == "white" && <img className={"piece"} src={white} alt="white" />}
            {square.pieceType == "whiteking" && <img className={"piece"} src={whiteking} alt="white-king" />}
            {square.pieceType == "red" && <img className={`piece`} src={red} alt="red" />}
            {square.pieceType == "redking" && <img className={"piece"} src={redking} alt="red-king" />}

            {/* <Square key={square.id} grid={grid.current} square={square} /> */}

          </div>
        )
      }))};
    </div >


  );
}
export default Board;
