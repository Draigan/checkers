import { useState, useRef } from 'react';
import Board from "./Board";
import initBoard from './helpers/initBoard.js'
import {
  removePiece,
  writeFen,
  readFen,
  resetHighlightPossible,
  kingPiece,
  jumpUpLeftCondition,
  jumpUpRightCondition,
  jumpDownLeftCondition,
  jumpDownRightCondition,
  outOfBounds,
  highlight,
  resetJump,
  checkForJumps,
  resetBasic
}
  from './helpers/helpers.js'

function Game({ socket }) {
  const [fen, setFen] = useState("");
  const [turn, setTurn] = useState("white");
  const [clickedState, setClickedState] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [tableColor, setTableColor] = useState(null);
  const [squareStart, setSquareStart] = useState();
  const [inTransit, setInTransit] = useState();
  const tmp = useRef(initBoard());
  const grid = tmp.current;
  let path = [];
  readFen(grid, fen);

  socket.on("recieve_player_color", (color) => {
    setPlayerColor(color);
  })
  socket.on("recieve_table_color", (color) => {
    setTableColor(color);
  })

  function checkingForJumps(grid) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (grid[i][j].pieceType == null) continue;
        if (
          grid[i][j].pieceType == "white"
          && playerColor == "white"
          && jumpUpLeftCondition(i, j, grid)
          || jumpUpRightCondition(i, j, grid)
        ) {
          return true;
        }
        if (
          grid[i][j].pieceType == "red"
          && playerColor == "red"
          && jumpDownRightCondition(i, j, grid)
          || jumpDownLeftCondition(i, j, grid)
        ) {
          return true;
        }
        if (grid[i][j].pieceType == "whiteking"
          && playerColor == "white"
          && jumpUpLeftCondition(i, j, grid)
          || jumpUpRightCondition(i, j, grid)
          || jumpDownRightCondition(i, j, grid)
          || jumpDownLeftCondition(i, j, grid)
        ) {
          return true;
        }
        if (grid[i][j].pieceType == "redking"
          && playerColor == "red"
          && jumpUpLeftCondition(i, j, grid)
          || jumpUpRightCondition(i, j, grid)
          || jumpDownRightCondition(i, j, grid)
          || jumpDownLeftCondition(i, j, grid)
        ) {
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
    removePiece(grid[removalSquare[0]][removalSquare[1]]);
  }

  function changeTurn(socket, grid) {
    kingPiece(grid);
    socket.emit("request_fen", writeFen(grid));
    socket.emit("request_change_turn");
  }

  function clickSquare(position) {
    let y = position[0];
    let x = position[1];
    let current = grid[y][x];
    console.log(current)
    if (!current.clickable) return;
    console.log("second return")
    if (inTransit && !current.jump) return
    console.log("third return")
    if (playerColor != tableColor) return;
    console.log("fourth return")
    if (current.pieceColor != playerColor && current.pieceType != null) return resetHighlightPossible(grid);

    // Second Click
    if (clickedState && current.possible) {
      current.pieceType = squareStart.pieceType;

      removePiece(squareStart);
      socket.emit("request_fen", writeFen(grid));
      resetHighlightPossible(grid);
      if (current.jump) {
        highlight(current, 1);
        capturePiece(grid, squareStart, current)
        socket.emit("request_fen", writeFen(grid));
        setInTransit(true);
        resetJump(grid)
        if (current.pieceType == "whiteking" || current.pieceType == "redking") {
          jumpSquaresRecursive(current, true, true);
        } else {
          jumpSquaresRecursive(current, true);
        }
        if (!checkForJumps(grid)) {
          setInTransit(false);
          path = [];
          console.log("out of jumps!!!!!!!!!!!")
          resetHighlightPossible(grid);
          changeTurn(socket, grid);
        }
        setSquareStart(current);

      } else {
        setSquareStart(null);
        resetHighlightPossible(grid);
        setClickedState(false);
        changeTurn(socket, grid);
        path = []
      }
      return;
    }

    // First Click
    if (current.pieceColor != playerColor) return;
    resetBasic(grid);
    resetHighlightPossible(grid);
    setClickedState(true)
    highlight(current, 1);
    checkPossibleMoves(y, x, current);
    setSquareStart(current);
    supressNonJumps(grid);
  }

  function checkPossibleMoves(y, x, current) {
    if (current.pieceType == "whiteking" || current.pieceType == "redking") {
      if (!outOfBounds(y - 1, x - 1))
        checkSurroundings(grid[y - 1][x - 1], current, true);
      if (!outOfBounds(y - 1, x + 1))
        checkSurroundings(grid[y - 1][x + 1], current, true);
      if (!outOfBounds(y + 1, x - 1))
        checkSurroundings(grid[y + 1][x - 1], current, true);
      if (!outOfBounds(y + 1, x + 1))
        checkSurroundings(grid[y + 1][x + 1], current, true);
      return;
    }
    if (playerColor == "white") {
      if (!outOfBounds(y - 1, x - 1))
        checkSurroundings(grid[y - 1][x - 1], current);
      if (!outOfBounds(y - 1, x + 1))
        checkSurroundings(grid[y - 1][x + 1], current);
    }
    if (playerColor == "red") {
      if (!outOfBounds(y + 1, x - 1))
        checkSurroundings(grid[y + 1][x - 1], current);
      if (!outOfBounds(y + 1, x + 1))
        checkSurroundings(grid[y + 1][x + 1], current);
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
      if (jumpUpLeftCondition(y, x, grid, playerColor)) {
        grid[y - 2][x - 2].possible = true;
        grid[y - 2][x - 2].jump = true;
        highlight(grid[y - 2][x - 2], 2)
      }
      //UP RIGHT
      if (jumpUpRightCondition(y, x, grid, playerColor)) {
        grid[y - 2][x + 2].possible = true;
        grid[y - 2][x + 2].jump = true;
        highlight(grid[y - 2][x + 2], 2);
      }
      // DOWN LEFT
      if (jumpDownLeftCondition(y, x, grid, playerColor)) {
        grid[y + 2][x - 2].possible = true;
        grid[y + 2][x - 2].jump = true;
        highlight(grid[y + 2][x - 2], 2);
      }
      // DOWN RIGHT
      if (jumpDownRightCondition(y, x, grid, playerColor)) {
        if (firstTry) {
          grid[y + 2][x + 2].possible = true;
          grid[y + 2][x + 2].jump = true;
          highlight(grid[y + 2][x + 2], 2);
        }
      }
    }
    //RECURSIVE SECTION

    //UP LEFT
    if (playerColor == "white" || king) {
      if (jumpUpLeftCondition(y, x, grid, playerColor) && !path.includes(grid[y - 2][x - 2].id)) {
        if (firstTry) {
          grid[y - 2][x - 2].possible = true;
          grid[y - 2][x - 2].jump = true;
          highlight(grid[y - 2][x - 2], 2)
        } else {
          highlight(grid[y - 2][x - 2], 1)
          // grid[y - 2][x - 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid[y - 2][x - 2], false, king);
      }
      //UP RIGHT
      if (jumpUpRightCondition(y, x, grid, playerColor) && !path.includes(grid[y - 2][x + 2].id)
      ) {
        if (firstTry) {
          grid[y - 2][x + 2].possible = true;
          grid[y - 2][x + 2].jump = true;
          highlight(grid[y - 2][x + 2], 2);
        } else {
          highlight(grid[y - 2][x + 2], 1);
          // grid[y - 2][x + 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid[y - 2][x + 2], false, king);

      }
    }
    // DOWN LEFT
    if (playerColor == "red" || king) {
      if (jumpDownLeftCondition(y, x, grid, playerColor) && !path.includes(grid[y + 2][x - 2].id)) {
        if (firstTry) {
          grid[y + 2][x - 2].possible = true;
          grid[y + 2][x - 2].jump = true;
          highlight(grid[y + 2][x - 2], 2);
        } else {
          highlight(grid[y + 2][x - 2], 1);
          // grid[y + 2][x - 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid[y + 2][x - 2], false, king);
      }
      // DOWN RIGHT
      if (jumpDownRightCondition(y, x, grid, playerColor) && !path.includes(grid[y + 2][x + 2].id)) {
        if (firstTry) {
          grid[y + 2][x + 2].possible = true;
          grid[y + 2][x + 2].jump = true;
          highlight(grid[y + 2][x + 2], 2);
        } else {
          highlight(grid[y + 2][x + 2], 1);
          // grid[y + 2][x + 2].recursiveJump = true;
        }
        jumpSquaresRecursive(grid[y + 2][x + 2], false, king);
      }
    }
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

