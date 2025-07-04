import { RiContactsLine } from "react-icons/ri";
import card from "../../assets/card.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Calendar from "./components/Calender";
import { RxCross1 } from "react-icons/rx";
import MonthCalender from "./components/MonthCalender";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { CiLocationOn } from "react-icons/ci";
import { MdChevronRight } from "react-icons/md";
import { numberofCoTravelers } from "./../../redux/actions/numberoftravelers-actions";
import {
	coTraveler,
	PackageId,
	setChildShowId,
	setVisaId,
} from "../../redux/actions/package-id-actions";

import DescriptionModal from "../home/components/DescriptionModal";
import { GoDotFill } from "react-icons/go";
import { CiWallet } from "react-icons/ci";
import ReturnCalender from "./components/ReturnCalendar";
import FAQs from "./components/Faqs";
import VisaProcessSteps from "./components/Steps";
import { Helmet } from "react-helmet";
import axios from "axios";
import { IoMdCart } from "react-icons/io";
import { addToCart } from "../../redux/reducers/cart-reducer";

const VisaDetails = () => {
	const { id } = useParams();

	const dispatch = useDispatch();
	const countryId = useSelector((state) => state.CountryIdReducer.countryId);
	const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
	const [selectedType, setSelectedType] = useState(null);
	const selectedCountry = useSelector(
		(state) => state.SelectedCountryReducer.selectedCountry
	);
	const returnDate = useSelector(
		(state) => state.ReturnCalenderReducer.returnDate
	);
	const [faqData, setfaqData] = useState([]);
	const fromDate = useSelector((state) => state.CalenderReducer.visaDate);
	const toDate = useSelector(
		(state) => state.ReturnCalenderReducer.returnDate
	);
	const visaType = useSelector((state) => state.GetVisaTypeReducer.visaType);

	const datePickerRef = useRef(null);
	const [numberOfTravelers, setNumberOfTravelers] = useState(1);
	const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
	const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
	const [isFlexibleModalOpen, setFlexibleModalOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [important, setImportantPoints] = useState();
	const [partners, setPartners] = useState([]);
	const [data, setData] = useState({});

	const [data1, setData1] = useState([]);
	const [activeTab, setActiveTab] = useState(1);

	const applyNowRef = useRef(null);
	const faqRef = useRef(null);
	const [isCardFixed, setIsCardFixed] = useState(false);
	const [isLargeScreen, setIsLargeScreen] = useState(false);

	const mainImageRef = useRef(null);
	const cardRef = useRef(null);
	const contentRef = useRef(null);
	const [metaData, setMetaData] = useState({
		metaTitle: "Chalo Ghoomne - Travel Blogs",
		metaDescription:
			"Explore exciting travel blogs and discover amazing destinations.",
		metaKeywords: "travel, adventure, tourism, destinations",
	});

	const cartItems = useSelector((state) => state.CartReducer.cartItems);

	// console.log(id)
	// console.log(fromDate, toDate);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
	};

	const handleAddToCart = async() => {
		const token = localStorage.getItem("token");
		if(!token) window.location.href = "/login";
		const cartItem = {
			id: data?._id || Math.random().toString(), // Ensure ID is unique
			name: selectedCountry || "Unknown",
			price: data?.price || 0,
			quantity: 1,
			image: data1?.image || "",
		};
		const response = await fetchDataFromAPI(
			"POST",
			`${BASE_URL}addToCart`,{data:data?._id},{
				headers: {
				  Authorization: "Bearer " + localStorage.getItem("token"),
				}
			}	
		)
		if(response.status ===200){window.location.href="/cart"}
		if (response.status === 503) {
			navigate("/503"); // Redirect to Service Unavailable page
		}

		// console.log("Adding to cart:", cartItem);
		// dispatch(addToCart(cartItem)); // Dispatch action
		window.location.href="/cart"
		toast.success("Visa added to cart!");
	};

	useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 1024);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	useEffect(() => {
		const fetchShowCoTraveler = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}place/${countryId}`
				);
				if (response.status === 503) {
					navigate("/503"); // Redirect to Service Unavailable page
				}

				if (response) {
					setfaqData(response?.data);
					// console.log(response)
				}
			} catch (error) {
				navigate("/503");
				console.log(error);
			}
		};

		fetchShowCoTraveler();
	}, [countryId]);

	const [cardPosition, setCardPosition] = useState({ top: 0, right: 0 });

	useEffect(() => {
		const checkScreenSize = () => {
			setIsLargeScreen(window.innerWidth >= 1024);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const footerRef = useRef(null);

	const handleScroll = useCallback(() => {
		if (
			!isLargeScreen ||
			!mainImageRef.current ||
			!cardRef.current ||
			!footerRef.current
		) {
			return;
		}

		const imageBottom = mainImageRef.current.getBoundingClientRect().bottom;
		const footerTop = footerRef.current.getBoundingClientRect().top;
		const cardHeight = cardRef.current.offsetHeight;
		const windowHeight = window.innerHeight;
		const cardBottom = cardHeight + 80; // 80px offset

		// Check if card would overlap footer
		const wouldOverlapFooter =
			windowHeight - footerTop + cardBottom > windowHeight;

		if (imageBottom <= 0 && !wouldOverlapFooter) {
			// Fix card position when scrolling past the main image
			const cardLeft = cardRef.current.getBoundingClientRect().left; // Fix left shift

			Object.assign(cardRef.current.style, {
				position: "fixed",
				top: "60px",
				left: `${cardLeft}px`, // Fixed left position
				width: "26rem",
				opacity: "1",
				visibility: "visible",
				transform: "translateX(0)", // Ensure no unexpected shift
			});
		} else if (wouldOverlapFooter) {
			// Hide card when overlapping footer
			Object.assign(cardRef.current.style, {
				opacity: "0",
				visibility: "hidden",
			});
		} else {
			// Reset to original position
			Object.assign(cardRef.current.style, {
				position: "relative",
				top: "20px",
				left: "0",
				width: "26rem",
				opacity: "1",
				visibility: "visible",
				transform: "translateX(0)", // Ensure no shift
			});
		}
	}, [isLargeScreen]);

	useEffect(() => {
		if (isLargeScreen) {
			window.addEventListener("scroll", handleScroll);
			handleScroll(); // Initial position check
		} else if (cardRef.current) {
			// Reset styles for mobile view
			Object.assign(cardRef.current.style, {
				position: "relative",
				top: "auto",
				left: "auto",
				width: "100%",
				opacity: "1",
				visibility: "visible",
			});
		}

		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLargeScreen, handleScroll]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}partners`
				);
				if (response.status === 503) {
					navigate("/503"); // Redirect to Service Unavailable page
				} else if (response) {
					setPartners(response.data);
				}
			} catch (error) {
				navigate("/503");
				console.log(error);
			}
		};
		fetchProfileImage();
	}, []);

	const handleApplicationType = (type, date) => {
		setSelectedType(type);
		// setIsReturnModalOpen(true);
		setCalendarModalOpen(true);
	};

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}notes`
				);
				if (response.status === 503) {
					navigate("/503"); // Redirect to Service Unavailable page
				}
				if (response) {
					const filtered = response?.data?.find(
						(item) => item.type === "Instructions"
					);

					setImportantPoints(filtered);
				}
			} catch (error) {
				navigate("/503");
				console.log(error);
			}
		};
		fetchProfileImage();
	}, []);

	const { slug } = useParams(); // Get slug from URL
	// console.log(slug);
	const Id = slug.split("-").pop(); // Extract the ID from "my-blog-title-65e1234abcd98765f4321abc"
	// console.log(Id)

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}visa-category/${Id}`
				);
				// console.log("response", response);
				if (response.status === 503) {
					navigate("/503"); // Redirect to Service Unavailable page
				} else if (response) {
					setData(response.data);
					dispatch(setChildShowId(Id));
				}
			} catch (error) {
				navigate("/503");
				console.log(error);
			}
			dispatch(setVisaId(Id));
		};
		fetchProfileImage();
	}, [Id]);

	useEffect(() => {
		dispatch(numberofCoTravelers(numberOfTravelers));
	}, [numberOfTravelers]);

	const handleStartApplication = async () => {
		// setApplicationModalOpen(true);
		setCalendarModalOpen(true);
	};

	// made because the images weren't loading on the order visa page
	useEffect(() => {
		// const id = data?._id;
		if (!selectedCountry) return;
		const fetchCountryImage = async () => {
			try {
				const response = await axios.post(`${BASE_URL}country-image`, {
					country: selectedCountry,
				});
				console.log(response);
				setData1(response?.data);
			} catch (error) {
				console.log(error);
			}
		};

		if (selectedCountry) {
			fetchCountryImage();
		}
	}, [selectedCountry]);

	useEffect(() => {
		if (faqData) {
			setMetaData({
				metaTitle: faqData.metaTitle || "Chalo Ghoomne - Travel Blogs",
				metaDescription:
					faqData.metaDescription ||
					"Explore exciting travel blogs and discover amazing destinations.",
				metaKeywords:
					faqData.metaKeywords?.join(", ") ||
					"travel, adventure, tourism, destinations",
			});
			// console.log("Updated Meta Data:", metaData);
		}
	}, [faqData]); // ✅ Runs when `blog` updates

	if (!faqData) return <div>Loading...</div>;

	const handleApplicationChoice = (choice) => {
		setApplicationModalOpen(false);
		if (choice === "yes") {
			navigate("/upload-image");
		} else {
			setCalendarModalOpen(true);
			navigate("/upload-image");
			datePickerRef.current.focus();
		}
	};

	const proceedFunc = async () => {
		// if (!returnDate) {
		//   // Show an error if return date is not selected
		//   alert("Please select a return date");
		//   return;
		// }
		setCalendarModalOpen(false);
		console.log(fromDate, toDate);
		const newDate = new Date(returnDate).toISOString();
		try {
			const response = await fetchDataFromAPI(
				"POST",
				`${BASE_URL}create-visa-order`,
				{
					user: localStorage.getItem("userId"),
					visaCategory: Id,
					travellersCount: numberOfTravelers,
					// from: new Date(data[`${selectedType}Date`]).toISOString(),
					// to: newDate,
					from: fromDate,
					to: toDate,
					applicationType: selectedType,
				}
			);

			if (response.status === 503) {
				navigate("/503"); // Redirect to Service Unavailable page
			}

			if (response) {
				dispatch(PackageId(response?.data?.visaOrder?._id));
				dispatch(numberofCoTravelers(numberOfTravelers));
				dispatch(coTraveler(response?.data?.orderDetails?._id));
			}
			setIsModalOpen(false);
			navigate("/persons-details");
		} catch (error) {
			navigate("/503");
			console.log(error);
		}
	};

	const proceedApplication = async () => {
		if (!fromDate || !toDate) {
			console.warn("Waiting for fromDate and toDate to be set...");
			return;
		}

		setCalendarModalOpen(false);

		console.log("Sending POST request with:", { fromDate, toDate });
		// localStorage.setItem("fromDate", fromDate);
		// localStorage.setItem("toDate", toDate);
		// console.log("Visa ki ID",id)
		try {
			console.log(fromDate, toDate);
			const response = await fetchDataFromAPI(
				"POST",
				`${BASE_URL}create-visa-order`,
				{

					user: localStorage.getItem("userId"),
					visaCategory: Id,
					travellersCount: numberOfTravelers,
					from: fromDate,
					to: toDate,
					applicationType: "normal",
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status === 503) {
				navigate("/503"); // Redirect to Service Unavailable page
			}
			// console.log("Dikkat kya hai",response)
			if (response) {
				dispatch(PackageId(response?.data?.visaOrder?._id));
				dispatch(numberofCoTravelers(numberOfTravelers));
				dispatch(coTraveler(response?.data?.orderDetails?._id));
			}
		} catch (error) {
			navigate("/503");
			console.log(error);
		}
		navigate("/persons-details");
	};
	useEffect(() => {
		if (fromDate && toDate) {
			console.log("Updated fromDate and toDate:", fromDate, toDate);
		}
	}, [fromDate, toDate]);

	// console.log("fromDate:", fromDate);
	// console.log("toDate:", toDate);

	const handleCalendarChoice = (choice) => {
		setCalendarModalOpen(false);
		if (choice === "fixed") {
			// Handle fixed date choice
			navigate("/upload-image");
		} else {
			setFlexibleModalOpen(true);
		}
	};

	const handleFlexibleChoice = () => {
		setFlexibleModalOpen(false);
		// Handle flexible date choice
		navigate("/persons-details");
	};

	const renderCalendar = () => {
		const days = [
			[1, 2, 3],
			[4, 5, 6, 7, 8, 9, 10],
			[11, 12, 13, 14, 15, 16, 17],
			[18, 19, 20, 21, 22, 23, 24],
			[25, 26, 27, 28, 29, 30, 31],
		];

		return days.map((week, weekIndex) => (
			<div key={weekIndex} className="flex">
				{week.map((day, dayIndex) => (
					<button
						key={dayIndex}
						className="w-10 h-10 text-center text-sm hover:bg-blue-100 focus:outline-none"
					>
						{day}
					</button>
				))}
			</div>
		));
	};

	console.log(data)

	const handletravelerNumber = (value) => {
		if (value === "sub") {
			if (numberOfTravelers > 1) {
				setNumberOfTravelers(numberOfTravelers - 1);
			} else {
				toast.error("Travelers are Not Less than One");
			}
		} else {
			if (numberOfTravelers < 100) {
				setNumberOfTravelers(numberOfTravelers + 1);
			} else {
				toast.error("Max Limit Fullfilled");
			}
		}
	};

	return (
		<div ref={contentRef} className="w-full h-full mx-auto container py-10">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{metaData.metaTitle}</title>

				<meta name="description" content={metaData.metaDescription} />
				<meta name="keywords" content={metaData.metaKeywords} />
				<link rel="canonical" href="https://chaloghoomne.com/" />
			</Helmet>
			{/* Main Image */}
			<div
				ref={mainImageRef}
				className="w-full relative mt-12 rounded-xl bg-cover flex h-[500px] justify-center items-center mb-5"
			>
				<div className="px-16 w-full relative ">
					<img
						src={data1?.image}
						alt={data.altImage || selectedCountry}
						className="w-full bg-cover   h-[450px] rounded-2xl"
					/>
					<div className="absolute lg:block hidden inset-0 left-28 -z-10 w-[85%] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-65"></div>
				</div>

				<div className=" absolute flex justify-center items-center gap-2 text-white font-medium text-xl top-12  left-24 bg-gray-900/20 rounded-xl px-4 py-2  ">
					<CiLocationOn size={22} color="white" /> {selectedCountry}
				</div>
			</div>
			{/* Apply Section */};
			<div className="w-full flex md:flex-row flex-col justify-between md:px-10 px-5 gap-8">
				<div ref={applyNowRef} className="mb-6 xl:w-[60%] w-full">
					<div className="space-y-4">
						<div className="mb-5">
							<h2 className="text-3xl font-bold">
								Apply now for guaranteed visa on{" "}
							</h2>
							<span className="text-blue-500 font-bold text-3xl">
								{new Date(
									new Date().setDate(new Date().getDate() + 5)
								)
									.toDateString()
									?.slice(4, 100)}
							</span>
						</div>

						{/* Visa Information Card */}
						<div className="w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mt-6">
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
								<h3 className="text-lg font-semibold text-gray-800">
									Visa Details
								</h3>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y text-center divide-gray-100">
								<div className="p-4 hover:bg-gray-50 transition-colors">
									<p className="text-xs uppercase font-semibold text-gray-500 mb-1">
										VISA TYPE
									</p>
									<p className="font-medium text-gray-800">
										{visaType || "N/A"}
									</p>
								</div>
								<div className="p-4 hover:bg-gray-50 transition-colors">
									<p className="text-xs uppercase font-semibold text-gray-500 mb-1">
										VALIDITY
									</p>
									<p className="font-medium text-gray-800">
										{data?.validity
											? data.validity
													.toLowerCase()
													.includes("hour")
												? data.validity
												: `${data.validity} Days`
											: "N/A"}
									</p>
								</div>
								{/* <div className="p-4 hover:bg-gray-50 transition-colors">
									<p className="text-xs uppercase font-semibold text-gray-500 mb-1">
										PROCESSING TIME
									</p>
									<p className="font-medium text-gray-800">
										{data?.processingTime
											? `${data.processingTime} Days`
											: "N/A"}
									</p>
								</div> */}
								<div className="p-4 hover:bg-gray-50 transition-colors">
									<p className="text-xs uppercase font-semibold text-gray-500 mb-1">
										STAY
									</p>
									<p className="font-medium text-gray-800">
										{data?.period
											? `${data.period} Days`
											: "N/A"}
									</p>
								</div>
								<div className="p-4 hover:bg-gray-50 transition-colors md:col-span-2">
									<p className="text-xs uppercase font-semibold text-gray-500 mb-1">
										ENTRY TYPE
									</p>
									<p className="font-medium text-gray-800">
										{data?.entryType || "N/A"}
									</p>
								</div>
							</div>
						</div>

						{/* Description */}
						<div className="bg-gradient-to-r rounded-xl p-6 shadow-md mt-6">
							<h3 className="text-lg font-semibold  text-gray-800 mb-3">
								Required Documents for {selectedCountry} visa
							</h3>
							<div className="  text-gray-600">
								{/* {data?.longDescription ||
									"No description available."} */}
								<div
									dangerouslySetInnerHTML={{
										__html: data?.longDescription,
									}}
									className="prose-sm leading-none max-w-none"
								></div>
							</div>
						</div>
						<div className="flex flex-wrap gap-6">
						{data?.instantHeading && data?.instantPrice && (
						<button
							onClick={() => handleApplicationType("instant", data?.instantDate)}
							className="group bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] md:min-w-[60%] w-full text-white p-5 relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
						>
							{/* Animated background elements */}
							<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
							<div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
							<div className="absolute right-1/3 bottom-0 w-16 h-16 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
							</div>

							{/* Hot tag */}
							<div className="absolute -right-8 -top-8 rotate-45 transform translate-x-2 translate-y-10 bg-yellow-500 text-xs font-bold text-white py-1 px-10 shadow-md">
							POPULAR
							</div>

							<div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
							<div className="flex flex-col self-start">
								<div className="flex items-center mb-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
									clipRule="evenodd"
									/>
								</svg>
								<span className="text-sm font-medium uppercase tracking-wider">Instant Processing</span>
								</div>
								<span className="text-2xl font-bold text-start">{data?.instantHeading}</span>
								<span className="text-xl font-medium text-start flex items-center mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
									/>
								</svg>
								Visa on {new Date(Date.now() + parseInt(data.instantDays) * 86400000).toDateString()}
								</span>
							</div>

							<div className="bg-white text-start md:min-w-56 text-gray-700 p-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 w-full md:w-auto">
								<div className="flex items-center justify-between">
								<span className="font-medium text-[#3180CA]">Chalo Ghoomne Instant</span>
								<div className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded">FAST</div>
								</div>
								<p className="text-start font-bold text-2xl mt-1">₹{data?.instantPrice}</p>
								<div className="flex items-center mt-1 text-sm text-gray-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1 text-green-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
									/>
								</svg>
								Quick processing
								</div>
								<div className="absolute right-3 bottom-3 bg-[#3180CA] text-white p-2 rounded-full group-hover:bg-[#7AC7F9] transition-colors duration-300">
								<MdChevronRight size={20} />
								</div>
							</div>
							</div>
						</button>
						)}

						{data?.expressPrice && data?.expressHeading && (
						<button
							onClick={() => handleApplicationType("express", data?.expressDate)}
							className="group bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] md:min-w-[60%] w-full text-white p-5 relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
						>
							{/* Animated background elements */}
							<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
							<div className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
							<div className="absolute left-1/3 bottom-0 w-16 h-16 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
							</div>

							<div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
							<div className="flex flex-col self-start">
								<div className="flex items-center mb-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
									clipRule="evenodd"
									/>
								</svg>
								<span className="text-sm font-medium uppercase tracking-wider">Express Service</span>
								</div>
								<span className="text-2xl font-bold text-start">{data?.expressHeading}</span>
								<span className="text-xl font-medium text-start flex items-center mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clipRule="evenodd"
									/>
								</svg>
							
  Visa on {new Date(Date.now() + parseInt(data.expressDays) * 86400000).toDateString()}


								</span>
							</div>

							<div className="bg-white text-start md:min-w-56 text-gray-700 p-3 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 w-full md:w-auto">
								<div className="flex items-center justify-between">
								<span className="font-medium text-[#3180CA]">Chalo Ghoomne Express</span>
								<div className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded">EXPRESS</div>
								</div>
								<p className="text-start font-bold text-2xl mt-1">₹{data?.expressPrice}</p>
								<div className="flex items-center mt-1 text-sm text-gray-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-1 text-green-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
									fillRule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clipRule="evenodd"
									/>
								</svg>
								Standard processing
								</div>
								<div className="absolute right-3 bottom-3 bg-[#3180CA] text-white p-2 rounded-full group-hover:bg-[#7AC7F9] transition-colors duration-300">
								<MdChevronRight size={20} />
								</div>
							</div>
							</div>
						</button>
						)}
					</div>

						{/* Important Information */}
						<div className="bg-white rounded-xl shadow-md overflow-hidden mt-6">
							<div className="p-6">
								<div className="md:max-h-72 md:overflow-auto">
									<p
										style={{ overflowWrap: "anywhere" }}
										className="poppins-four text-sm text-gray-600"
									>
										{important?.description}
									</p>
									{important?.heading && (
										<p className="text-blue-600 font-medium text-md my-4">
											{important?.heading}
										</p>
									)}

									<ul className="space-y-2 mt-4">
										{important?.points?.map(
											(item, index) => {
												const pointsArray = item
													.split(",")
													.map((point) =>
														point.trim()
													);
												return (
													<React.Fragment key={index}>
														{pointsArray?.map(
															(
																point,
																pointIndex
															) => (
																<li
																	key={
																		pointIndex
																	}
																	className="flex items-start gap-2 text-gray-600 text-sm"
																>
																	<GoDotFill
																		className="mt-1 flex-shrink-0"
																		color="#4B5563"
																		size={8}
																	/>
																	<span>
																		{point}
																	</span>
																</li>
															)
														)}
													</React.Fragment>
												);
											}
										)}
									</ul>
								</div>
								<VisaProcessSteps country={selectedCountry} />
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Application Card */}
				<div className="w-full  xl:w-[40%] lg:px-4 relative h-[65%] md:h-[75%] ">
					<div
						ref={cardRef}
						className="w-full bg-white shadow-lg rounded-xl overflow-hidden lg: mb-10 sticky top-24"
					>
						{/* Improved Tab Navigation */}
						{data?.expressPrice && data?.expressHeading && (
							<div className="flex px-4 pt-3 gap-1.5">
								<button
									onClick={() => handleTabChange(1)}
									className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
										activeTab === 1
											? "bg-blue-500 text-white shadow-md"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									} rounded-t-lg`}
								>
									Standard Visa
								</button>

								<button
									onClick={() => handleTabChange(2)}
									className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
										activeTab === 2
											? "bg-blue-700 text-white shadow-md"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									} rounded-t-lg`}
								>
									Express Visa
								</button>
							</div>
						)}

						{/* Card Header */}
						<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white">
							<h2 className="text-lg font-semibold">
								Visa Application
							</h2>
							<p className="text-blue-100 text-xs">
								Complete your application in minutes
							</p>
						</div>

						{/* Conditional Content Based on Tab */}
						{activeTab === 1 ? (
							<>
								{/* Travellers Section */}
								<div className="p-4 border-b border-gray-200">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<RiContactsLine
												size={20}
												className="text-blue-600"
											/>
											<h3 className="text-base font-semibold text-gray-800">
												Travellers
											</h3>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													handletravelerNumber("sub")
												}
												className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
												aria-label="Decrease traveler count"
											>
												<span className="text-base font-medium text-gray-700">
													-
												</span>
											</button>
											<span className="text-base font-medium w-6 text-center">
												{numberOfTravelers}
											</span>
											<button
												onClick={() =>
													handletravelerNumber("add")
												}
												className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
												aria-label="Increase traveler count"
											>
												<span className="text-base font-medium text-gray-700">
													+
												</span>
											</button>
										</div>
									</div>
								</div>

								{/* Price Section */}
								<div className="p-4 border-b border-gray-200">
									<h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
										<CiWallet
											size={18}
											className="text-blue-600"
										/>
										Price Details
									</h3>
									<div className="space-y-3 bg-gray-50 p-3 rounded-lg">
										<div className="flex justify-between items-center text-sm">
											<span className="text-gray-600">
												VISA Fees
											</span>
											<span className="font-medium">
												₹{data?.price || 0} x{" "}
												{numberOfTravelers}
											</span>
										</div>

										<div className="pt-2 border-t border-dashed border-gray-300">
											<div className="flex justify-between items-center">
												<h4 className="text-sm font-semibold text-gray-800">
													Total Amount
												</h4>
												<p className="text-base font-semibold text-blue-600">
													₹
													{(data?.price || 0) *
														numberOfTravelers}
												</p>
											</div>
										</div>
									</div>
								</div>

								{/* Visa Summary */}
								<div className="p-4 bg-white border-b border-gray-200">
									<h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3.5 w-3.5 text-blue-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Visa Summary
									</h3>
									<div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
										<div className="bg-white p-2 rounded-md shadow-sm">
											<p className="text-gray-500 mb-0.5 text-xs">
												Type
											</p>
											<p className="font-medium text-gray-800">
												{visaType || "N/A"}
											</p>
										</div>
										{/* <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-gray-500 mb-1 text-xs">Validity</p>
                  <p className="font-medium text-gray-800">{data?.validity ? `${data.validity} Days` : "N/A"}</p>
                </div> */}
										<div className="bg-white p-2 rounded-md shadow-sm">
											<p className="text-gray-500 mb-0.5 text-xs">
												Processing
											</p>
											<p className="font-medium text-gray-800">
												{data?.processingTime
													? `${data.processingTime} Days`
													: "N/A"}
											</p>
										</div>
										{/* <div className="bg-white p-3 rounded-md shadow-sm">
                  <p className="text-gray-500 mb-1 text-xs">Stay Period</p>
                  <p className="font-medium text-gray-800">{data?.period ? `${data.period} Days` : "N/A"}</p>
                </div> */}
									</div>
								</div>

								{/* Action Buttons */}
								<div className="p-4 flex items-center gap-2">
									<button
										onClick={handleStartApplication}
										className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
										Start Application
									</button>
									<button
										onClick={handleAddToCart}
										className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors shadow-sm hover:shadow"
										aria-label="Add to cart"
									>
										<IoMdCart className="text-xl text-red-500" />
									</button>
								</div>
							</>
						) : (
							<>
								<div>
									{/* {data?.expressPrice && data?.expressHeading && (
                <button
                  onClick={() => handleApplicationType("express", data?.expressDate)}
                  className="w-full bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow flex justify-between items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-2xl poppins-five text-start font-semibold">{data?.expressHeading} </span>
                    <span className="text-xl poppins-five text-start mt-1">Visa on {data?.expressDate} </span>
                  </div>
                  <span className="bg-white relative text-start md:pl-4 md:min-w-56 text-sm md:relative md:top-0 text-gray-600 p-3 rounded-lg shadow-sm">
                    <span className="font-medium">Chalo Ghoomne Express</span>
                    <p className="text-start text-lg font-bold text-blue-600 mt-1">₹{data?.expressPrice}</p>
                    <div className="absolute hidden md:block top-1/2 right-3 transform -translate-y-1/2">
                      <MdChevronRight size={22} color="#3180CA" />
                    </div>
                  </span>
                </button>
              )} */}

									<div className="p-4 border-b border-gray-200">
										<div className="flex justify-between items-center">
											<div className="flex items-center gap-2">
												<RiContactsLine
													size={20}
													className="text-blue-600"
												/>
												<h3 className="text-base font-semibold text-gray-800">
													Travellers
												</h3>
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={() =>
														handletravelerNumber(
															"sub"
														)
													}
													className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
													aria-label="Decrease traveler count"
												>
													<span className="text-base font-medium text-gray-700">
														-
													</span>
												</button>
												<span className="text-base font-medium w-6 text-center">
													{numberOfTravelers}
												</span>
												<button
													onClick={() =>
														handletravelerNumber(
															"add"
														)
													}
													className="bg-gray-100 hover:bg-gray-200 border border-gray-300 h-7 w-7 rounded-full flex items-center justify-center transition-colors"
													aria-label="Increase traveler count"
												>
													<span className="text-base font-medium text-gray-700">
														+
													</span>
												</button>
											</div>
										</div>
									</div>

									{/* Express Price Details */}
									<div className="p-4 border-b border-gray-200">
										<h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
											<CiWallet
												size={18}
												className="text-blue-600"
											/>
											Express Price Details
										</h3>
										<div className="space-y-3 bg-gray-50 p-3 rounded-lg">
											<div className="flex justify-between items-center text-sm">
												<span className="text-gray-600">
													Express VISA Fees
												</span>
												<span className="font-medium">
													₹{data?.expressPrice || 0} x{" "}
													{numberOfTravelers}
												</span>
											</div>

											<div className="pt-2 border-t border-dashed border-gray-300">
												<div className="flex justify-between items-center">
													<h4 className="text-sm font-semibold text-gray-800">
														Total Amount
													</h4>
													<p className="text-base font-semibold text-blue-600">
														₹
														{(data?.expressPrice ||
															0) *
															numberOfTravelers}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Express Visa Summary */}
									<div className="p-4 bg-white border-b border-gray-200">
										<h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1.5">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-3.5 w-3.5 text-blue-600"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											Express Visa Summary
										</h3>
										<div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-lg">
											<div className="bg-white p-2 rounded-md shadow-sm">
												<p className="text-gray-500 mb-0.5 text-xs">
													Type
												</p>
												<p className="font-medium text-gray-800">
													Express {visaType}
												</p>
											</div>
											<div className="bg-white p-2 rounded-md shadow-sm">
												<p className="text-gray-500 mb-0.5 text-xs">
													Processing
												</p>
												<p className="font-medium text-gray-800">
													{data?.expressDays +
														" " +
														"Days" || "24 Hours"}
												</p>
											</div>
										</div>
									</div>

									{/* Express Action Buttons */}
									<div className="p-4 flex items-center gap-2">
										<button
											onClick={() =>
												handleApplicationType(
													"express",
													data?.expressDate
												)
											}
											className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
											Start Application
										</button>
										<button
											onClick={handleAddToCart}
											className="bg-gray-100 hover:bg-gray-200 p-2.5 rounded-lg transition-colors shadow-sm hover:shadow"
											aria-label="Add to cart"
										>
											<IoMdCart className="text-xl text-red-500" />
										</button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="md:w-[60%] w-full">
				<FAQs ref={faqRef} data={faqData?.faq} />
			</div>
			{/* Partners Section */}
			{/* <div className="w-full md:w-[60%] p-6 ml-[8px]">
				<h2 className="text-3xl font-bold  mb-6">
					Partners we work with
				</h2>
				<div className="overflow-x-auto">
					<div className="flex space-x-4 py-5">
						{partners?.map((partner, index) => {
							return (
								<Link
									key={index}
									to={`${partner?.link}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									{" "}
									<div className="min-w-[200px] drop-shadow-lg max-w-[300px] bg-white p-4 rounded-lg border shadow-md">
										<img
											src={partner?.image}
											alt="India"
											className="w-full h-[160px] bg-cover rounded-lg mb-2"
										/>
										<div className="h-[50px] overflow-scroll">
											<p
												style={{
													overflowWrap: "anywhere",
												}}
												className="font-semibold max-w-[200px]"
											>
												{partner?.heading}
											</p>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</div> */}
			<div ref={footerRef}>{/* Your footer content */}</div>
			{isApplicationModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
						<h2 className="text-xl font-bold mb-4">
							Start Application
						</h2>
						<p className="mb-4">
							Do you want to proceed with your application?
						</p>
						<div className="flex justify-end space-x-4">
							<button
								className="bg-gray-200 py-2 px-4 rounded-lg"
								onClick={() => handleApplicationChoice("no")}
							>
								No
							</button>
							<button
								className="bg-blue-500 text-white py-2 px-4 rounded-lg"
								onClick={() => handleApplicationChoice("yes")}
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			)}
			{/* Calendar Modal */}
			{isCalendarModalOpen && (
				<div className="fixed inset-0 flex z-50 rounded-lg  justify-center bg-black bg-opacity-50">
					<div className="bg-white relative m-4 mt-5 max-h-[600px] overflow-visible rounded-lg shadow-lg w-full max-w-md">
						<div className="  flex justify-center">
							<MonthCalender
								onClose={
									!selectedType
										? proceedApplication
										: proceedFunc
								}
							/>
						</div>
						<button
							onClick={() => setCalendarModalOpen(false)}
							className="absolute right-2 top-3 text-2xl rounded-full p-1 font-extrabold bg-white hover:bg-gray-200"
						>
							<RxCross1 size={20} color="black" />
						</button>
					</div>
				</div>
			)}
			{/* Flexible Modal */}
			{isFlexibleModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
						<h2 className="text-xl font-bold mb-4">Select Month</h2>
						<div className="mb-4">
							<div className="flex justify-around">
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									January
								</button>
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									February
								</button>
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									March
								</button>
							</div>
							<div className="flex justify-around mt-2">
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									April
								</button>
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									May
								</button>
								<button className="bg-gray-200 py-2 px-4 rounded-lg">
									June
								</button>
							</div>
						</div>
						<button
							className="bg-blue-500 text-white py-2 px-4 rounded-full w-full"
							onClick={handleFlexibleChoice}
						>
							Continue
						</button>
					</div>
				</div>
			)}
			{isReturnModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center">
					<div className="bg-white cursor-pointer relative p-6 rounded-lg">
						<div
							onClick={() => setIsReturnModalOpen(false)}
							className=" py-2"
						>
							❌
						</div>
						<h2 className="text-xl mb-4">Select Return Date</h2>

						<ReturnCalender />
						<button
							onClick={proceedFunc}
							className="w-full bg-blue-500 text-white py-2 rounded mt-4"
						>
							Proceed to Application
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default VisaDetails;
