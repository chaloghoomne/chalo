import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/loginlogo.png";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(true);
  useEffect(() => {
    if (showOtpInput && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showOtpInput, timer]);

  const validatePhone = (phone) => {
    const re = /^[1-9]\d{9}$/;
    return re.test(String(phone));
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(phoneNumber)) {
      setError("Please enter a valid phone number.");
      return;
    }
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-forgot-password`,
        {
          phoneNumber,
        }
      );
      if (response) {
        setShowOtpInput(true);
        setTimer(60);
        toast.success("OTP sent successfully.");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // if (index === 5 && value) {
    //   handleOtpSubmit();
    // }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join("");
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-verify-number`,
        {
          phoneNumber,
          otp: enteredOtp,
        }
      );
      if (response) {
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
        setError("");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8 || confirmPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-change-password`,
        {
          phoneNumber,
          password,
        }
      );
      if (response) {
        toast.success("Password reset successfully.");
        navigate("/login");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setOtp(Array(6).fill(""));
    setTimer(60);
    setShowOtpInput(false);
    setOtpVerified(false);
    setError("");

    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-forgot-password`,
        {
          phoneNumber,
        }
      );
      if (response) {
        setShowOtpInput(true);
        toast.success("OTP resent successfully.");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-[100%] py-8 min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url(https://img.lovepik.com/background/20211022/large/lovepik-simple-technology-background-image_401740828.jpg)`,
      }}
    >
      <div className="bg-gray-800 bg-opacity-70 p-10 rounded-xl shadow-lg text-white w-full max-w-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto h-20" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <p className="text-center mb-6">
          Enter your phone number to reset your password
        </p>

        {error && <p className="text-center text-red-500 my-3">{error}</p>}

        {!showOtpInput && !otpVerified && (
          <form className="space-y-6" onSubmit={handlePhoneSubmit}>
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 rounded-xl focus:outline-none text-black bg-white border border-gray-600 placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 rounded-xl hover:bg-blue-500"
            >
              Send OTP
            </button>
          </form>
        )}

        {showOtpInput && !otpVerified && (
          <div>
            <p className="text-center mb-6">Enter the OTP sent to your phone</p>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  maxLength="1"
                  id={`otp-input-${index}`}
                  className="w-12 p-3 rounded-xl text-black bg-white border border-gray-600 text-center"
                />
              ))}
            </div>
            <button
              type="button"
              className="w-full p-3 bg-blue-600 rounded-xl hover:bg-blue-500"
              onClick={handleOtpSubmit}
            >
              Verify OTP
            </button>
            {timer > 0 ? (
              <p className="text-center mt-4">Resend OTP in {timer} seconds</p>
            ) : (
              <button
                type="button"
                className="w-full p-3 mt-4 bg-blue-600 rounded-xl hover:bg-blue-500"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        {otpVerified && (
          <form className="space-y-6" onSubmit={handlePasswordSubmit}>
            <div className="relative" >
              <input
                 type={`${show2 ? "password" : "text"}`}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
              />
               <div
                onClick={() => setShow2(!show2)}
                className="absolute cursor-pointer right-3 top-4"
              >
                {show2 ? (
                  <IoMdEyeOff size={22} color="black" />
                ) : (
                  <IoEye size={22} color="black" />
                )}
              </div>
            </div>
            <div className="relative">
              <input
                 type={`${show3 ? "password" : "text"}`}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
              />
               <div
                onClick={() => setShow3(!show3)}
                className="absolute cursor-pointer right-3 top-4"
              >
                {show3 ? (
                  <IoMdEyeOff size={22} color="black" />
                ) : (
                  <IoEye size={22} color="black" />
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 rounded-xl hover:bg-blue-500"
            >
              Set New Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
