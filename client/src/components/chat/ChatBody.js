import { useEffect, useState } from 'react';

function ChatBody({ socket, messages, globalUserName, lastMessageRef }) {

  // useEffect(() => {
  //   socket.on('chat_recieve_message', (data) => {
  //     console.log(data)
  //   })

  // }, [socket]);

  return (
    <>
      <ul className="chat--body" >
        {messages.map((message, index) => {
          return (
            <li key={message.id} className="chat--message" >
              <span className="chat--message-username">{message.username}</span>
              <span className="chat--message-text">{message.text}</span>
            </li>
          );
        })
        }
        <div ref={lastMessageRef} />
      </ul>
    </>

  );

}

export default ChatBody;
