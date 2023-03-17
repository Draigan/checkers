import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function Login({ socket }) {
  const [loginUser, setLoginUser] = useState(``);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (loginUser == "") {
      socket.emit("user_login", `anon#${Math.floor(Math.random() * 100000)}`);
    } else {
      socket.emit("user_login", loginUser);
    }
    navigate('/home')
  }
  return (
    <div className="field">
      <h1> Choose a username </h1>
      <input
        type="text"
        minLength={6}
        name="username"
        id="username"
        className="username--input"
        onChange={(e) => setLoginUser(e.target.value)}
      />
      <button onClick={handleSubmit} type="submit">Submit</button>
    </div>

  );
}
export default Login;
