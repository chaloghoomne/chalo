import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrNumber, setEmailOrNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authenticate the user and get the token
    const token = 'mockToken'; // Replace with actual token
    // localStorage.setItem('authToken', token);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email or Phone Number</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={emailOrNumber}
            onChange={(e) => setEmailOrNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Log In
        </button>
        <Link className='text-blue-500 underline ml-14 text-sm' to="/forgot-password">Forgot password</Link>
      </form>
    </div>
  );
};

export default Login;
