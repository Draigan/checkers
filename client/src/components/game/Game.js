import { useState, useEffect, useRef } from 'react';
import Board from "./Board";

function Game({ socket }) {
  const [turn, setTurn] = useState("white");

  useEffect(() => {
    socket.on("recieve_message", () => {
      console.log("recieved a message in room 1");
    });

  }, [socket]);

  let tmp = [];
  for (let i = 0; i < 8; i++) {
    tmp[i] = [];
    for (let j = 0; j < 8; j++) {
      // Create board objects
      tmp[i][j] = {
        pieceType: null,
        id: `${i}${j}`,
        pieceImage: null,
        position: [i, j],
        possible: false,
        squareColor: null,
        cssStyle: null,
        highlight: ""
      };
      // Set board colors
      setBoardColors(i, j);
    }
  };
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
  return (

    <Board tmp={tmp}
      turn={turn}
      setTurn={setTurn}
    />

  );
}

export default Game;
