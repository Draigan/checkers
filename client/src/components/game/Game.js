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
  let path = [];
  readFen(grid.current);

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
  function resetBasic(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        grid[i][j].basic = false;
        grid[i][j].clickable = true;
      }
    }
  }

  function checkForJumps(grid) {
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

  function checkingForJumps(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j].pieceType == null) continue;
        if (
          grid[i][j].pieceType == "white"
          && playerColor == "white"
          && jumpUpLeftCondition(i, j)
          || jumpUpRightCondition(i, j)
        ) {
          // grid[i][j].clickable = true;
          console.log("1111111111111111")
          return true;
        }
        if (
          grid[i][j].pieceType == "red"
          && playerColor == "red"
          && jumpDownRightCondition(i, j)
          || jumpDownLeftCondition(i, j)
        ) {
          // grid[i][j].clickable = true;
          console.log("222222222")
          return true;
        }
        if (grid[i][j].pieceType == "whiteking"
          && playerColor == "white"
          && jumpUpLeftCondition(i, j)
          || jumpUpRightCondition(i, j)
          || jumpDownRightCondition(i, j)
          || jumpDownLeftCondition(i, j)
        ) {
          // grid[i][j].clickable = true;
          console.log("3333333333333")
          return true;
        }
        if (grid[i][j].pieceType == "redking"
          && playerColor == "red"
          && jumpUpLeftCondition(i, j)
          || jumpUpRightCondition(i, j)
          || jumpDownRightCondition(i, j)
          || jumpDownLeftCondition(i, j)
        ) {
          // grid[i][j].clickable = true;
          console.log("44444444444")
          return true;
        }
      }
    }
    return false;
  }


  function supressNonJumps(grid) {
    if (checkingForJumps(grid)) {
      console.log("FOUND JUMPS")
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          grid[i][j].clickable = true;
          if (grid[i][j].basic) {
            grid[i][j].clickable = false;
            grid[i][j].highlight = "green";
          }
        }
      }
    }
  }
  // resetClickable(grid.current);

  function resetHighlightPossible(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        grid[i][j].highlight = "";
        grid[i][j].possible = false;

      }
    }
  }

  function kingPiece(grid) {
    for (let i = 0; i < 8; i++) {
      if (grid[0][i].pieceType == "white") {
        grid[0][i].pieceType = "whiteking"
      }
      if (grid[7][i].pieceType == "red") {
        grid[7][i].pieceType = "redking"
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
  function changeTurn(socket, grid) {
    kingPiece(grid);
    // resetBasic(grid);
    socket.emit("request_fen", writeFen());
    socket.emit("request_change_turn");
  }

  function clickSquare(position) {
    let y = position[0];
    let x = position[1];
    let current = grid.current[y][x];
    console.log(current)
    if (!current.clickable) return;
    console.log("second return")
    if (inTransit && !current.jump) return
    console.log("third return")
    if (playerColor != tableColor) return;
    console.log("fourth return")
    if (current.pieceColor != playerColor && current.pieceType != null) return resetHighlightPossible(grid.current);

    // Second Click
    if (clickedState && current.possible) {
      current.pieceType = squareStart.pieceType;

      removePiece(squareStart);
      socket.emit("request_fen", writeFen());
      resetHighlightPossible(grid.current);
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
          path = [];
          console.log("out of jumps!!!!!!!!!!!")
          resetHighlightPossible(grid.current);
          changeTurn(socket, grid.current);
        }
        setSquareStart(current);

      } else {
        setSquareStart(null);
        resetHighlightPossible(grid.current);
        setClickedState(false);
        changeTurn(socket, grid.current);
        path = []
      }
      return;
    }

    // First Click
    if (current.pieceColor != playerColor) return;
    resetBasic(grid.current);
    resetHighlightPossible(grid.current);
    setClickedState(true)
    highlight(current, 1);
    checkPossibleMoves(y, x, current);
    setSquareStart(current);
    supressNonJumps(grid.current);
  }

  function checkPossibleMoves(y, x, current) {
    if (current.pieceType == "whiteking" || current.pieceType == "redking") {
      if (!outOfBounds(y - 1, x - 1))
        checkSurroundings(grid.current[y - 1][x - 1], current, true);
      if (!outOfBounds(y - 1, x + 1))
        checkSurroundings(grid.current[y - 1][x + 1], current, true);
      if (!outOfBounds(y + 1, x - 1))
        checkSurroundings(grid.current[y + 1][x - 1], current, true);
      if (!outOfBounds(y + 1, x + 1))
        checkSurroundings(grid.current[y + 1][x + 1], current, true);
      return;
    }
    if (playerColor == "white") {
      if (!outOfBounds(y - 1, x - 1))
        checkSurroundings(grid.current[y - 1][x - 1], current);
      if (!outOfBounds(y - 1, x + 1))
        checkSurroundings(grid.current[y - 1][x + 1], current);
    }
    if (playerColor == "red") {
      if (!outOfBounds(y + 1, x - 1))
        checkSurroundings(grid.current[y + 1][x - 1], current);
      if (!outOfBounds(y + 1, x + 1))
        checkSurroundings(grid.current[y + 1][x + 1], current);
    }
  }

  function checkSurroundings(adjacent, current, king) {
    if (!adjacent) return;
    // Case Free Square
    if (adjacent.pieceType == null) {
      adjacent.possible = true;
      highlight(adjacent, 1);
      adjacent.basic = true;
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

  function jumpUpLeftCondition(y, x) {
    if (
      x - 2 >= 0 && y - 2 >= 0
      && grid.current[y - 1][x - 1].pieceColor != playerColor
      && grid.current[y - 1][x - 1].pieceColor != grid.current[y][x].pieceColor
      && grid.current[y - 1][x - 1].pieceColor != null
      && grid.current[y - 2][x - 2].pieceColor == null
    ) {
      console.log("UPLEFT CONDITIONAAAAAl")
      return true;
    }
    return false;
  }
  function jumpUpRightCondition(y, x) {
    if (
      x + 2 <= 7 && y - 2 >= 0
      && grid.current[y - 1][x + 1].pieceColor != playerColor
      && grid.current[y - 1][x + 1].pieceColor != grid.current[y][x].pieceColor
      && grid.current[y - 1][x + 1].pieceColor != null
      && grid.current[y - 2][x + 2].pieceColor == null
    ) {
      console.log("uPRIGHTY CONDITIONAAAAAl")
      return true;
    }
    return false;
  }
  function jumpDownLeftCondition(y, x) {
    if (
      x - 2 >= 0 && y + 2 <= 7
      && grid.current[y + 1][x - 1].pieceColor != playerColor
      && grid.current[y + 1][x - 1].pieceColor != grid.current[y][x].pieceColor
      && grid.current[y + 1][x - 1].pieceColor != null
      && grid.current[y + 2][x - 2].pieceColor == null
    ) {
      console.log("DOWNLEFT CONDITIONAAAAAl", y, x)
      return true;
    }
    return false;
  }
  function jumpDownRightCondition(y, x) {
    if (
      x + 2 <= 7 && y + 2 <= 7
      && grid.current[y + 1][x + 1].pieceColor != playerColor
      && grid.current[y + 1][x + 1].pieceColor != grid.current[y][x].pieceColor
      && grid.current[y + 1][x + 1].pieceColor != null
      && grid.current[y + 2][x + 2].pieceColor == null
    ) {
      console.log("DOWNRIGHT CONDITIONAAAAAl")
      return true;
    }
    return false;
  }

  function jumpSquaresRecursive(current, firstTry, king) {
    let y = current.position[0];
    let x = current.position[1];
    console.log(current.id)
    // if (current.jump) return;
    path.push(current.id);
    // This first part is to prevent the first branch of the recursive function from wrapping all the way
    // around and marking the jumpable squares directly adjacent to the starting square as possible as the 
    // end point of jump sequence rather than the start. In other words make sure the squares around the king
    // that are possible jumps are marked as possible immediately, not as the end of a sequence.
    if (firstTry && king) {
      // UP LEFT
      if (jumpUpLeftCondition(y, x)) {
        grid.current[y - 2][x - 2].possible = true;
        grid.current[y - 2][x - 2].jump = true;
        highlight(grid.current[y - 2][x - 2], 2)
      }
      //UP RIGHT
      if (jumpUpRightCondition(y, x)) {
        grid.current[y - 2][x + 2].possible = true;
        grid.current[y - 2][x + 2].jump = true;
        highlight(grid.current[y - 2][x + 2], 2);
      }
      // DOWN LEFT
      if (jumpDownLeftCondition(y, x)) {
        grid.current[y + 2][x - 2].possible = true;
        grid.current[y + 2][x - 2].jump = true;
        highlight(grid.current[y + 2][x - 2], 2);
      }
      // DOWN RIGHT
      if (jumpDownRightCondition(y, x)) {
        if (firstTry) {
          grid.current[y + 2][x + 2].possible = true;
          grid.current[y + 2][x + 2].jump = true;
          highlight(grid.current[y + 2][x + 2], 2);
        }
      }
    }
    //RECURSIVE SECTION

    //UP LEFT
    if (playerColor == "white" || king) {
      if (jumpUpLeftCondition(y, x) && !path.includes(grid.current[y - 2][x - 2].id)) {
        if (firstTry) {
          grid.current[y - 2][x - 2].possible = true;
          grid.current[y - 2][x - 2].jump = true;
          highlight(grid.current[y - 2][x - 2], 2)
        } else {
          highlight(grid.current[y - 2][x - 2], 1)
          // grid.current[y - 2][x - 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid.current[y - 2][x - 2], false, king);
      }
      //UP RIGHT
      if (jumpUpRightCondition(y, x) && !path.includes(grid.current[y - 2][x + 2].id)
      ) {
        if (firstTry) {
          grid.current[y - 2][x + 2].possible = true;
          grid.current[y - 2][x + 2].jump = true;
          highlight(grid.current[y - 2][x + 2], 2);
        } else {
          highlight(grid.current[y - 2][x + 2], 1);
          // grid.current[y - 2][x + 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid.current[y - 2][x + 2], false, king);

      }
    }
    // DOWN LEFT
    if (playerColor == "red" || king) {
      if (jumpDownLeftCondition(y, x) && !path.includes(grid.current[y + 2][x - 2].id)) {
        if (firstTry) {
          grid.current[y + 2][x - 2].possible = true;
          grid.current[y + 2][x - 2].jump = true;
          highlight(grid.current[y + 2][x - 2], 2);
        } else {
          highlight(grid.current[y + 2][x - 2], 1);
          // grid.current[y + 2][x - 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid.current[y + 2][x - 2], false, king);
      }
      // DOWN RIGHT
      if (jumpDownRightCondition(y, x) && !path.includes(grid.current[y + 2][x + 2].id)) {
        if (firstTry) {
          grid.current[y + 2][x + 2].possible = true;
          grid.current[y + 2][x + 2].jump = true;
          highlight(grid.current[y + 2][x + 2], 2);
        } else {
          highlight(grid.current[y + 2][x + 2], 1);
          // grid.current[y + 2][x + 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid.current[y + 2][x + 2], false, king);
      }
    }
  }

  function readFen(grid) {
    let count = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (fen[count] == "1") {
          grid[i][j].pieceType = "red";
          grid[i][j].pieceColor = "red";
        }
        if (fen[count] == "2") {
          grid[i][j].pieceType = "redking";
          grid[i][j].pieceColor = "red";
        }
        if (fen[count] == "3") {
          grid[i][j].pieceType = "white";
          grid[i][j].pieceColor = "white";
        }
        if (fen[count] == "4") {
          grid[i][j].pieceType = "whiteking";
          grid[i][j].pieceColor = "white";
        }
        if (fen[count] == "0") {
          grid[i][j].pieceType = null;
          grid[i][j].pieceColor = null;
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
