import { RiContactsLine } from "react-icons/ri";
import card from "../../assets/card.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useRef, useState } from "react";
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

	const applyNowRef = useRef(null);
	const faqRef = useRef(null);
	const [isCardFixed, setIsCardFixed] = useState(false);
	const [isLargeScreen, setIsLargeScreen] = useState(false);

	const mainImageRef = useRef(null);
	const cardRef = useRef(null);
	const contentRef = useRef(null);


  const cartItems = useSelector((state) => state.CartReducer.cartItems);

  const handleAddToCart = () => {
    const cartItem = {
      id: data?._id || Math.random().toString(), // Ensure ID is unique
      name: selectedCountry || "Unknown",
      price: data?.price || 0,
      quantity: 1,
      image: data1?.image || "",
    };

    // console.log("Adding to cart:", cartItem);
    dispatch(addToCart(cartItem)); // Dispatch action
  

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

				if (response) {
					setfaqData(response?.data);
				}
			} catch (error) {
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

	useEffect(() => {
		const handleScroll = () => {
			if (
				!isLargeScreen ||
				!mainImageRef.current ||
				!cardRef.current ||
				!footerRef.current
			)
				return;

			const imageBottom =
				mainImageRef.current.getBoundingClientRect().bottom;
			const footerTop = footerRef.current.getBoundingClientRect().top;
			const cardHeight = cardRef.current.offsetHeight;
			const windowHeight = window.innerHeight;
			const cardBottom = cardHeight + 80; // 80px is the top offset we're using

			// Calculate when card would overlap footer
			const wouldOverlapFooter =
				windowHeight - footerTop + cardBottom > windowHeight;

			// If we've scrolled past the main image but not into footer territory
			if (imageBottom <= 0 && !wouldOverlapFooter) {
				cardRef.current.style.position = "fixed";
				cardRef.current.style.top = "60px";
				cardRef.current.style.right = "47px";
				cardRef.current.style.left =
					"${card.getBoundingClientRect().left}px";
				cardRef.current.style.width = "26rem";
				cardRef.current.style.opacity = "1";
				cardRef.current.style.visibility = "visible";
			} else if (wouldOverlapFooter) {
				// Hide card when it would overlap footer
				cardRef.current.style.opacity = "0";
				cardRef.current.style.visibility = "hidden";
			} else {
				// Reset to original position when above the image
				cardRef.current.style.position = "relative";
				cardRef.current.style.top = "20px";
				cardRef.current.style.right = "-80px";
				cardRef.current.style.width = "26rem";
				cardRef.current.style.opacity = "1";
				cardRef.current.style.visibility = "visible";
			}
		};

		if (isLargeScreen) {
			window.addEventListener("scroll", handleScroll);
			handleScroll(); // Initial position check
		} else {
			// Reset styles for mobile view
			if (cardRef.current) {
				cardRef.current.style.position = "relative";
				cardRef.current.style.top = "auto";
				cardRef.current.style.right = "auto";
				cardRef.current.style.width = "100%";
				cardRef.current.style.opacity = "1";
				cardRef.current.style.visibility = "visible";
			}
		}

		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLargeScreen]);

	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}partners`
				);
				if (response) {
					setPartners(response.data);
				} 
			} catch (error) {
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
				if (response) {
					const filtered = response?.data?.find(
						(item) => item.type === "Instructions"
					);

					setImportantPoints(filtered);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchProfileImage();
	}, []);

	useEffect(() => {
		const fetchProfileImage = async () => {
			try {
				const response = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}visa-category/${id}`
				);
				// console.log("response", response);
				if (response) {
					setData(response.data);
					dispatch(setChildShowId(id));
				}
			} catch (error) {
				console.log(error);
			}
			dispatch(setVisaId(id));
		};
		fetchProfileImage();
	}, [id]);

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
		const newDate = new Date(returnDate).toISOString();
		try {
			const response = await fetchDataFromAPI(
				"POST",
				`${BASE_URL}create-visa-order`,
				{
					visaCategory: id,
					travellersCount: numberOfTravelers,
					// from: new Date(data[`${selectedType}Date`]).toISOString(),
					// to: newDate,
					from: fromDate,
					to: toDate,
					applicationType: selectedType,
				}
			);

			if (response) {
				dispatch(PackageId(response?.data?.visaOrder?._id));
				dispatch(numberofCoTravelers(numberOfTravelers));
				dispatch(coTraveler(response?.data?.orderDetails?._id));
			}
			setIsModalOpen(false);
			navigate("/persons-details");
		} catch (error) {
			console.log(error);
		}
	};

	const proceedApplication = async () => {
		setCalendarModalOpen(false);
		// localStorage.setItem("fromDate", fromDate);
		// localStorage.setItem("toDate", toDate);
		// console.log("Visa ki ID",id)
		try {
			const response = await fetchDataFromAPI(
				"POST",
				`${BASE_URL}create-visa-order`,
				{
					visaCategory: id,
					travellersCount: numberOfTravelers,
					from: fromDate,
					to: toDate,
					applicationType: "normal",
				}, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
						"Content-Type": "application/json",
					},
				}
			);
			// console.log("Dikkat kya hai",response)
			if (response) {
				dispatch(PackageId(response?.data?.visaOrder?._id));
				dispatch(numberofCoTravelers(numberOfTravelers));
				dispatch(coTraveler(response?.data?.orderDetails?._id));
			}
		} catch (error) {
			console.log(error);
		}
		navigate("/persons-details");
	};

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
				<title>Chalo Ghoomne</title>
				<link
					rel="canonical"
					href="https://chaloghoomne2.vercel.app/"
				/>
			</Helmet>
			{/* Main Image */}
			<div
				ref={mainImageRef}
				className="w-full relative mt-12 rounded-xl bg-cover flex h-[500px] justify-center items-center mb-10"
			>
				<div className="px-16 w-full relative ">
					<img
						src={data1?.image}
						alt={selectedCountry}
						className="w-full bg-cover   h-[450px] rounded-2xl"
					/>
					<div className="absolute lg:block hidden inset-0 left-28 -z-10 w-[85%] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-65"></div>
				</div>
				<div className=" absolute flex justify-center items-center gap-2 text-white font-medium text-xl top-12  left-24 bg-gray-900/20 rounded-xl px-4 py-2  ">
					<CiLocationOn size={22} color="white" /> {selectedCountry}
				</div>
			</div>

			{/* Apply Section */}

			<div className="w-full flex md:flex-row flex-col justify-between  md:px-10 px-5  ">
				<div ref={applyNowRef} className="mb-6 md:w-[50%] ml-6 w-full">
					<h2 className="text-3xl font-bold mt-3 mb-2">
						Apply now for guaranteed visa on{" "}
					</h2>
					<span className="text-blue-500 font-bold text-3xl">
						{new Date().toDateString()?.slice(4, 100)}
					</span>

					<div className="mb-6 w-full">
						<div className="md:w-[85%] w-80 bg-white rounded-lg  py-4">
							<div className="mb-4 md:max-h-72 md:overflow-auto">
								<p
									style={{ overflowWrap: "anywhere" }}
									className="poppins-four text-sm md:max-h-56 md:overflow-auto "
								>
									{important?.description}
								</p>
								<p className="text-blue-500 poppins-five text-md my-2 mt-8 cursor-pointer mb-2">
									{important?.heading}
								</p>

								<ul className="text-left space-y-1">
									{important?.points?.map((item, index) => {
										const pointsArray = item
											.split(",")
											.map((point) => point.trim());
										return (
											<React.Fragment key={index}>
												{pointsArray?.map(
													(point, pointIndex) => (
														<p
															key={pointIndex}
															className="flex justify-start gap-2 items-center text-gray-400 poppins-four text-sm"
														>
															<GoDotFill
																color="black"
																size={5}
															/>
															{point}
														</p>
													)
												)}
											</React.Fragment>
										);
									})}
								</ul>
							</div>
							<VisaProcessSteps country={selectedCountry} />
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 h-[20%]">
					<Link onClick={handleAddToCart} className="flex items-center gap-4">
						<IoMdCart className="text-6xl" />
						<h3 className="text-lg font-semibold">Add to Cart</h3>
					</Link>
				</div>
				<div className=" md:w-[50%] md:px-10 relative w-full ">
					<div 
						ref={cardRef}
						style={{
							backgroundImage: `url(${card})`,
							// transition: 'all 0.3s ease-in-out'
						}}
						className="w-full bg-cover z-30 pb-16 mx-20 mt-7 bg-transparent md:p-10 p-6"
					>
						<div className="flex justify-between px-5 items-center  mb-4">
							<h2 className="text-2xl  flex flex-row poppins-six relative top-5 font-semibold ">
								Travellers
								<RiContactsLine
									size={30}
									style={{ fontWeight: "bold" }}
								/>
							</h2>
							<div className="flex items-center relative top-5 space-x-2 p-b8">
								<button
									onClick={() => handletravelerNumber("sub")}
									className="bg-white border border-black  text-lg flex cursor-pointer justify-center items-center w-4 h-4 rounded-full"
								>
									-
								</button>
								<span className="text-lg poppins-six">
									{numberOfTravelers}
								</span>
								<button
									onClick={() => handletravelerNumber("add")}
									className="bg-white border border-black text-lg flex justify-center items-center  w-4 h-4 rounded-full"
								>
									+
								</button>
							</div>
						</div>
						<div className="w-full px-5 rounded-xl  relative top-3 border-gray-400 border-dashed border-[1px] "></div>
						{/* <hr className="border-black " /> */}
						<div className="mb-4 pt-3 px-5">
							<h3 className="text-xl poppins-six relative top-3 font-semibold">
								Price
							</h3>
							<div className="flex justify-between items-center">
								<span className="relative gap-2 flex text-sm poppins-six justify-center items-center top-4">
									<CiWallet size={15} /> VISA Fees
								</span>
								<span className="relative poppins-five top-4">
									₹{data?.price} x {numberOfTravelers}
								</span>
							</div>
						</div>

						<div className="mb-4 px-10 relative top-3 ">
							<div
								style={{}}
								className="flex w-full flex-wrap gap-3 justify-between "
							>
								<div className="text-center">
									<p className="font-semibold poppins-six text-[12px]">
										VISA TYPE
									</p>
									<p className="text-xs text-start">
										{visaType}
									</p>
								</div>
								<div className="text-center">
									<p className="font-semibold poppins-six text-[12px]">
										VALIDITY
									</p>
									<p className="text-xs text-start">
										{data?.validity}
									</p>
								</div>
								<div className="text-center">
									<p className="font-semibold poppins-six text-[12px]">
										PROCESSING TIME
									</p>
									<p className="text-xs text-start">
										{data?.processingTime}
									</p>
								</div>
								<div className="flex flex-row gap-16 justify-between">
									<div className="">
										<p className="font-semibold poppins-six text-[12px]">
											STAY
										</p>
										<p className="text-xs text-start">
											{data?.period}
										</p>
									</div>
									<div>
										<p className="poppins-six text-[12px] font-semibold">
											ENTRY TYPE
										</p>
										<p className="text-xs text-start">
											{data?.entryType}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mb-[6px] flex  px-5 justify-between w-full">
							<h3 className="text-xl poppins-six font-medium ">
								Total Amount
							</h3>
							<p className="text-xl poppins-six font-medium ">
								₹{data?.price * numberOfTravelers}
							</p>
						</div>
						<div className="w-full px-5 rounded-xl  relative top-3 border-gray-400 border-dashed border-[1px] "></div>
						{/* <div className="w-full border-dashed border px-5  my-2 border-black"></div> */}
						<div className="flex justify-center items-center">
							<button
								onClick={handleStartApplication}
								className="bg-gradient-to-r mt-[10px] relative cursor-pointer top-2 from-[#3180CA] to-[#7AC7F9] text-white py-3 px-4 rounded-full text-2xl poppins-six w-[80%]"
							>
								Start Application
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Options Section */}
			<div className="mb-6  md:px-10 px-5">
				<div className="flex justify-center my-2 md:justify-start items-center mb-4">
					<hr className="border-gray-400 border-dashed border   w-[28%]" />
					<span className="mx-4 poppins-six text-xl">OR</span>
					<hr className="border-gray-400 border-dashed border   w-[28%]" />
				</div>
				<div className="flex flex-wrap   gap-4">
					{data?.instantHeading && data?.instantPrice && (
						<button
							onClick={() =>
								handleApplicationType(
									"instant",
									data?.instantDate
								)
							}
							className="bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] md:min-w-[60%] text-white p-4  relative md:px-8 md:pb-6 rounded-2xl shadow-md shadow-gray-400 flex justify-between items-center"
						>
							<div className="flex flex-col self-start">
								<span className="text-2xl poppins-five text-start">
									{data?.instantHeading}{" "}
								</span>
								<span className="text-2xl poppins-five text-start">
									Visa on {data?.instantDate}{" "}
								</span>
							</div>
							<span className="bg-white relative text-start md:pl-4 md:min-w-56 text-sm md:relative md:top-2  text-gray-500 p-2  rounded-lg">
								Chalo Ghoomne Instant
								<p className="text-start ">
									₹{data?.instantPrice}
								</p>
								<div className="absolute hidden md:block top-5 right-2">
									<MdChevronRight size={20} color="gray" />
								</div>
							</span>
						</button>
					)}
					{data?.expressPrice && data?.expressHeading && (
						<button
							onClick={() =>
								handleApplicationType(
									"express",
									data?.expressDate
								)
							}
							className="bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] md:min-w-[60%] text-white p-4 md:px-8 md:pb-6 rounded-2xl shadow-md shadow-gray-400 flex justify-between items-center"
						>
							<div className="flex flex-col">
								<span className="text-2xl poppins-five text-start">
									{data?.expressHeading}{" "}
								</span>
								<span className="text-2xl poppins-five text-start">
									Visa on {data?.expressDate}{" "}
								</span>
							</div>
							<span className="bg-white relative text-start md:pl-4 md:min-w-56 text-sm md:relative md:top-2  text-gray-500 p-2  rounded-lg">
								Chalo Ghoomne Express
								<p className="text-start ">
									₹{data?.expressPrice}
								</p>
								<div className="absolute hidden md:block top-5 right-2">
									<MdChevronRight size={20} color="gray" />
								</div>
							</span>
						</button>
					)}
				</div>
			</div>

			{/* Visa Information */}
			<div className="mb-6 w-full md:px-10 px-5">
				<div className="flex border rounded-xl shadow-sm shadow-gray-100 border-gray-200 justify-evenly  md:w-[60%]">
					<div className="p-2 rounded-lg">
						<p className="font-semibold">VISA TYPE</p>
						<p>{visaType}</p>
					</div>
					<div className="p-2 rounded-lg">
						<p className="font-semibold">VALIDITY</p>
						<p>{data?.validity} Days</p>
					</div>
					<div className="p-2 rounded-lg">
						<p className="font-semibold">PROCESSING TIME</p>
						<p>{data?.processingTime} Days</p>
					</div>
					<div className="p-2 rounded-lg">
						<p className="font-semibold">STAY</p>
						<p>{data?.period} Days</p>
					</div>
					<div className="p-2 sm:block hidden rounded-lg">
						<p className="font-semibold">ENTRY TYPE</p>
						<p>{data?.entryType}</p>
					</div>
				</div>
			</div>
			<div className="md:w-[60%] w-full">
				<FAQs ref={faqRef} data={faqData?.faq} />
			</div>

			<div className="text-md w-full md:w-[60%] poppins-four py-5 text-black px-10">
				{data?.longDescription}
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
				<div className="fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white relative m-4 mt-5 max-h-[600px] overflow-auto rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-xl poppins-four font-bold text-center my-2">
							Select Departure Date
						</h2>

						<MonthCalender
							onClose={
								!selectedType ? proceedApplication : proceedFunc
							}
						/>
						<button
							onClick={() => setCalendarModalOpen(false)}
							className="absolute right-2 top-3 text-2xl font-bold"
						>
							<RxCross1 size={20} color="red" />
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
