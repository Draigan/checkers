import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
function Home({ socket, globalUserName, setGlobalUserName }) {
  const [tablesStatus, setTablesStatus] = useState({
    table_one: 0,
    table_two: 0,
    table_three: 0,
    table_four: 0
  });
  const navigate = useNavigate();
  useEffect(() => {
    socket.emit('request_username');
    socket.on('recieve_username', (data) => {
      setGlobalUserName(data);
    })
  }, []);

  // Request to leave last table 
  socket.emit('request_leave_table');

  useEffect(() => {
    //   socket.emit("request_table_status")
    socket.on("recieve_table_status", (data) => {
      setTablesStatus(data)
    })
  }, [socket]);

  function joinTable(table, id) {
    if (table == 2) return console.log("full");
    navigate(`/table/${id}`)
  }


  return (
    <>
      <ul>
        <h1> WELCOME TO CHECKERS {globalUserName}  CHOOSE A GAME ROOM</h1>
        <li><button onClick={() => {
          joinTable(tablesStatus.table_one, 1);
        }}>TABLE ONE {tablesStatus.table_one}</button></li>
        <li><button onClick={() => {
          joinTable(tablesStatus.table_two, 2);
        }}>TABLE TWO {tablesStatus.table_two} </button></li>
        <li><button onClick={() => {
          joinTable(tablesStatus.table_three, 3);
        }}>TABLE THREE {tablesStatus.table_three}</button></li>
        <li><button onClick={() => {
          joinTable(tablesStatus.table_four, 4);
        }}>TABLE FOUR {tablesStatus.table_four}</button></li>
      </ul>

    </>

  );
}
export default Home;
