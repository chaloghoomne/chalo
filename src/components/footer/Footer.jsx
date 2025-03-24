"use client"

import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaBriefcase,
  FaUserTie,
  FaInfoCircle,
  FaBlog,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaShieldAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaPaperPlane,
} from "react-icons/fa"

const Footer = () => {
  const [email, setEmail] = useState("")
  const location = useLocation()
  const [showNewsletter, setShowNewsletter] = useState(true)
  const [formData, setFormData] = useState({
    offices: [{ city: "", addressLine1: "", addressLine2: "", phone: "" }],
    supportEmail: "",
    phoneNumber: "9555535252",
  })

  useEffect(() => {
    // Fetch existing contact info
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/contact`)
        setFormData(resp.data.data)
      } catch (error) {
        console.error("Error fetching contact data:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const pathName = location.pathname
    const hiddenPaths = ["/edit-visa-request", "/upload-image", "/view-application", "/visa-details/:id"]
    setShowNewsletter(!hiddenPaths.some((path) => pathName === path || pathName.startsWith(path)))
  }, [location.pathname])

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const becomeSubscriber = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}add-subscription`, { email })

      if (response) {
        setEmail("")
        toast.success("Congratulations! You are a subscriber now")
      }
    } catch (error) {
      toast.info("You are already a subscriber")
    }
  }

  return (
    <footer className="w-full bg-white">
      {showNewsletter && (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-6xl mx-auto overflow-hidden rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 shadow-md">
            <div className="relative px-6 py-4 md:py-5">
              <div className="absolute inset-0 bg-[url('../../assets/subscribe.png')] bg-cover bg-center opacity-10"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl text-center font-bold text-white whitespace-nowrap">Join our newsletter</h2>
                <div className="flex flex-1 max-w-lg">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className="flex-grow px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-600 border-0"
                  />
                  <button
                    onClick={becomeSubscriber}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="mb-6">
                <img src="/assets/whitelogo.png" alt="Chalo Ghoomne" className="h-12" />
              </div>
              <p className="text-gray-300 text-sm mb-6">
                Our visa booking company is dedicated to simplifying the complex and often daunting process of obtaining
                travel visas. With extensive experience and a team of experts, we provide personalized services to
                ensure a smooth and hassle-free visa application experience.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/chaloghoomneofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/chaloghoomneofficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/chaloghoomne1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/919555535252"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-amber-400">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/career-form"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaBriefcase className="w-4 h-4" />
                    <span>Careers</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/travel-form"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaUserTie className="w-4 h-4" />
                    <span>For Travel Agents</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaInfoCircle className="w-4 h-4" />
                    <span>About us</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blogs"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaBlog className="w-4 h-4" />
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Important Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-amber-400">
                Important Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaShieldAlt className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-condition"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaFileContract className="w-4 h-4" />
                    <span>Terms and Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaMoneyBillWave className="w-4 h-4" />
                    <span>Refund Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
                  >
                    <FaPhone className="w-4 h-4" />
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-amber-400">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="text-gray-300 flex items-start gap-2">
                  <FaMapMarkerAlt className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>
                    {formData?.addressLine1 + " " + formData?.addressLine2 || "Siri Fort, New Delhi - 110049"}
                  </span>
                </li>
                <li className="text-gray-300 flex items-center gap-2">
                  <FaGlobe className="w-4 h-4 flex-shrink-0" />
                  <span>{formData?.supportEmail || "www.chaloghoomne.com"}</span>
                </li>
                <li className="text-gray-300 flex items-center gap-2">
                  <FaPhone className="w-4 h-4 flex-shrink-0" />
                  <span>{"+91 " + (formData?.phoneNumber || "9555535252")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm">
            <p>Copyright © {new Date().getFullYear()} Chalo Ghoomne. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

