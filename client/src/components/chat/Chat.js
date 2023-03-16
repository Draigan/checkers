import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { useEffect, useState } from 'react';

function Chat({ socket }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on('chat_recieve_message', (data) => {
      setMessages([...messages, data])
      console.log(messages)

    });
  }, [socket, messages])
  // const [messages, setMessages] = useState("");
  // useEffect(() => {
  //   socket.on('chat_recieve_message', (data) => {
  //     setMessages(data)

  //   });
  // }, [socket])
  return (
    <div className="chat">
      <ChatBody messages={messages} socket={socket} />
      <ChatFooter setMessages={setMessages} socket={socket} />
    </div>
  );
}
export default Chat;
