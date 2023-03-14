import { useRef, useEffect, useState } from 'react'
import Piece from "./Piece";

function Board() {
  const firstRender = useRef(true);
  const [fen, setFen] = useState("0101010110101010010101010000000000000000303030300303030330303030");
  const grid = useRef();
  const [board, setBoard] = useState();
  const [currentSquare, setCurrentSquare] = useState();
  let tmp = [];

  useEffect(() => {
    setBoard(grid.current);
  }, []);

  for (let i = 0; i < 8; i++) {
    tmp[i] = [];
    for (let j = 0; j < 8; j++) {
      // Create board objects
      tmp[i][j] = {
        pieceType: "",
        id: `${i}${j}`,
        pieceImage: "",
        position: [i, j],
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
      tmp[i][j].squareColor = "white";
    }
    if (j % 2 == 0 && i % 2 == 0) {
      tmp[i][j].cssStyle = "square-white";
      tmp[i][j].squareColor = "white";
    }
    if (j % 2 != 0 && i % 2 == 0) {
      tmp[i][j].cssStyle = "square-black";
      tmp[i][j].squareColor = "black";
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
        count++;
      }
    }
  }
  readFen();
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
        if (grid.current[i][j].pieceType == "") {
          tmp += "0";
        }
      }
    }
    return tmp;
  }
  function updateGrid(y, x) {
    grid.current[y][x].possible = true;
    console.log(grid.current[y][x].possible)
  }

  function movePiece(position) {
    let y = position[0];
    let x = position[1];
    console.log(grid.current[y][x].possible)
    if (grid.current[y][x].possible == true) {
      grid.current[y][x].pieceType = "white";
    }
    console.log(writeFen())
    setFen(writeFen());
  }
  useEffect(() => {
    console.log("FEN CHANGED")
    console.log(board)
    setBoard(grid.current)
  }, [fen]);

  useEffect(() => {
    setBoard(grid.current);
  }, []);

  return (
    <div className="board" >
      {grid.current.map((row) => row.map((square) => {
        return (
          <div className={square.cssStyle + " square"}
            onClick={() => { movePiece(square.position) }} key={square.id}>
            <Piece
              square={square}
              setBoard={setBoard}
              board={board}
              setCurrentSquare={setCurrentSquare}
              movePiece={movePiece}
              grid={grid.current}
              updateGrid={updateGrid}
            />
          </div>
        )

      }))}
    </div>


  );
}
export default Board;
