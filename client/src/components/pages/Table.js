import Game from '../game/Game'
import { useParams } from 'react-router-dom'
import { useState } from 'react';
import Chat from '../chat/Chat'
import Hud from '../hud/Hud.js'
function Table({ socket, globalUserName }) {
  const { id } = useParams();
  const [tableColor, setTableColor] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  // This maps the id number to the table name because the server requests a table name
  const tableMap = {
    1: "table_one",
    2: "table_two",
    3: "table_three",
    4: "table_four",
  }
  socket.emit("join_table", tableMap[id], id);

  return (
    <>
      <h1 className="table--title">Online Checkers | Table {id} | {globalUserName} </h1>
      <div className="table">
        <Chat
          globalUserName={globalUserName}
          socket={socket} />
        <Game
          globalUserName={globalUserName}
          playerColor={playerColor}
          setPlayerColor={setPlayerColor}
          tableColor={tableColor}
          setTableColor={setTableColor}
          socket={socket} />
        <Hud
          globalUserName={globalUserName}
          socket={socket}
          playerColor={playerColor}
          tableColor={tableColor}
        />
      </div>
    </>
  )

}
export default Table;
