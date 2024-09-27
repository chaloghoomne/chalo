import { RiContactsLine } from "react-icons/ri";
import card from "../../assets/card.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "./components/Calender";
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

const VisaDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const countryId = useSelector((state) => state.CountryIdReducer.countryId);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const selectedCountry = useSelector(
    (state) => state.SelectedCountryReducer.selectedCountry
  );
  const returnDate = useSelector(
    (state) => state.ReturnCalenderReducer.returnDate
  );
  const [faqData,setfaqData] = useState([])
  const fromDate = useSelector((state) => state.CalenderReducer.visaDate);
  const toDate = useSelector((state) => state.ReturnCalenderReducer.returnDate);
  const visaType = useSelector((state) => state.GetVisaTypeReducer.visaType);
  console.log(fromDate, "zxcvbndfgh");
  const datePickerRef = useRef(null);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [isApplicationModalOpen, setApplicationModalOpen] = useState(false);
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
  const [isFlexibleModalOpen, setFlexibleModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [important, setImportantPoints] = useState();
  const [partners, setPartners] = useState([]);
  const [data, setData] = useState({});

  const applyNowRef = useRef(null);
  const faqRef = useRef(null);
  const [isCardFixed, setIsCardFixed] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  const mainImageRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // Assuming 1024px is your 'lg' breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
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

  useEffect(() => {
    const handleScroll = () => {
      if (!isLargeScreen || !mainImageRef.current || !cardRef.current || !contentRef.current) return;

      const imageBottom = mainImageRef.current.getBoundingClientRect().bottom;
      const contentBottom = contentRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      if (imageBottom <= 0 && contentBottom > windowHeight) {
        cardRef.current.style.position = 'fixed';
        cardRef.current.style.top = '30px';
        cardRef.current.style.right = '15px';
      } else if (imageBottom > 0) {
        cardRef.current.style.position = 'absolute';
        cardRef.current.style.top = `${imageBottom}px`;
        cardRef.current.style.right = '5px';
      } else if (contentBottom <= windowHeight) {
        cardRef.current.style.position = 'absolute';
        cardRef.current.style.top = `${contentBottom - cardRef.current.offsetHeight}px`;
        cardRef.current.style.right = '5px';
      }
    };

    if (isLargeScreen) {
      window.addEventListener('scroll', handleScroll);
    } else {
      // Reset styles for smaller screens
      if (cardRef.current) {
        cardRef.current.style.position = '';
        cardRef.current.style.top = '';
        cardRef.current.style.right = '';
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLargeScreen]);

  console.log(important, "important data");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}partners`);
        console.log(response, "response partners");
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
    setIsReturnModalOpen(true);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}notes`);
        console.log(response);
        if (response) {
          const filtered = response?.data?.find(
            (item) => item.type === "Instructions"
          );
          console.log(filtered, "filtered");

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
        console.log(response, "response data");
        if (response) {
          setData(response.data);
          dispatch(setChildShowId(id))
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

  const handleApplicationChoice = (choice) => {
    setApplicationModalOpen(false);
    if (choice === "yes") {
      navigate("/upload-image");
    } else {
      console.log("hit");
      setCalendarModalOpen(true);
      console.log("hit2");
      navigate("/upload-image");
      datePickerRef.current.focus();
      console.log("hit3");
    }
  };

  // const handleApplicationType = async (type, date) => {
  //   console.log(date, "date");
  //   const newDate = new Date(date).toISOString();

  //   try {
  //     const response = await fetchDataFromAPI(
  //       "POST",
  //       `${BASE_URL}create-visa-order`,
  //       {
  //         visaCategory: id,
  //         travellersCount: numberOfTravelers,
  //         from: newDate,
  //         to: toDate,
  //         applicationType: type,
  //       }
  //     );
  //     console.log(response?.data?._id, "response Id ");
  //     if (response) {
  //       dispatch(PackageId(response?.data?.visaOrder?._id));
  //       dispatch(numberofCoTravelers(numberOfTravelers));
  //       dispatch(coTraveler(response?.data?.orderDetails?._id));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   navigate("/upload-image");
  // };

  const proceedFunc = async () => {
    if (!returnDate) {
      // Show an error if return date is not selected
      alert("Please select a return date");
      return;
    }

    const newDate = new Date(returnDate).toISOString();
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}create-visa-order`,
        {
          visaCategory: id,
          travellersCount: numberOfTravelers,
          from: new Date(data[`${selectedType}Date`]).toISOString(),
          to: newDate,
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
        }
      );
      console.log(response?.data?._id, "response Id ");
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
    <div ref={contentRef} className="w-full h-full mx-auto py-10">
      {/* Main Image */}
      <div
         ref={mainImageRef}
        className="w-full relative mt-12 rounded-xl bg-cover flex h-[500px] justify-center items-center mb-10"
      >
        <div className="px-16 w-full relative ">
          <img
            src={data?.image}
            alt="Gramado, Brazil"
            className="w-full bg-cover   h-[450px] rounded-2xl"
          />
          <div className="absolute lg:block hidden inset-0 left-28 -z-10 w-[85%] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-65"></div>
        </div>
        <div className=" absolute flex justify-center items-center gap-2 text-white font-medium text-xl top-12  left-24 bg-gray-900/20 rounded-xl px-4 py-2  ">
          <CiLocationOn size={22} color="white" /> {selectedCountry}
        </div>
      </div>

      {/* Apply Section */}

      <div className="w-full flex md:flex-row flex-col justify-between  md:px-10 px-5 ">
        <div ref={applyNowRef} className="mb-6 md:w-[50%] w-full">
          <h2 className="text-3xl font-bold mt-3 mb-2">
            Apply now for guaranteed visa on{" "}
          </h2>
          <span className="text-blue-500 font-bold text-3xl">
            {new Date(data?.expressDate).toDateString()?.slice(4, 100)}
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
                        {pointsArray?.map((point, pointIndex) => (
                          <p
                            key={pointIndex}
                            className="flex justify-start gap-2 items-center text-gray-400 poppins-four text-sm"
                          >
                            <GoDotFill color="black" size={5} />
                            {point}
                          </p>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className=" md:w-[50%] md:px-10 relative w-full ">
        <div
            ref={cardRef}
            style={{ 
              backgroundImage: `url(${card})`,
              position: isLargeScreen ? 'absolute' : 'relative',
              top: isLargeScreen ? '0' : 'auto',
              right: isLargeScreen ? '5px' : 'auto'
            }}
            className="w-full bg-cover z-30 mt-7 mb-8 pb-16 mx-auto bg-transparent max-w-[29rem] md:max-w-[29rem] md:p-10 p-6"
          >
            <div className="flex justify-between px-5 items-center  mb-4">
              <h2 className="text-2xl poppins-six relative top-5 font-semibold ">
                {" "}
                <RiContactsLine size={30} style={{ fontWeight: "bold" }} />
                Travellers
              </h2>
              <div className="flex items-center relative top-10 space-x-2 p-b8">
                <button
                  onClick={() => handletravelerNumber("sub")}
                  className="bg-white border border-black  text-lg flex cursor-pointer justify-center items-center w-4 h-4 rounded-full"
                >
                  -
                </button>
                <span className="text-lg poppins-six">{numberOfTravelers}</span>
                <button
                  onClick={() => handletravelerNumber("add")}
                  className="bg-white border border-black text-lg flex justify-center items-center  w-4 h-4 rounded-full"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full px-5 rounded-xl  relative top-3 border-gray-300 border bg-gray-800/60 "></div>
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
                className="flex w-full flex-wrap gap-6 justify-evenly "
              >
                <div className="text-center">
                  <p className="font-semibold poppins-six text-[12px]">
                    VISA TYPE
                  </p>
                  <p className="text-xs text-start">{visaType}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold poppins-six text-[12px]">
                    VALIDITY
                  </p>
                  <p className="text-xs text-start">{data?.validity}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold poppins-six text-[12px]">
                    PROCESSING TIME
                  </p>
                  <p className="text-xs text-start">{data?.processingTime}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold poppins-six text-[12px]">STAY</p>
                  <p className="text-xs text-start">{data?.period}</p>
                </div>
                <div className="text-center">
                  <p className="poppins-six text-[12px] font-semibold">
                    ENTRY TYPE
                  </p>
                  <p className="text-xs text-start">{data?.entryType}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 flex px-5 justify-between w-full">
              <h3 className="text-xl poppins-six font-medium">Total Amount</h3>
              <p className="text-xl poppins-six font-medium">
                ₹{data?.price * numberOfTravelers}
              </p>
            </div>
            <div className="w-full border-dashed border px-5  my-2 border-black"></div>
            <div className="flex justify-center items-center">
              <button
                onClick={handleStartApplication}
                className="bg-gradient-to-r relative cursor-pointer top-2 from-[#3180CA] to-[#7AC7F9] text-white py-3 px-4 rounded-2xl text-2xl poppins-six w-[80%]"
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
          <hr className="border-gray-400 h-[2px] bg-gray-400  w-[28%]" />
          <span className="mx-4 poppins-six text-xl">OR</span>
          <hr className="border-gray-400 h-[2px] bg-gray-400  w-[28%]" />
        </div>
        <div className="flex flex-wrap   gap-4">
          {data?.instantHeading && data?.instantPrice && (
            <button
              onClick={() =>
                handleApplicationType("instant", data?.instantDate)
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
                <p className="text-start ">₹{data?.instantPrice}</p>
                <div className="absolute hidden md:block top-5 right-2">
                  <MdChevronRight size={20} color="gray" />
                </div>
              </span>
            </button>
          )}
          {data?.expressPrice && data?.expressHeading && (
            <button
              onClick={() =>
                handleApplicationType("express", data?.expressDate)
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
                <p className="text-start ">₹{data?.expressPrice}</p>
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
      <div className="md:w-[60%] w-full"><FAQs ref={faqRef} data={faqData?.faq} /></div>
    
      <div className="text-md w-full md:w-[60%] poppins-four py-5 text-black px-10">
        {data?.longDescription}
      </div>
      {/* Partners Section */}
      <div className="w-full md:w-[60%]">
        <h2 className="text-2xl font-bold px-5  mb-4">Partners we work with</h2>
        <div className="overflow-x-auto px-5">
          <div className="flex space-x-4 py-5">
            {partners?.map((partner) => {
              return (
                <>
                  <Link
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
                      <p
                        style={{
                          overflowWrap: "anywhere",
                        }}
                        className="font-semibold max-w-[200px]"
                      >
                        {partner?.title}
                      </p>
                      {/* <p
                        style={{
                          overflowWrap: "anywhere",
                        }}
                        className="text-gray-500"
                      >
                        {partner?.heading < 20
                          ? partner?.heading
                          : `${partner?.heading?.slice(0, 20)}...`}
                        {partner?.heading?.length > 20 && (
                          <span
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-500 cursor-pointer"
                          >
                            see more
                          </span>
                        )}
                      </p>
                      <p className="text-gray-500">
                        {partner?.travellersCount} travelers
                      </p> */}
                    </div>
                  </Link>
                </>
              );
            })}
          </div>
        </div>
      </div>

      {isApplicationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4">Start Application</h2>
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
        <div className="fixed inset-0 flex z-50 items-start justify-center bg-black bg-opacity-50">
          <div className="bg-white m-4 mt-5 max-h-[400px] rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl poppins-four font-bold text-center my-2">
              Select Departure Date
            </h2>
            {/* <div className="mb-4 flex ">
              <button className="bg-gray-200 py-2 px-4 rounded-lg w-full mb-2" onClick={() => handleCalendarChoice('fixed')}>Fixed</button>
              <button className="bg-gray-200 py-2 px-4 rounded-lg w-full" onClick={() => handleCalendarChoice('flexible')}>Flexible</button>
            </div>

             <DatePicker ref={datePickerRef} selected={startDate} onChange={(date) => setStartDate(date)} /> */}
            <MonthCalender onClose={proceedApplication} />
            <button
              onClick={() => setCalendarModalOpen(false)}
              className="absolute right-2 top-20 text-2xl font-bold"
            >
              ❌
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
              className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
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
            <div onClick={() => setIsReturnModalOpen(false)} className=" py-2">
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
