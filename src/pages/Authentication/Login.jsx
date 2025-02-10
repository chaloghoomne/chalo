import React, { useEffect, useState } from "react";
import logo from "../../assets/loginlogo.png";
import signupBgImage from "../../assets/signupBgImage.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdEyeOff } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/login-actions";
import { BASE_URL } from "../../api-integration/urlsVariable";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [token, setToken] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [emailOrPhone, setEmailOrPhone] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const location = useLocation();

	const validateEmail = (email) => {
		const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
		return re.test(String(email).toLowerCase());
	};

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
			const response = await axios.post(
				`${BASE_URL}user-login`,
				{
					credential: emailOrPhone,
					password,
				}
			);
			console.log("response: ", response);
			if (response.data.success) {
				toast.success("Login Successfully");
				console.log("response.data.token: ", response.data.token);
				dispatch(login(true));
				localStorage.setItem("token", response.data.token);

				if (state?.countryId) {
					navigate(`/visa-types/${state.countryId}`);
				} else {
					window.location.href = `/home?id=${response.data.userId}`;
				}
			}
		} catch (err) {
			console.error("Login failed:", err);
			setError("Login failed, Wrong Credentials.");
		}
	};

	return (
		<div
			className="flex items-center justify-center h-[100%] py-8 min-h-screen bg-center bg-cover"
			style={{ backgroundImage: `url(${signupBgImage})` }}
		>
			<div className="bg-white/30 p-10 rounded-xl shadow-lg text-white w-full max-w-md">
				<Link to="/" className="text-center mb-6">
					<img src={logo} alt="Logo" className="mx-auto w-48" />
				</Link>
				<h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>

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
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-3 rounded-xl text-black bg-white border border-gray-600 placeholder-gray-400"
						/>
						<div
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 bottom-3 cursor-pointer"
						>
							{showPassword ? <FaEye size={20} color="black" /> : <IoMdEyeOff size={20} color="black" />}
						</div>
					</div>
					<button type="submit" className="w-full p-3 bg-blue-600 rounded-xl hover:bg-blue-500">
						Login
					</button>
				</form>
				<div className="mt-6 text-center">
					<p className="text-white">
						Don't have an account? <Link to="/signup" className="text-blue-400 hover:text-blue-300">Register now</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
