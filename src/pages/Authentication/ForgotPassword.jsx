import React, { useState } from 'react';

const ForgotPassword = () => {
  const [emailOrNumber, setEmailOrNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
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
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
