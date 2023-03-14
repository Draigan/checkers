import { useRef, useEffect, useState } from 'react'
import Piece from "./Piece";

function Board(fen) {
  const firstRender = useRef(true);
  const grid = useRef();
  fen = fen.fen
  const [board, setBoard] = useState();

  useEffect(() => {
    console.log("BOARD CHANGE")
  }, []);

  if (firstRender) {

    let tmp = [];
    for (let i = 0; i < 8; i++) {
      tmp[i] = [];
      for (let j = 0; j < 8; j++) {
        // Create board objects
        tmp[i][j] = {
          pieceType: "",
          id: `${i}${j}`,
          pieceImage: "",
          position: [i,j],
          possible: false,
          squareColor: "",
          cssStyle: ""
        };
        // Set board colors
        setBoardColors(i, j);
      }
    };
    firstRender.current = false;
    grid.current = tmp;

    function setBoardColors(i, j) {
      if (j % 2 == 0) {
        tmp[i][j].cssStyle = "square-black";
        tmp[i][j].squareColor = "black";
      } else {
        tmp[i][j].cssStyle = "square-white";
        tmp[i][j].squareColor = "red";
      }
      if (j % 2 == 0 && i % 2 == 0) {
        tmp[i][j].cssStyle = "square-white";
        tmp[i][j].squareColor = "red";
      }
      if (j % 2 != 0 && i % 2 == 0) {
        tmp[i][j].cssStyle = "square-black";
        tmp[i][j].squareColor = "black";
      }
    }

    // function readFen() {
    //   let tmp = "";
    //   if ()
    // }
    function writeFen() {
      let count = 0;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (fen[count] == "1") {
            grid.current[i][j].pieceType = "red"
          }
          if (fen[count] == "2") {
            grid.current[i][j].pieceType = "redking"
          }
          if (fen[count] == "3") {
            grid.current[i][j].pieceType = "white"
          }
          if (fen[count] == "4") {
            grid.current[i][j].pieceType = "whiteking"
          }
          count++;
        }
      }
    }
    writeFen();
  };
  // setBoard(grid);

  return (
    <div className="board" >
      {grid.current.map((row) => row.map((square) => {
        return (
          <div className={square.cssStyle + " square"} key={square.id}>
            <Piece
              square={square}
              setBoard={setBoard}
              board={board}
            />
          </div>
        )

      }))}
    </div>


  );
}
export default Board;
