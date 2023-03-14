import { useState, useEffect } from 'react';

function Piece({ square, setBoard, board }) {
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
  }, [])

  function checkPossible() {
    let y = position[0];
    let x = position[1];
    if (board[y - 1][x - 1].pieceType == "") {
      console.log("FREE SPACE")
    }


  };
  function click() {
    console.log(square)
    setBoard(Math.random());

    if (!clicked) {
      setClickedStyle("-border");
      setClicked(true);
      console.log(position);
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
