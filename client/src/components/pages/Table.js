import Game from '../game/Game'
import { useParams } from 'react-router-dom'
import Chat from '../chat/Chat'
function Table({ socket, globalUserName }) {
  const { id } = useParams();
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
