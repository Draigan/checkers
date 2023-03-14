import { useState, useEffect } from 'react';

function Piece({ grid, updateGrid, square, setBoard, board, setCurrentSquare }) {
  const [pieceType, setPieceType] = useState(square.pieceType);
  // Has this piece been clicked
  const [clicked, setClicked] = useState(false);
  // Style for the piece when clicked
  const [clickedStyle, setClickedStyle] = useState();
  // Position of the piece
  const [position, setPosition] = useState();

  useEffect(() => {
    setPosition(square.position);
    setPieceType(square.pieceType);
  }, [board])

  function checkPossible() {
    let y = position[0];
    let x = position[1];
    let up = y - 1;
    let down = y + 1;
    let left = x - 1;
    let right = x + 1;
    if (board[up][left].pieceType == "") {
      updateGrid(up, left);
    }
    if (board[up][right].pieceType == "") {
      console.log("FREE SPACE right")
    }


  };
  function click() {
    if (!clicked) {
      setCurrentSquare(square);
      setClickedStyle("-border");
      setClicked(true);
      checkPossible();
    } else {
      setClickedStyle("");
      setClicked(false);
    }

  }
  return (
    <div onClick={click} className={`piece-${pieceType} piece ${clickedStyle}`}>
    </div>
  );
}
export default Piece;
