import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useLocation,
} from "react-router-dom";

import Home from "./pages/home/Home";
import SignUp from "./pages/Authentication/Signup";
import Login from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import VisaTypes from "./pages/visa-types/VisaTypes";
import Packages from "./pages/packages/Packages";
import VisaDetails from "./pages/visa-details/VisaDetails";
import ImageUpload from "./pages/upload-image/ImageUpload";
import PersonDetails from "./pages/persons-details/PersonsDetails";
import OfferPackages from "./pages/offer-packages/OfferPackages";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login } from "./redux/actions/login-actions";
import Profile from "./pages/profile-section/Profile";
import ScrollToTop from "./pages/helper/ScrolltoTop";
import EditVisaDetails from "./pages/edit-visa-requests/EditVisaDetails";
import ViewApplication from "./pages/profile-section/components/ViewApplication";
import RefundPolicyPage from "./pages/policies/Refund";
import PrivacyPolicyPage from "./pages/policies/Privacy";
import Blog from "./pages/blogs/Blogs";
import BlogDetails from "./pages/blogs/BlogDetails";
import AboutUs from "./pages/our-details/About";
import ContactUs from "./pages/our-details/Contact";
import CareerForm from "./pages/forms/CareerForm";
import TravelAgentForm from "./pages/forms/TravelAgentForm";
import TermsConditions from "./pages/policies/TermsConditions";

const PrivateRoute = ({ children }) => {
	const token = localStorage.getItem("token");
	const countryId = useSelector((state) => state.CountryIdReducer.countryId);
	const location = useLocation();

	const useScrollToSection = () => {
		const location = useLocation();

		useEffect(() => {
			// Check if there's a hash in the URL
			if (location.hash) {
				const targetElement = document.querySelector(location.hash);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: "smooth" });
				}
			} else if (location.state?.scrollTo) {
				// Check for scrollTo in location state
				const targetElement = document.querySelector(
					location.state.scrollTo
				);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: "smooth" });
				}
			}
		}, [location]);
	};

	useScrollToSection();

	return token ? (
		children
	) : (
		<Navigate
			to="/login"
			state={{ from: location, countryId: countryId }}
			replace
		/>
	);
};

const AppContent = () => {
	const location = useLocation();
	const [pathName, setPathName] = useState(location.pathname);

	useEffect(() => {
		setPathName(location.pathname);
	}, [location]);

	return (
		<div className="flex flex-col min-h-screen">
			{!(
				pathName === "/login" ||
				pathName === "/signup" ||
				pathName === "/forgot-password"
			) && <Navbar />}
			<div className="flex-grow">
				<Routes>
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
					<Route path="/" element={<Home />} />
					<Route path="/visa-types/:id" element={<VisaTypes />} />
					<Route path="/packages" element={<Packages />} />
					<Route path="/profile" element={<Profile />} />
					<Route
						path="/visa-details/:id"
						element={
							<PrivateRoute>
								<VisaDetails />
							</PrivateRoute>
						}
					/>
					<Route
						path="/upload-image"
						element={
							<PrivateRoute>
								<ImageUpload />
							</PrivateRoute>
						}
					/>
					<Route
						path="/persons-details"
						element={
							<PrivateRoute>
								<PersonDetails />
							</PrivateRoute>
						}
					/>
					<Route
						path="/offer-packages"
						element={
							<PrivateRoute>
								<OfferPackages />
							</PrivateRoute>
						}
					/>
					<Route
						path="/edit-visa-request"
						element={
							<PrivateRoute>
								<EditVisaDetails />
							</PrivateRoute>
						}
					/>
					<Route
						path="/view-application"
						element={
							<PrivateRoute>
								<ViewApplication />
							</PrivateRoute>
						}
					/>
					<Route
						path="/privacy-policy"
						element={
							// <PrivateRoute>
							<PrivacyPolicyPage />
							// </PrivateRoute>
						}
					/>
					<Route
						path="/refund-policy"
						element={
							// <PrivateRoute>
							<RefundPolicyPage />
							// </PrivateRoute>
						}
					/>
					<Route
						path="/terms-condition"
						element={
							// <PrivateRoute>
							<TermsConditions />
							// </PrivateRoute>
						}
					/>
					<Route
						path="/blogs"
						element={
							<PrivateRoute>
								<Blog />
							</PrivateRoute>
						}
					/>
					<Route
						path="/blog/:id"
						element={
							<PrivateRoute>
								<BlogDetails />
							</PrivateRoute>
						}
					/>
					<Route path="/about" element={<AboutUs />} />
					<Route path="/contact" element={<ContactUs />} />
					<Route path="/career-form" element={<CareerForm />} />
					<Route path="/travel-form" element={<TravelAgentForm />} />
				</Routes>
			</div>
			{!(
				pathName === "/login" ||
				pathName === "/signup" ||
				pathName === "/forgot-password"
			) && <Footer />}
		</div>
	);
};

const App = () => {
	const dispatch = useDispatch();
	const isLogin = useSelector((state) => state.LoginReducer.isLogin);
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		document.body.appendChild(script);
	}, []);

	return (
		<>
			<Router>
				<ScrollToTop />
				<AppContent />
			</Router>
			<ToastContainer />
		</>
	);
};

export default App;
