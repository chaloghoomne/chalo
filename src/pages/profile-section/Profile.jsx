"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoPaperPlaneSharp, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5"
import { MdDateRange, MdEdit } from "react-icons/md"
import { CiLocationOn } from "react-icons/ci"
import { FaRegUser, FaCamera } from "react-icons/fa"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { Helmet } from "react-helmet"

// Import components
import AddressDetails from "./components/AddressDetails"
import Travelers from "./components/Traveler"
import Bookings from "./components/Bookings"

function Profile() {
  const [activeTab, setActiveTab] = useState("travelers")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}user-profile`)
        if (response) {
          setUserData(response?.data)
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Animation variants for tab transitions
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  // Navigation items
  const navItems = [
    { id: "travelers", label: "Travelers", icon: <FaRegUser size={18} /> },
    { id: "addressDetails", label: "Address Details", icon: <CiLocationOn size={20} /> },
    { id: "bookings", label: "Bookings", icon: <MdDateRange size={18} /> },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Helmet>
        <meta charSet="utf-8" />
        <title>User Profile | Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      {/* Hero section with cover image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 z-10"></div>
        <img
          src="https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg?cs=srgb&dl=pexels-asadphoto-1450340.jpg&fm=jpg"
          className="w-full h-full object-cover"
          alt="Cover"
        />

        {/* Cover image edit button */}
        <button className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all">
          <FaCamera size={18} />
        </button>

        {/* Profile info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="container mx-auto">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                  {userData?.profileImage ? (
                    <img
                      src={userData.profileImage || "/placeholder.svg"}
                      alt={userData?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      <span className="text-3xl font-bold">{userData?.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-all">
                  <MdEdit size={16} />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {loading ? "Loading..." : userData?.name || "User Profile"}
                </h1>
                <p className="text-white/80">{userData?.email || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile summary card */}
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Profile Summary</h2>
                <div className="mt-4 space-y-3">
                  {loading ? (
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <IoPaperPlaneSharp className="text-blue-500" />
                        <span>{userData?.email || "No email provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CiLocationOn className="text-blue-500" />
                        <span>{userData?.address?.city || "No location set"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdDateRange className="text-blue-500" />
                        <span>
                          Member since{" "}
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Recently"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-2">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.id}>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <span className={activeTab === item.id ? "text-blue-500" : "text-gray-500"}>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Account actions */}
              <div className="p-4 border-t border-gray-100">
                <ul className="space-y-1">
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                      <span className="text-gray-500">
                        <IoSettingsOutline size={18} />
                      </span>
                      <span className="font-medium">Account Settings</span>
                    </button>
                  </li>
                  <li>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all">
                      <span className="text-red-500">
                        <IoLogOutOutline size={18} />
                      </span>
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial="hidden" animate="visible" exit="exit" variants={tabVariants}>
                  {activeTab === "addressDetails" && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Address Details</h2>
                      <AddressDetails user={userData} />
                    </div>
                  )}
                  {activeTab === "travelers" && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Travelers Information</h2>
                      <Travelers user={userData} />
                    </div>
                  )}
                  {activeTab === "bookings" && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Bookings</h2>
                      <Bookings user={userData} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

