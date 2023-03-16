import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
function Home({ socket }) {
  const navigate = useNavigate();

  return (
    <>
      <ul>
        <h1> WELCOME TO CHECKERS {localStorage.userName} CHOOSE A GAME ROOM</h1>
        <li><button onClick={() => {
          navigate("/table")
          socket.emit("table_one");
        }}>TABLE ONE</button></li>
        <li><button onClick={() => { navigate("/table") }}>TABLE TWO </button></li>
        <li><button onClick={() => { navigate("/table") }}>TABLE THREE</button></li>
        <li><button onClick={() => { navigate("/table") }}>TABLE FOUR</button></li>
      </ul>

    </>

  );
}
export default Home;
