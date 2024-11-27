import React, { useState } from "react";
import logo from "../../assets/loginlogo.png";
import { ImFacebook2 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import backgroundImage from "../../assets/signupbackground.jpg";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../components/firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";
import { login } from "../../redux/actions/login-actions";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPAssword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSentToPhone, setOtpSentToPhone] = useState(false);
  const [otpSentToEmail, setOtpSentToEmail] = useState(false);

  const registerUser = async (userData) => {
    console.log(userData, "user");
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-signup`,
        userData
      );

      if (response) {
        console.log(response.data, "response");
        toast.success(`Register SuccessFully`);
        localStorage.setItem("userId", response?.data?._id);

        navigate("/login");
      } else {
        throw new Error("Failed to register user.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setError("Invalid phone number. It should be 10 digits.");
      return;
    }

    if (password.length < 8) {
      setError("Passwords must be of 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // If successful, register the user with the backend
      console.log("nnn");
      await registerUser({ phoneNumber: phone, email, password });
      // Redirect or show success message
    } catch (err) {
      setError("Error signing up. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const state = location.state;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login successful:", result.user.email);
      console.log("Google login successful:", result.user.displayName);
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-google-login`,
        {
          email: result.user.email,
          firstName: result.user.displayName,
        }
      );
      console.log("response", response);
      if (response.success) {
        toast.success("Login SuccessFully");
        dispatch(login(true));
        localStorage.setItem("token", response.data);
        if (state?.countryId) {
          console.log("in");
          navigate(`/visa-types/${state.countryId}`);
        } else {
          console.log("out");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error(err.message);
    }
  };
  const sendPhoneOtp = async () => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}send-mobile-otp`,
        { phoneNumber: phone }
      );
      if (response) {
        setOtpSentToPhone(true);
        toast.success("OTP sent to phone.");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyPhoneOtp = async (otp) => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}user-verify-number`,
        { phoneNumber: phone, otp }
      );
      if (response) {
        setPhoneVerified(true);
        toast.success("Phone number verified.");
      } else {
        throw new Error("Invalid OTP.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const sendEmailOtp = async () => {
    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}send-otp`, {
        email,
      });
      if (response) {
        setOtpSentToEmail(true);
        toast.success("OTP sent to email.");
      } else {
        throw new Error("Failed to send OTP.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyEmailOtp = async (otp) => {
    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}verify-otp`, {
        email,
        otp,
      });
      if (response) {
        setEmailVerified(true);
        toast.success("Email verified.");
      } else {
        throw new Error("Invalid OTP.");
      }
    } catch (err) {
      setError(err.message);
    }
  };


  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Facebook login successful:", result.user);
    } catch (err) {
      console.error("Facebook login failed:", err);
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/;
    const right =  phoneRegex.test(phone);
   return right 
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePhoneOtp = (e) => {
    const otp = e.target.value;
    setPhoneOtp(otp);
    if (otp.length === 6) {
      verifyPhoneOtp(otp);
    }
  };

  const handleEmailOtp = (e) => {
    const otp = e.target.value;
    setEmailOtp(otp);
    if (otp.length === 6) {
      verifyEmailOtp(otp);
    }
  };

  return (
    <div
      className="min-h-screen flex py-8 items-center object-contain justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="bg-white/30 h-[80%] text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <Link to="/" className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-48" />
        </Link>
        <h2 className="text-center text-2xl font-bold mb-2">Register</h2>
        <p className="text-center mb-6">You're so close to leveling up!</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Phone Number Input */}
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone No"
            className="w-full p-2 text-black border border-gray-300 rounded-md"
            required
          />
          {!phoneVerified && validatePhoneNumber(phone) && (
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={sendPhoneOtp}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {otpSentToPhone ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
          )}
          {otpSentToPhone && !phoneVerified && (
            <>
               <input
              type="text"
              value={phoneOtp}
              onChange={handlePhoneOtp}
              placeholder="Enter OTP"
              className="w-full p-2 mt-2 text-black border border-gray-300 rounded-md"
              maxLength={6}
            />
              {/* <button
                type="button"
                onClick={verifyPhoneOtp}
                className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
              >
                Verify Phone
              </button> */}
            </>
          )}
          {phoneVerified && (
            <p className="text-green-500 flex items-center gap-2 text-xs relative bottom-3">
              Phone number verified{" "}
              <RiVerifiedBadgeFill size={18} color="#32a852" />
            </p>
          )}

          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border text-black border-gray-300 rounded-md"
            required
          />
          {!emailVerified && validateEmail(email) && (
            <div className="flex items-center relative gap-2 ">
              <button
                type="button"
                onClick={sendEmailOtp}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                {otpSentToEmail ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
          )}
          {otpSentToEmail && !emailVerified && (
            <>
              <input
              type="text"
              value={emailOtp}
              onChange={handleEmailOtp}
              placeholder="Enter OTP"
              className="w-full p-2 mt-2 text-black border border-gray-300 rounded-md"
              maxLength={6}
            />
              {/* <button
                type="button"
                onClick={verifyEmailOtp}
                className="bg-green-500 text-white py-2 px-4 rounded-md mt-2"
              >
                Verify Email
              </button> */}
            </>
          )}
          {emailVerified && (
            <p className="text-green-500 flex items-center gap-2 text-xs relative bottom-3">
              Email verified <RiVerifiedBadgeFill size={18} color="#32a852" />
            </p>
          )}

          <div className="relative w-full">
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
            />
            <div
              onClick={() => setShowPAssword(!showPassword)}
              className="absolute right-4 bottom-3 cursor-pointer"
            >
              {showPassword ? (
                <FaEye size={20} color="black" />
              ) : (
                <IoMdEyeOff size={20} color="black" />
              )}
            </div>
          </div>
          <div className="relative w-full">
            <input
              type={`${showConfirmPassword ? "text" : "password"}`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 bottom-3 cursor-pointer"
            >
              {showConfirmPassword ? (
                <FaEye size={20} color="black" />
              ) : (
                <IoMdEyeOff size={20} color="black" />
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md"
            // disabled={!phoneVerified || !emailVerified}
          >
            Register
          </button>
        </form>
        <div className="text-center justify-center items-center flex my-4">
          <div className="w-28 h-1 bg-white border"></div>
          SignUp with Others
          <div className="w-28 h-1 bg-white border"></div>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 border border-[#F0EDFF] text-black bg-white/80 rounded-xl"
          >
            <FcGoogle size={25} className="mr-2 " /> Login with Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center bg-white/80 justify-center py-3 border border-[#F0EDFF] text-black rounded-xl"
          >
            <ImFacebook2 color="blue" size={25} className="mr-2" /> Login with
            Facebook
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Login now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
