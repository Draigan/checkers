import Game from '../game/Game'
import { useParams } from 'react-router-dom'
import Chat from '../chat/Chat'
function Table({ socket, globalUserName }) {
  const { id } = useParams();
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
      <h1>WELCOME TO TABLE {id} {globalUserName} </h1>
      <div className="table">
        <Chat socket={socket} />
        <Game socket={socket} />
      </div>
    </>
  )

}
export default Table;
