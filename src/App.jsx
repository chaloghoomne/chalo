import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
	useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/actions/login-actions";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import SignUp from "./pages/Authentication/Signup";
import Login from "./pages/Authentication/Login";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import VisaTypes from "./pages/visa-types/VisaTypes";
import Packages from "./pages/packages/Packages";
import VisaDetails from "./pages/visa-details/VisaDetails";
import ImageUpload from "./pages/upload-image/ImageUpload";
import PersonDetails from "./pages/persons-details/PersonsDetails";
import OfferPackages from "./pages/offer-packages/OfferPackages";
import Profile from "./pages/profile-section/Profile";
import EditVisaDetails from "./pages/edit-visa-requests/EditVisaDetails";
import EditVisaDetailsv2 from "./pages/edit-visa-requests/EditVisaDetailsv2"
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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/dates/styles.css";
import ScrollToTop from "./pages/helper/ScrolltoTop";
import CartPage from "./pages/cart/CartPage";
import NotFound from "./pages/NotFound/NotFound";
import ServiceUnavailable from "./pages/NotFound/ServiceUnavailable";
import { MantineProvider } from "@mantine/core";
import { PrimeReactProvider } from "primereact/api";
import EditVisaDetailsv3 from "./pages/edit-visa-requests/EditVisaDetailsv3";

const useScrollToSection = () => {
	const location = useLocation();

	useEffect(() => {
		if (location.hash) {
			document
				.querySelector(location.hash)
				?.scrollIntoView({ behavior: "smooth" });
		} else if (location.state?.scrollTo) {
			document
				.querySelector(location.state.scrollTo)
				?.scrollIntoView({ behavior: "smooth" });
		}
	}, [location]);
};
const PrivateRoute = ({ children }) => {
	// Retrieve token from Redux or localStorage
	const token =
		useSelector((state) => state.LoginReducer?.token) ||
		localStorage.getItem("token") ||
		null;
	const countryId = useSelector((state) => state.CountryIdReducer?.countryId);
	const location = useLocation();

	// If token is missing, redirect to login
	if (!token) {
		return (
			<Navigate
				to="/login"
				state={{ from: location, countryId }}
				replace
			/>
		);
	}

	return children;
};

const AppContent = () => {
	useScrollToSection();
	const location = useLocation();
	const [pathName, setPathName] = useState(location.pathname);

	useEffect(() => {
		setPathName(location.pathname);
	}, [location]);

	const hideNavbarFooter = ["/login", "/signup", "/forgot-password"].includes(
		pathName
	);

	return (
		<div className="flex flex-col min-h-screen">
			{!hideNavbarFooter && <Navbar />}
			<div className="flex-grow">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
					<Route path="/visa-types/:slug" element={<VisaTypes />} />
					<Route path="/packages" element={<Packages />} />
					<Route path="/profile" element={<Profile />} />
					<Route
						path="/visa-details/:slug"
						element={<VisaDetails />}
					/>
					<Route path="/upload-image" element={<ImageUpload />} />
					<Route
						path="/persons-details"
						element={<PersonDetails />}
					/>
					<Route path="/offer-packages" element={<OfferPackages />} />
					<Route
						path="/edit-visa-request"
						element={
							<PrivateRoute>
								<EditVisaDetails />
							</PrivateRoute>
						}
					/>
					<Route
						path="/edit-visa-request-v2/:slug"
						element={
							<PrivateRoute>
								<EditVisaDetailsv2 />
							</PrivateRoute>
						}
					/>
					<Route
						path="/edit-visa-request-v3"
						element={
							<PrivateRoute>
								<EditVisaDetailsv3 />
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
						element={<PrivacyPolicyPage />}
					/>
					<Route
						path="/refund-policy"
						element={<RefundPolicyPage />}
					/>
					<Route
						path="/terms-condition"
						element={<TermsConditions />}
					/>
					<Route path="/blogs" element={<Blog />} />
					<Route path="/blog/:slug" element={<BlogDetails />} />
					<Route path="/about" element={<AboutUs />} />
					<Route path="/contact" element={<ContactUs />} />
					<Route path="/career-form" element={<CareerForm />} />
					<Route path="/travel-form" element={<TravelAgentForm />} />
					<Route path="/cart" element={<CartPage />} />
					<Route path="/503" element={<ServiceUnavailable />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
			{!hideNavbarFooter && <Footer />}
		</div>
	);
};

const App = ({ children }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) dispatch(login(token));
	}, [dispatch]);

	return (
		<PrimeReactProvider>
			<Router>
				<ScrollToTop />
				<AppContent />
				{children}
				<ToastContainer />
			</Router>
		</PrimeReactProvider>
	);
};

export default App;
