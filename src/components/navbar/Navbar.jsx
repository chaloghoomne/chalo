"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { IoMdArrowDropdown } from "react-icons/io"
import { useDispatch } from "react-redux"
import { login } from "../../redux/actions/login-actions"
import logo from "../../assets/CHLOGHOOMNE logo.png"
import whitelogo from "../../assets/whitelogo.png"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { getCountryId } from "../../redux/actions/package-id-actions"
import { FaPhoneAlt } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"
import { IoMdCart } from "react-icons/io"
import { IoIosNotifications } from "react-icons/io"
import axios from "axios"
import { useSelector } from "react-redux"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNotiOpen, setIsNotiOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [whichLogo, setWhichLogo] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [bgColor, setBgColor] = useState("bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]")
  const [count, setCount] = useState(0)
  const [noti, setNoti] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartData = useSelector((state) => state.CartReducer)

  const [token, setToken] = useState(localStorage.getItem("token") || null)
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
  })

  const handleLogout = () => {
    setModalOpen(!modalOpen)
    localStorage.clear()
    dispatch(login(false))
    dispatch(getCountryId(null))
    setModalOpen(false)
    navigate("/")
    window.location.reload()
  }

  const handleNotification = async () => {
    try {
      const response = await axios.get(`${BASE_URL}notification`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      const data = await response.data
      // console.log("API Response:", data) // Debugging API response

      if (!data || !data.data) {
        console.error("Invalid API response format:", data)
        return
      }

      setNoti(data.data)
      // console.log(noti)
      setCount(noti.filter((item) => item.isRead === false).length)
    } catch (err) {
      console.log("Error aa rahi ahi notification fetch karne me", err.message)
    }
  }
  useEffect(() => {
    handleNotification()
  }, [])

  const fetchData = async (token) => {
    if (!token) return

    try {
      const response = await fetchDataFromAPI("GET", `${BASE_URL}user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      // if (response.status === 503) {
      // 	navigate("/503"); // Redirect to Service Unavailable page
      // }

      if (response?.data) {
        setFormData(response.data)
        localStorage.setItem("userId", response.data._id || "")
      }
    } catch (error) {
      // navigate("/503")
      console.error("Error fetching user profile:", error)
    }
  }

  useEffect(() => {
    fetchData(token)
  }, [])

  // Listen for localStorage changes (detects when OTP sets the token)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "token") {
        setToken(event.newValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const getCartCount = () => {
      try {
        const storedData = localStorage.getItem("persist:root");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData?.CartReducer) {
            const cartReducer = JSON.parse(parsedData.CartReducer); // Second parse
            const itemCount = cartReducer.cartItems ? cartReducer.cartItems.length : 0;
            console.log("Total Cart Items:", itemCount);
            setCartCount(itemCount);
          }
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    };
  
    // Initial load
    getCartCount();
  
    // Listen for storage changes in other tabs
    const handleStorageChange = (event) => {
      if (event.key === "persist:root") {
        getCartCount();
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    // Optional: Listen for local updates within the same tab
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, arguments);
      if (key === "persist:root") {
        getCartCount();
      }
    };
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem; // Restore original method
    };
  }, []); // No dependency to avoid infinite loop

  useEffect(() => {
    const pathName = location.pathname
    if (pathName === "/") {
      setWhichLogo(true)
    } else {
      setWhichLogo(false)
    }
    setBgColor(pathName === "/" ? "bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] opacity-90 hover:opacity-100" : "bg-white shadow-md")

    // Disable body scroll when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [location.pathname, isOpen])

  const handleVisaClick = () => {
    navigate("/", {
      state: {
        scrollToVisaSection: true,
      },
    })
  }

  return (
    <>
      <nav className={`${bgColor} w-full fixed z-40 top-0 transition-all duration-300`}>
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center py-5 my-2 justify-between h-16">
            <div className="absolute inset-y-0 right-1 flex items-center lg:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-600/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke={whichLogo ? "white" : "black"}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>

            <div className="flex justify-between items-center">
              <Link to="/">
                <div className="my-8 flex justify-center items-center transition-transform duration-300 hover:scale-105">
                  <img
                    className={whichLogo ? "w-32" : "w-36"}
                    src={whichLogo ? whitelogo : logo}
                    alt="Logo"
                    onClick={() => whichLogo && window.location.reload()}
                  />
                </div>
              </Link>

              <div className={` hidden lg:flex md:ml-10 ${whichLogo ? "text-white" : "text-black"}`}>
                <div
                  onClick={() => {
                    navigate("/")
                  }}
                  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal hover:bg-blue-600/20 transition-all duration-200 relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
                >
                  Home
                </div>
                <div
                  onClick={handleVisaClick}
                  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal hover:bg-blue-600/20 transition-all duration-200 relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
                >
                  Visa
                </div>
                <div
                  onClick={() => {
                    navigate("/about")
                  }}
                  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal hover:bg-blue-600/20 transition-all duration-200 relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:left-0 after:bottom-0 after:bg-white hover:after:w-full after:transition-all after:duration-300"
                >
                  About Us
                </div>
                <div
                  onClick={() => navigate("/travel-form")}
                  className="block poppins-five pop px-3 py-2 cursor-pointer rounded-md text-[16px] font-normal"
                ></div>
              </div>
            </div>

            <div
              className={`${
                whichLogo ? "text-white" : "text-black"
              } absolute hidden inset-y-0 right-0 lg:flex gap-4 items-center pr-2 sm:static sm:inset-auto sm:ml-20 sm:pr-0`}
            >
              <div className={`relative ${count.length === 0 ? "" : "hidden"} `}>
                {/* Notification Icon & Count */}
                <div className="relative flex items-center gap-2 cursor-pointer">
                  {/* Notification Count */}
                  {count > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                      {count}
                    </span>
                  )}

                  {/* Notification Icon */}
                  <IoIosNotifications
                    size={24}
                    className={`${whichLogo ? "text-white" : "text-gray-700"} hover:text-amber-400 transition duration-200 transform hover:scale-110`}
                    onClick={() => setIsNotiOpen(!isNotiOpen)}
                  />
                </div>

                {/* Notification Dropdown */}
                <div
                  className={`absolute right-0 top-12 w-80 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
                    isNotiOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}
                >
                  <div className="p-2 bg-blue-600 text-white font-medium flex justify-between items-center">
                    <span>Notifications</span>
                    <button
                      onClick={() => setIsNotiOpen(false)}
                      className="hover:bg-blue-700 p-1 rounded-full transition-colors"
                    >
                      <IoMdClose size={16} />
                    </button>
                  </div>
                  <div className="p-4 max-h-60 overflow-y-auto">
                    {noti && noti.length > 0 ? (
                      noti.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 border-b border-gray-200 p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          {/* Notification Image */}
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt="Notification"
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                          />

                          {/* Notification Text */}
                          <span className="text-sm text-gray-700">{item.title}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No new notifications</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex items-center">
                <Link to="/cart" className={`relative group ${cartCount ? "" : "hidden"}`}>
                  {/* Cart Icon */}
                  <IoMdCart
                    className={`h-7 w-8 ${whichLogo ? "text-white" : "text-gray-700"} group-hover:text-amber-400 transition duration-300 transform group-hover:scale-110`}
                  />

                  {/* Cart Badge (Visible only if cartCount > 0) */}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full group-hover:bg-amber-500 transition-colors">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
              <div
                onClick={() => {
                  navigate("/travel-form")
                }}
                className="text-white hover:bg-blue-700 cursor-pointer p-2 px-4 rounded-full bg-blue-600 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Join as Agent
              </div>
              {!localStorage.getItem("token") ? (
                <Link
                  to="/login"
                  className={`ml-3 bg-[#2c2ea5] poppins-three text-white px-8 py-2 rounded-full text-[14px] font-medium transition-all duration-200 hover:bg-[#1f2080] hover:shadow-lg transform hover:scale-105`}
                >
                  Login
                </Link>
              ) : (
                <div className="w-48 h-12 p-1 pl-3 items-center justify-end flex gap-2 relative group">
                  <img
                    onClick={() => setIsLogin(!isLogin)}
                    src={
                      formData?.image ||
                      "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png" ||
                      "/placeholder.svg"
                    }
                    className="w-10 h-10 rounded-[70px] border-2 border-transparent group-hover:border-blue-300 transition-all duration-200"
                    alt="Profile"
                  />
                  <div className="flex flex-col justify-between">
                    <p
                      className={`text-sm ${
                        whichLogo ? "text-white" : "text-black"
                      } poppins-five pop cursor-pointer rounded-md text-[16px] group-hover:text-amber-400 transition-colors`}
                    >
                      Welcome
                    </p>
                  </div>
                  <div className="cursor-pointer" onClick={() => setModalOpen(!modalOpen)}>
                    <IoMdArrowDropdown
                      size={25}
                      color={whichLogo ? "white" : "black"}
                      className="group-hover:text-amber-400 transition-colors"
                    />
                  </div>
                </div>
              )}
              {modalOpen && (
                <div className="flex flex-col bg-white p-3 w-40 rounded-xl absolute top-16 right-7 h-auto shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setModalOpen(!modalOpen)}
                    className="py-2 cursor-pointer text-gray-700 text-center hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md mb-1"
                  >
                    Profile
                  </Link>
                  <p
                    onClick={() => handleLogout()}
                    className="py-2 text-gray-700 cursor-pointer text-center hover:bg-red-50 hover:text-red-600 transition-colors rounded-md"
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
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-50 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img className="w-40" src={logo || "/placeholder.svg"} alt="Logo" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <IoMdClose size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1">
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/"
                  className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Visa
                </Link>
                <Link
                  to="/travel-form"
                  className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  Join as Agent
                </Link>
                <Link
                  to="/cart"
                  className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  My Cart
                </Link>
                <a
                  href="tel:+919555535252"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-3 px-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  <FaPhoneAlt size={15} className="text-blue-600" />
                  9555535252
                </a>
              </div>
            </div>

            <div className="p-4 border-t">
              {!localStorage.getItem("token") ? (
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-8 py-3 rounded-lg text-base font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <img
                      src={
                        formData?.image ||
                        "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png" ||
                        "/placeholder.svg"
                      }
                      className="w-12 h-12 rounded-full border-2 border-blue-200"
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
                    className="block w-full text-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 py-2 px-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-center text-gray-600 hover:text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg transition-all duration-200"
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
  )
}

export default Navbar

