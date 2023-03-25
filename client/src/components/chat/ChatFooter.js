import { useState, useRef } from 'react';

function ChatFooter({ socket, globalUserName }) {

  const [message, setMessage] = useState();
  const chatInput = useRef();
  function handleSend(e) {
    e.preventDefault();
    if (chatInput.current.value == "") return;
    socket.emit('chat_send_message', {
      text: message,
      username: globalUserName + ":",
      id: `${socket.id}${Math.random()}`,
      sockedID: socket.id,
    })
    setMessage('');
    chatInput.current.value = "";
  }

  return (
    <div >
      <form className="chat--footer" onSubmit={handleSend}>
        <input
          className="chat--input"
          ref={chatInput} type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="chat--button"
          onClick={handleSend}> Send</button>
      </form>
    </div >

  );

}

export default ChatFooter;
