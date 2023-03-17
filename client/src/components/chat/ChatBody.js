import { useEffect, useState } from 'react';

function ChatBody({ socket, messages }) {

  // useEffect(() => {
  //   socket.on('chat_recieve_message', (data) => {
  //     console.log(data)
  //   })

  // }, [socket]);

  return (
    <>
      <div className="chat--body">
        <ul>
          {messages.map((message, index) => {
            return (
              <li key={index} >
                {message}
              </li>
            );
          })
          }
        </ul>
      </div>
    </>

  );

}

export default ChatBody;
