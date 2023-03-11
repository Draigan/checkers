import './App.css';
import { useState, useEffect } from 'react';
import io from 'socket.io-client'
const socket = io.connect("18.217.142.174:8080");

function App() {
  const [state, setState] = useState("124124");
  const [message, setMessage] = useState("");
  // setState({ hey: "123", bye: "345" });
  function sendMessage() {
    socket.emit("send_message", message);
  }

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log(data)
    }, [socket])
  });

  return (
    <div className="App">
      <input placeholder="message..."
        onChange={(e) => {
          setMessage(e.target.value)
        }}
      />
      <button onClick={sendMessage}> Send Message </button>
    </div>
  );
}

export default App;
