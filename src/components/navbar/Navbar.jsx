import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoMdArrowDropdown, IoMdNotifications } from "react-icons/io";
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/login-actions";
import logo from "../../assets/CHLOGHOOMNE logo.png";
import whitelogo from "../../assets/whitelogo.png";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { getCountryId } from "../../redux/actions/package-id-actions";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdWifiCalling3 } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [whichLogo, setWhichLogo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bgColor, setBgColor] = useState(
    "bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    passportNumber: "",
    passportExpiry: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    occupation: "",
    image: "",
  });

  const handleLogout = () => {
    setModalOpen(!modalOpen);
    localStorage.removeItem("token");
    dispatch(login(false));
    dispatch(getCountryId(null));
    setModalOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const fetchData = async () => {
        try {
          const response = await fetchDataFromAPI(
            "GET",
            `${BASE_URL}user-profile`
          );
          if (response) {
            const data = response?.data;
            setFormData(data);
            localStorage.setItem("userId", data?._id);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/") {
      setWhichLogo(true);
    } else {
      setWhichLogo(false);
    }
    setBgColor(
      pathName === "/"
        ? "bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]"
        : "bg-white shadow-md"
    );

    // Disable body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [location.pathname, isOpen]);

  const handleVisaClick = () => {
  navigate("/", { 
      state: { 
        scrollToVisaSection: true 
      }
    });
  };



  return (
    <>
      <nav className={`${bgColor} w-full fixed z-40 top-0`}>
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-5 my-2 justify-between h-16">
            <div className="absolute inset-y-0 right-1 flex items-center lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={whichLogo ? "white" : "black"}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/">
                <div className="my-8 flex justify-center items-center">
                  <img
                    className={whichLogo ? "w-32" : "w-36"}
                    src={whichLogo ? whitelogo : logo}
                    alt="Logo"
                    onClick={()=>whichLogo && window.location.reload()}
                  />
                </div>
              </Link>

              <div className={` hidden sm:flex md:ml-10 ${whichLogo ? "text-white" : "text-black"}`}>
                <div  onClick={handleVisaClick}  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal">
                  Visa
                </div>
                <div className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal">
                  Visa Appointments
                </div>
                <div
                  onClick={() => navigate("/travel-form")}
                  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal"
                >
                  Agent
                </div>
              </div>
            </div>

            <div className={`${whichLogo ? "text-white" : "text-black"} absolute hidden inset-y-0 right-0 sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-20 sm:pr-0`}>
              <a
                href="tel:+919555535252"
                className={`block poppins-five relative ${!localStorage.getItem("token") ? "left-0" : "left-8"} flex items-center justify-center gap-2 pop px-3 py-2 ml-6 rounded-md text-[18px] font-normal`}
              >
                <MdWifiCalling3 size={20} color={whichLogo ? "white" : "black"} /> 9555535252
              </a>
              {!localStorage.getItem("token") ? (
                <Link
                  to="/login"
                  className={`ml-3 bg-[#F26337] poppins-three ${whichLogo ? "text-white" : "text-black"} px-8 py-2 rounded-full text-[14px] font-medium`}
                >
                  Login
                </Link>
              ) : (
                <div className="w-48 h-12 p-1 pl-3 items-center justify-end flex gap-2">
                  <img
                    onClick={() => setIsLogin(!isLogin)}
                    src={
                      formData?.image ||
                      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
                    }
                    className="w-10 h-10 rounded-[70px]"
                    alt="Profile"
                  />
                  <div className="flex flex-col justify-between">
                    <p className={`text-sm ${whichLogo ? "text-white" : "text-black"} poppins-five pop  cursor-pointer rounded-md text-[16px]`}>
                      Welcome
                    </p>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    <IoMdArrowDropdown size={25} color={whichLogo ? "white" : "black"} />
                  </div>
                </div>
              )}
              {modalOpen && (
                <div className="flex flex-col bg-white p-3 w-32 rounded-xl absolute top-12 right-7 h-auto">
                  <Link
                    to="/profile"
                    onClick={() => setModalOpen(!modalOpen)}
                    className="border-b-2 py-1 cursor-pointer text-black text-center hover:text-blue-600 border-gray-300"
                  >
                    Profile
                  </Link>
                  <p
                    onClick={() => handleLogout()}
                    className="border-b-2 py-1 text-black cursor-pointer text-center hover:text-blue-600 border-gray-300"
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img className="w-40" src={logo} alt="Logo" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-4">
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-blue-600 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Visa
                </Link>
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-blue-600 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Visa Appointments
                </Link>
                <Link
                  to="/travel-form"
                  className="block text-gray-600 hover:text-blue-600 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Agent
                </Link>
                <a
                  href="tel:+919555535252"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <FaPhoneAlt size={15} />
                  9555535252
                </a>
              </div>
            </div>

            <div className="p-4 border-t">
              {!localStorage.getItem("token") ? (
                <Link
                  to="/login"
                  className="block w-full bg-[#F26337] text-white text-center px-8 py-2 rounded-full text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        formData?.image ||
                        "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
                      }
                      className="w-10 h-10 rounded-full"
                      alt="Profile"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Welcome</p>
                      <p className="text-sm font-bold text-gray-800">
                        {formData?.firstName} {formData?.lastName}
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block w-full text-center text-gray-600 hover:text-blue-600 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-center text-gray-600 hover:text-blue-600 py-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;