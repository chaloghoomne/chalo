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
          } else {
            console.log("");
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
    console.log(pathName, "pathName");
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
  }, [location.pathname]);

  return (
    <nav className={`${bgColor} w-full fixed z-50 top-0`}>
      <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="flex justify-between ">
            <Link to="/">
              <div className="my-8  flex justify-center items-center">
                <img
                  className={whichLogo ? "w-32" : "w-36"}
                  src={whichLogo ? whitelogo : logo}
                  alt="Logo"
                />
              </div>
            </Link>
          </div>
          <div className="absolute hidden inset-y-0 right-0 sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a
              href="tel:+918527418635"
              className=" block poppins-three pop px-3 py-2 text-white rounded-md text-[12px] font-normal"
            >
              Agent 
            </a>
            {!localStorage.getItem("token") ? (
              <Link
                to="/login"
                className="ml-3 bg-[#F26337] poppins-three text-white px-8 py-2 rounded-md text-[14px] font-medium"
              >
                Login
              </Link>
            ) : (
              <div className="w-60 h-12 p-1 px-3 items-center justify-between  flex gap-2">
                <img
                  onClick={() => setIsLogin(!isLogin)}
                  src={
                    formData?.image ||
                    "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png"
                  }
                  className="w-12 h-12  rounded-[70px]"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-xs text-white">Welcome Back</p>
                  <p className="text-sm  text-white max-w-40 overflow-x-auto  font-bold">
                    {formData?.firstName} {formData?.lastName}
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  <IoMdArrowDropdown size={25} />
                </div>
              </div>
            )}
            {modalOpen && (
              <div className="flex flex-col bg-white p-3 w-32 rounded-xl absolute top-12 right-7 h-auto">
                <Link
                  to="/profile"
                  onClick={() => setModalOpen(!modalOpen)}
                  className="border-b-2 py-1 cursor-pointer text-center hover:text-blue-600 border-gray-300"
                >
                  Profile
                </Link>
                <p
                  onClick={() => handleLogout()}
                  className="border-b-2 py-1 cursor-pointer text-center hover:text-blue-600 border-gray-300"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              HOME
            </a>
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              About us
            </a>
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              VISA
            </a>
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              Service
            </a>
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              Page
            </a>
            <a
              href="#"
              className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              Contact us
            </a>
            {/* <a
              href="tel:+918527418635"
              className="hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium"
            >
              Agent Login
            </a> */}
            <button className="block w-full bg-[#F26337] text-white px-8 py-2 rounded-md text-base font-medium">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
