import { useRef, useEffect, useState } from 'react'
import Square from "./Square";
import useFetch from '../../hooks/useFetch'

function Board({ tmp, socket }) {
  const [fen, setFen] = useState("");
  const grid = useRef(tmp);
  const [clicked, setClicked] = useState(false);
  const [flip, setFlip] = useState("");
  const { data } = useFetch('http://localhost:4001/api');

  // RECIEVE SIGNAL FROM SOCKET
  // CONTACT API
  // SET FEN TO API DATA
  // RERENDER BOARD
  socket.on("recieve_fen", () => {
    data && setFen(data);

  })



  function clickSquare(position) {
    let y = position[0];
    let x = position[1];
    console.log(y, x)
    if (!clicked) {
      setClicked(true);
      grid.current[y][x].highlight = "-highlight";
      changeGrid(4, 4);
      console.log("HEY");
    } else {
      grid.current[y][x].highlight = "";
      setClicked(false);
    }
  }
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



  function readFen() {
    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (fen[count] == "1") {
          grid.current[i][j].pieceType = "red";
        }
        if (fen[count] == "2") {
          grid.current[i][j].pieceType = "redking";
        }
        if (fen[count] == "3") {
          grid.current[i][j].pieceType = "white";
        }
        if (fen[count] == "4") {
          grid.current[i][j].pieceType = "whiteking";
        }
        if (fen[count] == "0") {
          grid.current[i][j].pieceType = "";
        }
        count++;
      }
    }
  }
  function changeGrid(y, x) {
    // grid[y][x].possible = Math.random();
    // console.log("CHANGEGRID")
  }
  readFen();
  function writeFen() {
    let tmp = "";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid.current[i][j].pieceType == "red") {
          tmp += "1";
        }
        if (grid.current[i][j].pieceType == "redking") {
          tmp += "2";
        }
        if (grid.current[i][j].pieceType == "white") {
          tmp += "3";
        }
        if (grid.current[i][j].pieceType == "whiteking") {
          tmp += "4";
        }
        if (grid.current[i][j].pieceType == "") {
          tmp += "0";
        }
      }
    }
    return tmp;
  }


  return (
    <div className={`board ${flip}`} >
      {grid.current.map((row) => row.map((square) => {
        return (
          <div key={square.id} onClick={() => { clickSquare(square.position); }}
            className={`${square.cssStyle} square ${square.highlight}`} >

            <Square key={square.id} grid={grid.current} square={square} changeGrid={changeGrid} />

          </div>
        )
      }))};
      <button onClick={() => onMove()}>testFen</button>
    </div >


  );
}
export default Board;
