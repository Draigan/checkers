import { Routes, Route } from 'react-router-dom';
import io from 'socket.io-client'
import Table from "./components/pages/Table";
import Home from "./components/pages/Home";
import Login from "./components/pages/Login";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
const socket = io.connect("http://localhost:1212");

function App() {
  const navigate = useNavigate();
  socket.on("recieve_new_connection", () => {
    navigate("/");
  })
  const [globalUserName, setGlobalUserName] = useState(null);


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
