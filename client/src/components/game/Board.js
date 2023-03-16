import { useRef, useEffect, useState } from 'react'
import Square from "./Square";

function Board({ tmp }) {
  const [fen, setFen] = useState("0101010110101010010101010000000000000000303030400303030330303030");
  const grid = useRef(tmp);
  const [clicked, setClicked] = useState(false);

  function clickSquare(position) {
    let y = position[0];
    let x = position[1];
    console.log(y, x)
    if (!clicked) {
      setClicked(true);
      grid.current[y][x].highlight = "-highlight";
      changeGrid(4, 4);
      console.log("HEY");
    } else {
      grid.current[y][x].highlight = "";
      setClicked(false);
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
  function changeGrid(y, x) {
    // grid[y][x].possible = Math.random();
    // console.log("CHANGEGRID")
  }
  readFen();
  // function writeFen() {
  //   let tmp = "";
  //   for (let i = 0; i < 8; i++) {
  //     for (let j = 0; j < 8; j++) {
  //       if (grid.current[i][j].pieceType == "red") {
  //         tmp += "1";
  //       }
  //       if (grid.current[i][j].pieceType == "redking") {
  //         tmp += "2";
  //       }
  //       if (grid.current[i][j].pieceType == "white") {
  //         tmp += "3";
  //       }
  //       if (grid.current[i][j].pieceType == "whiteking") {
  //         tmp += "4";
  //       }
  //       if (grid.current[i][j].pieceType == "") {
  //         tmp += "0";
  //       }
  //     }
  //   }
  //   return tmp;
  // }
  useEffect(() => {

    console.log("Grid Changed");

  }, [grid])


  return (
    <div className="board" >
      {grid.current.map((row) => row.map((square) => {
        return (
          <div key={square.id} onClick={() => { clickSquare(square.position); }}
            className={`${square.cssStyle} square ${square.highlight}`} >

            <Square key={square.id} grid={grid.current} square={square} changeGrid={changeGrid} />

          </div>
        )
      }))}
    </div>


  );
}
export default Board;
