import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function Login() {
  const [userName, setUserName] = useState();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    console.log(localStorage)
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
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={handleSubmit} type="submit">Submit</button>
    </div>

  );
}
export default Login;
