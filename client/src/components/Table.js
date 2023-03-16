import Game from './game/Game'
import Chat from './chat/Chat'
function Table({ socket }) {
  return (
    <>
      <h1>WELCOME TO TABLE</h1>
      <div className="table">
        <Chat socket={socket} />
        <Game socket={socket} />
      </div>
    </>
  )

}
export default Table;
