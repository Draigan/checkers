import Game from './game/Game'
import Chat from './chat/Chat'
function Table({ socket }) {
  return (
    <>
      <Game socket={socket} />
      <Chat />
    </>
  );
}
export default Table;
