import { useEffect } from 'react';

function ChatBody({ socket }) {

  useEffect(() => {
    socket.on('chat_recieve_message', (data) => {
      console.log(data)
    })

  }, [socket]);

  return (
    <>
      Chat
      <div className="chat--body">
      </div>
    </>

  );

}

export default ChatBody;
