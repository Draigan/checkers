import { useState, useEffect } from 'react';
import red from '../../assets/redking.png'
import white from '../../assets/whiteking.png'
import { useNavigate } from 'react-router-dom'

function Hud({ globalUserName, socket, playerColor, tableColor }) {
  const navigate = useNavigate();
  const [foeUserName, setFoeUserName] = useState([]);
  const [tableFull, setTableFull] = useState(false);
  let tableColorForHud;
  if (tableColor === "white") {
    tableColorForHud = "Blue"
  } else {
    tableColorForHud = "Red"
  }

  function newGame() {
    socket.emit("request_reset_table");
    console.log("NEWGAME")
  }
  function backToLobby() {
    navigate(`/home`)

  }
  useEffect(() => {
    socket.on("recieve_foe_user", (data) => {
      console.log(data)

      if (data.length > 1) {
        setTableFull(true);
      } else {
        setTableFull(false);
      }
      let foe = data.filter((user) => user !== globalUserName);
      setFoeUserName(foe);
    })
  }, [socket])
  return (
    <div>
      <div className="hud">
        <div className="hud--title">PLAYERS</div>
        <div className="hud--players">
          <div className="hud--player-name">
            {playerColor === "white" && <img alt='white' className={`hud--piece`} src={red} />}
            {playerColor === "red" && <img alt='red' className="hud--piece" src={white} />}
            {(tableFull && <span >{foeUserName}</span>) || <span className="hud--waiting" >Waiting for other players...</span>}
          </div>
          <div >
            <div alt='red' className={`hud--player-name`}>{playerColor === "red" && <img alt='red' className="hud--piece" src={red} />}
              {playerColor === "white" && <img alt='white' className="hud--piece" src={white} />}{globalUserName}
            </div>
          </div>
        </div>
        <div className="hud--title">Turn: {tableColorForHud}</div>
      </div>
      <div onClick={newGame} className="hud--button">
        Reset Table
      </div>
      <div onClick={backToLobby} className="hud--button">
        Back To Lobby
      </div>
    </div>
  );
}
export default Hud;
