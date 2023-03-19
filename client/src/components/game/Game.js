/*CURRENT TASK :::: 

Get jump working

 :::: */
import { useState, useEffect, useRef } from 'react';
import Board from "./Board";
import initBoard from './helpers/initBoard.js'

function Game({ socket }) {
  const [fen, setFen] = useState("0101010110101010010101010000000000000000303030300303030330303030");
  const [turn, setTurn] = useState("white");
  const [clickedState, setClickedState] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [tableColor, setTableColor] = useState(null);
  const [squareStart, setSquareStart] = useState();
  // grid is a 2x2 array of objects, each representing one squares details
  // pieceType: null, red redking white whiteking
  // id: `${i}${j}`,
  // pieceImage: null,
  // position: [y, x],
  // possible: false,
  // squareColor: null,
  // cssStyle: null,
  // highlight: ""
  const tmp = initBoard();
  const grid = useRef(tmp);

  socket.on("recieve_player_color", (color) => {
    setPlayerColor(color);
  })
  socket.on("recieve_table_color", (color) => {
    setTableColor(color);
  })
  // console.log("tableColor: ", tableColor)
  // console.log("playerColor: ", playerColor)

  function resetHighlightPossible() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        grid.current[i][j].highlight = "";
        grid.current[i][j].possible = false;
      }
    }
  }

  // function resetAllPossible() {
  //   for (let i = 0; i < 8; i++) {
  //     for (let j = 0; j < 8; j++) {
  //     }
  //   }
  // }

  function highlight(current) {
    current.highlight = "-highlight"
  }
  function removePiece(square) {
    square.pieceType = null;
    square.pieceColor = null;
  }

  function clickSquare(position, color) {
    let y = position[0];
    let x = position[1];
    let current = grid.current[y][x];

    if (playerColor != tableColor) return;
    if (current.pieceColor != playerColor && current.pieceType != null) return resetHighlightPossible();
    // if ()



    // Second Click
    if (clickedState && current.possible) {
      // console.log(current.pieceType)
      // console.log("startSquare.pieceType", squareStart.pieceType);
      current.pieceType = squareStart.pieceType;
      // console.log(current.pieceType)
      setClickedState(false)

      removePiece(squareStart);
      socket.emit("request_fen", writeFen());
      setSquareStart(null);
      resetHighlightPossible();
      return;
    }

    // First Click
    if (current.pieceColor != playerColor) return;
    resetHighlightPossible();
    setClickedState(true)
    current.highlight = "-highlight"
    checkPossibleMoves(y, x, playerColor)
    setSquareStart(current);
  }

  function checkPossibleMoves(y, x, color) {
    let upLeft;
    let upRight;
    switch (color) {
      case "white":
        upLeft = grid.current[y - 1][x - 1];
        upRight = grid.current[y - 1][x + 1];
        break;
      case "red":
        upLeft = grid.current[y + 1][x - 1];
        upRight = grid.current[y + 1][x + 1];
        break;
    }

    checkUpLeft(upLeft);
    checkUpRight(upRight);
  }

  function checkUpLeft(upLeft) {
    if (!upLeft) return;
    // Case Free Square
    if (upLeft.pieceType == null) {
      upLeft.possible = true;
      return;
    }
    // Has player color piece
    if (upLeft.pieceColor == playerColor) return;
    // Has Opponets Piece
    if (upLeft.pieceColor != playerColor) {
      checkSquaresRecursive(upLeft, "upLeft");
    }

  }
  function checkUpRight(upRight) {
    if (!upRight) return;
    // Case Free Square
    if (upRight.pieceType == null) {
      upRight.possible = true;
      return;
    }
    // Case has player color piece 
    if (upRight.pieceColor == playerColor) return;

    // Has Opponets Piece
    if (upRight.pieceColor != playerColor) {

      checkSquaresRecursive(upRight, "upRight");
    }
  }

  function checkSquaresRecursive(current, direction) {
    if (!current) return;
    // console.log(current.position, direction, current.possible)
    let y = current.position[0];
    let x = current.position[1];
    let next;
    switch (playerColor) {
      case "white":
        if (direction == "upLeft" && y && x) {
          next = grid.current[y - 1][x - 1];
        }
        if (direction == "upRight" && y && x) {
          console.log("Setting next for:", current.position)
          next = grid.current[y - 1][x + 1];
        }
        break;
      case "red":
        if (direction == "upLeft" && y && x) {
          next = grid.current[y + 1][x - 1];
        }
        if (direction == "upRight" && y && x) {
          next = grid.current[y + 1][x + 1];
        }
        break;
    }
    if (current.pieceColor == playerColor) return console.log("2");
    if (current.pieceColor == null && next && next.pieceColor == null) return console.log("3");
    if (current.pieceColor == null) {
      current.possible = true;
      console.log(current)
      if (!next) return console.log("1");
      return checkSquaresRecursive(next, direction);
    }
    if (current.pieceColor != playerColor) {

      if (!next) return console.log("1");
      return checkSquaresRecursive(next, direction);
    }
  }

  // function checkForBounds(y, x) {
  //   if (y > 7 || y < 0 || x > 7 || x < 0) return false;
  // }

















  function readFen() {
    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (fen[count] == "1") {
          grid.current[i][j].pieceType = "red";
          grid.current[i][j].pieceColor = "red";
        }
        if (fen[count] == "2") {
          grid.current[i][j].pieceType = "redking";
          grid.current[i][j].pieceColor = "red";
        }
        if (fen[count] == "3") {
          grid.current[i][j].pieceType = "white";
          grid.current[i][j].pieceColor = "white";
        }
        if (fen[count] == "4") {
          grid.current[i][j].pieceType = "whiteking";
          grid.current[i][j].pieceColor = "white";
        }
        if (fen[count] == "0") {
          grid.current[i][j].pieceType = null;
          grid.current[i][j].pieceColor = null;
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
    <>
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
      Turn: {tableColor}
    </>
  );
}


export default Game;
