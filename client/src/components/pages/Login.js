import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function Login({ socket }) {
  const [loginUser, setLoginUser] = useState(``);
  const navigate = useNavigate();

  socket.emit("request_leave_table");
  function handleSubmit(e) {
    e.preventDefault();
    if (loginUser === "") {
      socket.emit("user_login", `anon#${Math.floor(Math.random() * 100000)}`);
    } else {
      socket.emit("user_login", loginUser);
    }
    navigate('/home')
  }
  return (
    <>
      <h1 className="login--title">Online Checkers</h1>
      <div className="login--body">
        <h2>Choose Username:</h2>
        <form onSubmit={handleSubmit}>
          <input
            maxlength="10"
            type="text"
            minLength={6}
            name="username"
            id="username"
            className="username--input"
            onChange={(e) => setLoginUser(e.target.value)}
          />
          <button onClick={handleSubmit} type="submit">Play Checkers</button>
        </form>
      </div>
    </>

  );
}
export default Login;
