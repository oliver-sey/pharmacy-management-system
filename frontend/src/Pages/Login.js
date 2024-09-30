import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import '../Styles/Login.css';

function Login() {
  const[username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError('Username and password are required');
      return false;
    }
    setError('');
    return true;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append('username', username);
    formDetails.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',

        },
        body: formDetails,
      });

      setLoading(false);
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        console.log("navigating now")
        navigate('../protected', {replace: true});
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Authentication failed!');
      }

      } catch (error) {
        setLoading(false);
        setError('An error occured. Please try again later.');
      }
    }
  

  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <p>Password</p>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p>{error}</p>}
        </div>
      </form>
    </div>
  )
}

export default Login