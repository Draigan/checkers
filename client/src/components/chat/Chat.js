import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { useEffect, useState } from 'react';

function Chat({ socket }) {
  const [messages, setMessages] = useState();
  useEffect(() => {
    socket.on('chat_reiece_message', (data) => setMessages([...messages, data]));
  }, [socket])
  return (
    <div className="chat">
      <ChatBody messages={messages} socket={socket} />
      <ChatFooter socket={socket} />
    </div>
  );
}
export default Chat;
