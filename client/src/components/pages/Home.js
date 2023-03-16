import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
function Home({ socket, globalUserName, setGlobalUserName }) {
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit('request_username');
    socket.on('response_username', (data) => {
      console.log(data)
      setGlobalUserName(data);
    })
  }, [socket, globalUserName]);
  socket.emit('leave_table');

  return (
    <>
      <ul>
        <h1> WELCOME TO CHECKERS {globalUserName}  CHOOSE A GAME ROOM</h1>
        <li><button onClick={() => {
          navigate("/table/1")
          socket.emit("join_table", "table_one", 1);
        }}>TABLE ONE</button></li>
        <li><button onClick={() => {
          navigate("/table/2")
          socket.emit("join_table", "table_two", 2);
        }}>TABLE TWO </button></li>
        <li><button onClick={() => {
          navigate("/table/3")
          socket.emit("join_table", "table_three", 3);
        }}>TABLE THREE</button></li>
        <li><button onClick={() => {
          navigate("/table/4")
          socket.emit("join_table", "table_four", 4);
        }}>TABLE FOUR</button></li>
      </ul>

    </>

  );
}
export default Home;
