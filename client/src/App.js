import './css/board.css';
import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'
import Board from "./Board";
const socket = io.connect("localhost:4000");

function App() {
  const [turn, setTurn] = useState("white");
  const [message, setMessage] = useState("");
  const firstRender = useRef(true);
  const grid = useRef();
  let fen = "0101010110101010010101010000000000000000303030300303030330303030";



  function sendMessage() {
    socket.emit("send_message", message);
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log(data)
    }, [socket])
  });


  return (
    <>
      <Board fen={fen} />
    </>
  )
}

export default App;
