import React, { useEffect, useState } from "react";
import logo from "../../assets/loginlogo.png";
import whitelogo from "../../assets/whitelogo.png";
import { ImFacebook2 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import {
  auth,
  googleProvider,
  facebookProvider,
  generateToken,
} from "../../components/firebase/firebase";
import { signInWithPopup } from "firebase/auth";

import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/login-actions";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [showPassword, setShowPAssword] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return re.test(String(email).toLowerCase());
  };

  const generateDeviceToken = async () => {
    const resp = await generateToken();
    console.log("resp", resp);
    const tken = localStorage.getItem("deviceToken");
    setToken(tken);
  };
  console.log(token, "devicetoken");

  useEffect(() => {
    console.log("asdasd");
    generateDeviceToken();
  }, []);

  const validatePhone = (phone) => {
    const re = /^[1-9]\d{9}$/;
    return re.test(String(phone));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const state = location.state;

    if (!validateEmail(emailOrPhone) && !validatePhone(emailOrPhone)) {
      setError("Please enter a valid email or phone number.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}user-login`, {
        credential: emailOrPhone,
        password,
        deviceToken: token,
      });
      console.log("response", response);
      if (response.success) {
        toast.success("Login SuccessFully");
        dispatch(login(true));
        localStorage.setItem("token", response.token);
        if (state?.countryId) {
          console.log("in");
          navigate(`/visa-types/${state.countryId}`);
        } else {
          console.log("out");
          navigate("/");
        }
      }
      console.log("Login successful:", response);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please try again.");
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
      toast.error(err);
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

  return (
    <div
      className="flex items-center justify-center h-[100%] py-8 min-h-screen bg-center bg-cover"
      style={{
        backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw0uAVzEIqlrCrLkFz9KLzU0FGUFppxUP5wRg1JOO7MUUEtBvroKMzt_xYVedz3VERd_I&usqp=CAU)`,
      }}
    >
      <div className="bg-white/30  p-10 rounded-xl shadow-lg text-white w-full max-w-md">
        <Link to="/" className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-48" />
        </Link>
        <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>
        <p className="text-center  mb-6">You're so close to leveling up!</p>

        {error && <p className="text-center text-red-500 my-3">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Phone No or Email"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
            />
          </div>
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
              className="absolute  right-4 bottom-3 cursor-pointer"
            >
              {showPassword ? (
                <FaEye size={20} color="black" />
              ) : (
                <IoMdEyeOff size={20} color="black" />
              )}
            </div>
          </div>
          <div className="text-right mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-white hover:text-gray-300"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 rounded-xl hover:bg-blue-500"
          >
            Login
          </button>
        </form>

        <div className="text-center justify-center items-center flex my-4">
          <div className="w-28 h-1 mx-1 rounded-lg bg-white border"></div>
          Login with Others
          <div className="w-28 h-1 mx-1 rounded-lg bg-white border"></div>
        </div>
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center py-3 border border-[#F0EDFF] text-black bg-white/80 rounded-xl"
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={25} className="mr-2 " /> Login with Google
          </button>
          <button
            className="w-full flex items-center bg-white/80 justify-center py-3 border border-[#F0EDFF] text-black rounded-xl"
            onClick={handleFacebookLogin}
          >
            <ImFacebook2 color="blue" size={25} className="mr-2" /> Login with
            Facebook
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-white">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
