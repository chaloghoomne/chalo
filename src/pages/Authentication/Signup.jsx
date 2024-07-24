import React, { useState } from 'react';

const SignUp = () => {
  const [emailOrNumber, setEmailOrNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate email/number and send OTP
    // For now, assume validation is successful and OTP is sent
    setIsOtpSent(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // Verify OTP and sign up the user
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={isOtpSent ? handleOtpSubmit : handleSubmit}>
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
        {isOtpSent && (
          <div className="mb-4">
            <label className="block text-gray-700">OTP</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {isOtpSent ? 'Verify OTP' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
