import { Link, Routes, Route } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'
import Game from "./components/game/Game";
import Table from "./components/pages/Table";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import { useEffect, useState } from 'react';
const socket = io.connect("localhost:4001");

function App() {
  // Prevent reloa d
  // window.addEventListener("beforeunload", (event) => {
  //   event.preventDefault();
  //   return event.returnValue = "DONT LEAVE"
  // });
  const [globalUserName, setGlobalUserName] = useState("anon");
  // useEffect(() => {
  //   socket.on("recieve_message", (data) => {
  //     console.log(data)
  //   }, [socket])
  // });


  return (
    <>
      <Routes>
        <Route path="/" element={<Login socket={socket} />} />
        <Route path="/home" element={
          <Home
            globalUserName={globalUserName}
            setGlobalUserName={setGlobalUserName}
            socket={socket} />} />
        <Route path="/table/:id" element={<Table globalUserName={globalUserName} socket={socket} />} />
      </Routes>
    </>
  )
}

export default App;
