
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

export { checkForJumps }
