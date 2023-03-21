import { useState, useEffect, useRef } from 'react';
import Board from "./Board";
import initBoard from './helpers/initBoard.js'

function Game({ socket }) {
  const [fen, setFen] = useState("");
  const [turn, setTurn] = useState("white");
  const [clickedState, setClickedState] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [tableColor, setTableColor] = useState(null);
  const [squareStart, setSquareStart] = useState();
  const [inTransit, setInTransit] = useState();
  const grid = useRef(initBoard());

  socket.on("recieve_player_color", (color) => {
    setPlayerColor(color);
  })
  socket.on("recieve_table_color", (color) => {
    setTableColor(color);
  })

  function resetJump(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j].jump) {
          grid[i][j].jump = false;
        }

      }
    }
  }

  function checkForJumps(grid) {
    console.log("checking for jumps...")
    let hasJumpLeft = false;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j].jump) {
          hasJumpLeft = true;
        }

      }
    }
    return hasJumpLeft
  }

  function resetHighlightPossible() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        grid.current[i][j].highlight = "";
        grid.current[i][j].possible = false;
      }
    }
  }

  function highlight(square, type) {

    if (type == 1) {
      square.highlight = "-highlight";
    }
    if (type == 2) {
      square.highlight = "-highlight-possible";
    }
  }

  function outOfBounds(y, x) {
    if (y > 7 || y < 0 || x > 7 || x < 0) return true;
    return false;
  }

  function capturePiece(grid, startSquare, endSquare) {
    let removalSquare = [];
    let startY = startSquare.position[0];
    let startX = startSquare.position[1];
    let endY = endSquare.position[0];
    let endX = endSquare.position[1];
    if (outOfBounds(startY, endY) || outOfBounds(startX, endX)) return;

    if (startY > endY) {
      removalSquare[0] = startY - 1;
    } else {
      removalSquare[0] = startY + 1;
    }
    if (startX > endX) {
      removalSquare[1] = startX - 1;
    } else {
      removalSquare[1] = startX + 1;
    }
    grid[removalSquare[0]][removalSquare[1]].pieceType = null;
    grid[removalSquare[0]][removalSquare[1]].pieceColor = null;
  }

  function removePiece(square) {
    square.pieceType = null;
    square.pieceColor = null;
  }

  function clickSquare(position, color) {
    let y = position[0];
    let x = position[1];
    let current = grid.current[y][x];
    console.log(current)
    if (inTransit && !current.jump) return
    if (playerColor != tableColor) return;
    if (current.pieceColor != playerColor && current.pieceType != null) return resetHighlightPossible();

    // Second Click
    if (clickedState && current.possible) {
      current.pieceType = squareStart.pieceType;

      removePiece(squareStart);
      socket.emit("request_fen", writeFen());
      resetHighlightPossible();
      if (current.jump) {
        highlight(current, 1);
        capturePiece(grid.current, squareStart, current)
        socket.emit("request_fen", writeFen());
        setInTransit(true);
        resetJump(grid.current)
        if (current.pieceType == "whiteking" || current.pieceType == "redking") {
          jumpSquaresRecursive(current, true, true);
        } else {
          jumpSquaresRecursive(current, true);
        }
        if (!checkForJumps(grid.current)) {
          setInTransit(false);
          console.log("out of jumps!!!!!!!!!!!")
          resetHighlightPossible();
          socket.emit("request_change_turn");
        }
        setSquareStart(current);

      } else {
        setSquareStart(null);
        resetHighlightPossible();
        setClickedState(false);
        socket.emit("request_change_turn");
      }
      return;
    }

    // First Click
    if (current.pieceColor != playerColor) return;
    resetHighlightPossible();
    setClickedState(true)
    highlight(current, 1);
    checkPossibleMoves(y, x, current);
    setSquareStart(current);
  }

  function checkPossibleMoves(y, x, current) {
    let upLeft;
    let upRight;
    if (current.pieceType == "whiteking" || current.pieceType == "redking") {
      checkSurroundings(grid.current[y - 1][x - 1], current, true);
      checkSurroundings(grid.current[y - 1][x + 1], current, true);
      checkSurroundings(grid.current[y + 1][x - 1], current, true);
      checkSurroundings(grid.current[y + 1][x + 1], current, true);
      return;
    }
    if (playerColor == "white") {
      upLeft = grid.current[y - 1][x - 1];
      upRight = grid.current[y - 1][x + 1];
    }
    if (playerColor == "red") {
      upLeft = grid.current[y + 1][x - 1];
      upRight = grid.current[y + 1][x + 1];
    }

    checkSurroundings(upLeft, current);
    checkSurroundings(upRight, current);
  }

  function checkSurroundings(adjacent, current, king) {
    if (!adjacent) return;
    // Case Free Square
    if (adjacent.pieceType == null) {
      adjacent.possible = true;

      return;
    }
    // Case has player color piece 
    if (adjacent.pieceColor == playerColor) return;

    // Has Opponets Piece
    if (adjacent.pieceColor != playerColor) {

      jumpSquaresRecursive(current, true, king);
      // checkSquaresRecursive(adjacent, "upRight");
    }
  }
  function isKing(current) {
    if (current.pieceType == "whiteking" || current.pieceType == "redking") return true;
  }
  const test = [];
  function jumpSquaresRecursive(current, firstTry, king) {

    let y = current.position[0];
    let x = current.position[1];
    console.log(current.id)
    // if (current.jump) return;
    console.log(test)
    test.push(current.id);

    // This first part is to prevent the first branch of the recursive function from wrapping all the way
    // around and marking the jumpable squares directly adjacent to the starting square as possible as the 
    // end point of jump sequence rather than the start. In other words make sure the squares around the king
    // that are possible jumps are marked as possiblee immediately, not as the end of a sequence.
    if (firstTry && king) {
      // UP LEFT
      if (
        x - 2 >= 0 && y - 2 >= 0
        && grid.current[y - 1][x - 1].pieceColor != playerColor
        && grid.current[y - 1][x - 1].pieceColor != null
        && grid.current[y - 2][x - 2].pieceColor == null
      ) {
        grid.current[y - 2][x - 2].possible = true;
        grid.current[y - 2][x - 2].jump = true;
        highlight(grid.current[y - 2][x - 2], 2)

      }
      //UP RIGHT
      if (
        x + 2 <= 7 && y - 2 >= 0
        && grid.current[y - 1][x + 1].pieceColor != playerColor
        && grid.current[y - 1][x + 1].pieceColor != null
        && grid.current[y - 2][x + 2].pieceColor == null
      ) {
        grid.current[y - 2][x + 2].possible = true;
        grid.current[y - 2][x + 2].jump = true;
        highlight(grid.current[y - 2][x + 2], 2);
      }
      // DOWN LEFT
      if (
        x - 2 >= 0 && y + 2 <= 7
        && grid.current[y + 1][x - 1].pieceColor != playerColor
        && grid.current[y + 1][x - 1].pieceColor != null
        && grid.current[y + 2][x - 2].pieceColor == null
      ) {
        grid.current[y + 2][x - 2].possible = true;
        grid.current[y + 2][x - 2].jump = true;
        highlight(grid.current[y + 2][x - 2], 2);
      }

      // DOWN RIGHT
      if (
        x + 2 <= 7 && y + 2 <= 7
        && grid.current[y + 1][x + 1].pieceColor != playerColor
        && grid.current[y + 1][x + 1].pieceColor != null
        && grid.current[y + 2][x + 2].pieceColor == null
      ) {
        if (firstTry) {
          grid.current[y + 2][x + 2].possible = true;
          grid.current[y + 2][x + 2].jump = true;
          highlight(grid.current[y + 2][x + 2], 2);
          console.log("add highlight", grid.current[y + 2][x + 2])
        }
      }
    }


    //RECURSIVE SECTION

    //UP LEFT
    if (playerColor == "white" || king) {
      if (
        x - 2 >= 0 && y - 2 >= 0
        && !test.includes(grid.current[y - 2][x - 2].id)
        && grid.current[y - 1][x - 1].pieceColor != playerColor
        && grid.current[y - 1][x - 1].pieceColor != null
        && grid.current[y - 2][x - 2].pieceColor == null
      ) {
        if (firstTry) {
          grid.current[y - 2][x - 2].possible = true;
          grid.current[y - 2][x - 2].jump = true;
          highlight(grid.current[y - 2][x - 2], 2)
          console.log("add highlight", grid.current[y - 2][x - 2])
        } else {
          highlight(grid.current[y - 2][x - 2], 1)
        }
        jumpSquaresRecursive(grid.current[y - 2][x - 2], false, king);
      }

      //UP RIGHT
      if (
        x + 2 <= 7 && y - 2 >= 0
        && !test.includes(grid.current[y - 2][x + 2].id)
        && grid.current[y - 1][x + 1].pieceColor != playerColor
        && grid.current[y - 1][x + 1].pieceColor != null
        && grid.current[y - 2][x + 2].pieceColor == null
      ) {
        if (firstTry) {
          grid.current[y - 2][x + 2].possible = true;
          grid.current[y - 2][x + 2].jump = true;
          highlight(grid.current[y - 2][x + 2], 2);
          console.log("add highlight", grid.current[y - 2][x + 2])
        } else {
          highlight(grid.current[y - 2][x + 2], 1);
        }
        jumpSquaresRecursive(grid.current[y - 2][x + 2], false, king);
      }
    }

    // DOWN LEFT
    if (playerColor == "red" || king) {
      if (
        x - 2 >= 0 && y + 2 <= 7
        && !test.includes(grid.current[y + 2][x - 2].id)
        && grid.current[y + 1][x - 1].pieceColor != playerColor
        && grid.current[y + 1][x - 1].pieceColor != null
        && grid.current[y + 2][x - 2].pieceColor == null
      ) {
        if (firstTry) {
          grid.current[y + 2][x - 2].possible = true;
          grid.current[y + 2][x - 2].jump = true;
          highlight(grid.current[y + 2][x - 2], 2);
        } else {
          highlight(grid.current[y + 2][x - 2], 1);
        }
        jumpSquaresRecursive(grid.current[y + 2][x - 2], false, king);
      }
      // DOWN RIGHT
      if (
        x + 2 <= 7 && y + 2 <= 7
        && !test.includes(grid.current[y + 2][x + 2].id)
        && grid.current[y + 1][x + 1].pieceColor != playerColor
        && grid.current[y + 1][x + 1].pieceColor != null
        && grid.current[y + 2][x + 2].pieceColor == null
      ) {
        if (firstTry) {
          grid.current[y + 2][x + 2].possible = true;
          grid.current[y + 2][x + 2].jump = true;
          highlight(grid.current[y + 2][x + 2], 2);
          console.log("add highlight", grid.current[y + 2][x + 2])
        } else {
          highlight(grid.current[y + 2][x + 2], 1);
        }
        jumpSquaresRecursive(grid.current[y + 2][x + 2], false, king);
      }
    }
  }

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
