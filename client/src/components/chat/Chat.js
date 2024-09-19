import ChatBody from './ChatBody'
import ChatFooter from './ChatFooter'
import { useEffect, useState, useRef } from 'react';

function Chat({ socket, globalUserName }) {
  const [messages, setMessages] = useState([{ id: "12345" }]);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on('chat_recieve_message', (data) => {
      setMessages([...messages, data]);
      if (messages[messages.length - 1].text === data.text
        && messages[messages.length - 1].username === data.username) {
        setMessages(messages.slice(0, messages.length));
      }

    });
  }, [socket, messages])

  useEffect(() => {
    socket.on("recieve_player_color", () => {
      socket.emit('chat_send_message', {
        text: ` joined the table`,
        username: `${globalUserName}`,
        id: `${socket.id}${Math.random()}`,
        sockedID: socket.id,
        joinMessage: true,
      })
    })
  }, [socket, globalUserName])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <h2 className="chat--title">Table Chat </h2>
      <ChatBody
        lastMessageRef={lastMessageRef}
        globalUserName={globalUserName}
        messages={messages}
        socket={socket} />
      <ChatFooter
        globalUserName={globalUserName}
        setMessages={setMessages}
        socket={socket} />
    </div>
  );
}
export default Chat;
