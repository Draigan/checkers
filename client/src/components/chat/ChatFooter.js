import { useState } from 'react';

function ChatFooter({ socket }) {
  const [message, setMessage] = useState();
  function handleSend() {
    socket.emit('chat_send_message', message)
  }
  return (
    <div className="chat--footer">
      <input type="text"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={handleSend}> Submit</button>
    </div>

  );

}

export default ChatFooter;
