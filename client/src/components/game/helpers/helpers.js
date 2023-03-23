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

function resetBasic(grid) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      grid[i][j].basic = false;
      grid[i][j].clickable = true;
    }
  }
}

function resetJump(grid) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (grid[i][j].jump) {
        grid[i][j].jump = false;
      }
    }
  }
}


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

function removePiece(square) {
  square.pieceType = null;
  square.pieceColor = null;
}
function readFen(grid, fen) {
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
function writeFen(grid) {
  let tmp = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (grid[i][j].pieceType == "red") {
        tmp += "1";
      }
      if (grid[i][j].pieceType == "redking") {
        tmp += "2";
      }
      if (grid[i][j].pieceType == "white") {
        tmp += "3";
      }
      if (grid[i][j].pieceType == "whiteking") {
        tmp += "4";
      }
      if (grid[i][j].pieceType == null) {
        tmp += "0";
      }
    }
  }
  return tmp;
}

function jumpUpLeftCondition(y, x, grid, playerColor) {
  if (
    x - 2 >= 0 && y - 2 >= 0
    && grid[y - 1][x - 1].pieceColor != playerColor
    && grid[y - 1][x - 1].pieceColor != grid[y][x].pieceColor
    && grid[y - 1][x - 1].pieceColor != null
    && grid[y - 2][x - 2].pieceColor == null
  ) {
    console.log("UPLEFT CONDITIONAAAAAl")
    return true;
  }
  return false;
}
function jumpUpRightCondition(y, x, grid, playerColor) {
  if (
    x + 2 <= 7 && y - 2 >= 0
    && grid[y - 1][x + 1].pieceColor != playerColor
    && grid[y - 1][x + 1].pieceColor != grid[y][x].pieceColor
    && grid[y - 1][x + 1].pieceColor != null
    && grid[y - 2][x + 2].pieceColor == null
  ) {
    console.log("uPRIGHTY CONDITIONAAAAAl")
    return true;
  }
  return false;
}
function jumpDownLeftCondition(y, x, grid, playerColor) {
  if (
    x - 2 >= 0 && y + 2 <= 7
    && grid[y + 1][x - 1].pieceColor != playerColor
    && grid[y + 1][x - 1].pieceColor != grid[y][x].pieceColor
    && grid[y + 1][x - 1].pieceColor != null
    && grid[y + 2][x - 2].pieceColor == null
  ) {
    console.log("DOWNLEFT CONDITIONAAAAAl", y, x)
    return true;
  }
  return false;
}
function jumpDownRightCondition(y, x, grid, playerColor) {
  if (
    x + 2 <= 7 && y + 2 <= 7
    && grid[y + 1][x + 1].pieceColor != playerColor
    && grid[y + 1][x + 1].pieceColor != grid[y][x].pieceColor
    && grid[y + 1][x + 1].pieceColor != null
    && grid[y + 2][x + 2].pieceColor == null
  ) {
    console.log("DOWNRIGHT CONDITIONAAAAAl")
    return true;
  }
  return false;
}


export {
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
