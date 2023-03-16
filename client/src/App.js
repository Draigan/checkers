import { Link, Routes, Route } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'
import Game from "./components/game/Game";
import Table from "./components/Table";
import Home from "./components/Home";
import Login from "./components/Login";
import { useEffect, useState } from 'react';
const socket = io.connect("localhost:4001");

function App() {
  // const [message, setMessage] = useState();
  // useEffect(() => {
  //   socket.on("recieve_message", (data) => {
  //     console.log(data)
  //   }, [socket])
  // });

  function test() {
    console.log("TEST EMIT")
    socket.emit("test");

  }

  return (
    <>
      <button onClick={test}>EMIT</button>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home socket={socket} />} />
        <Route path="/table" element={<Table socket={socket} />} />
      </Routes>
    </>
  )
}

export default App;
