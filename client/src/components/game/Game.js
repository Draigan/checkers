import { useState, useEffect, useRef } from 'react';
import Board from "./Board";
import initBoard from './helpers/initBoard.js'

function Game({ socket }) {
  const [fen, setFen] = useState("0101010110101010010101010000000000000000303030300303030330303030");
  const [turn, setTurn] = useState("white");
  const [clickedState, setClickedState] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [squareStart, setSquareStart] = useState();
  // grid is a 2x2 array of objects, each representing one squares details
  // pieceType: null, red redking white whiteking
  // id: `${i}${j}`,
  // pieceImage: null,
  // position: [i, j],
  // possible: false,
  // squareColor: null,
  // cssStyle: null,
  // highlight: ""
  const tmp = initBoard();
  const grid = useRef(tmp);

  // CHANGE GRID
  // SEND NEW DATA TO SERVER
  // SERVER UPDATES API
  // SERVER BROADCASTS ALL IN TABLE TO UPDATE DATA
  // CLIENTS UPDATE DATA

  // useEffect(() => {
  //   setFen(writeFen())
  //   socket.emit("")
  //   // console.log(writeFen)
  //   socket.emit("request_fen", writeFen());

  // }, [grid.current])


  function clickSquare(position) {
    //HANDLE MOVE TO SQUARE
    let y = position[0];
    let x = position[1];
    let current = grid.current[y][x];
    console.log("current:", current)

    if (clickedState && current.possible) {
      console.log("MAGIC")
      console.log(current.pieceType)
      console.log("startSquare.pieceType", squareStart.pieceType)
      current.pieceType = squareStart.pieceType;
      console.log(current.pieceType)
      setClickedState(false)
      socket.emit("request_fen", writeFen());
      setFen(writeFen());
      setSquareStart(null);
      return;
    }

    setClickedState(true)
    checkPossibleMoves(y, x);
    setSquareStart(current);
  }

  function checkPossibleMoves(y, x) {
    let upLeft = grid.current[y - 1][x - 1];
    if (upLeft.pieceType == null) {
      upLeft.possible = true;
    }
  }


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
          grid.current[i][j].pieceType = null;
        }
        count++;
      }
    }
  }
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
        if (grid.current[i][j].pieceType == null) {
          tmp += "0";
        }
      }
    }
    return tmp;
  }


















  return (

    <Board grid={grid}
      turn={turn}
      setTurn={setTurn}
      socket={socket}
      clickSquare={clickSquare}
      fen={fen}
      setFen={setFen}
      readFen={readFen}
      writeFen={writeFen}
    />

  );
}

export default Game;
