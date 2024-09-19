import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import board from "../../assets/board.png"
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
    socket.on("recieve_table_status", (data) => {
      setTablesStatus(data)
    })
  }, [socket]);

  function joinTable(table, id) {
    if (table === 2) return console.log("full");
    navigate(`/table/${id}`)
  }


  return (
    <div className="lobby">
      <h1 className="lobby--title"> Welcome To Online Checkers, {globalUserName} </h1>
      <div className="lobby--tables">
        <div className="lobby--table">
          <div className="lobby--table-top">
            <div>
              <h2> Table One </h2>
              <h3> Players: {tablesStatus.table_one}/2 </h3>
            </div>
            <img className="lobby--board" src={board} alt="board" />
          </div>
          <button className="lobby--button" onClick={() => {
            joinTable(tablesStatus.table_one, 1);
          }}>Join Table</button>
        </div>
        <div className="lobby--table">
          <div className="lobby--table-top">
            <div>
              <h2> Table Two </h2>
              <h3> Players: {tablesStatus.table_two}/2 </h3>
            </div>
            <img className="lobby--board" src={board} alt="board" />
          </div>
          <button className="lobby--button" onClick={() => {
            joinTable(tablesStatus.table_two, 2);
          }}>Join Table</button>
        </div>
        <div className="lobby--table">
          <div className="lobby--table-top">
            <div>
              <h2> Table Three </h2>
              <h3> Players: {tablesStatus.table_three}/2 </h3>
            </div>
            <img className="lobby--board" src={board} alt="board" />
          </div>
          <button className="lobby--button" onClick={() => {
            joinTable(tablesStatus.table_three, 3);
          }}>Join Table</button>
        </div>
        <div className="lobby--table">
          <div className="lobby--table-top">
            <div>
              <h2> Table Four </h2>
              <h3> Players: {tablesStatus.table_four}/2 </h3>
            </div>
            <img className="lobby--board" src={board} alt="board" />
          </div>
          <button className="lobby--button" onClick={() => {
            joinTable(tablesStatus.table_four, 4);
          }}>Join Table</button>
        </div>
      </div>
    </div>

  );
}
export default Home;
