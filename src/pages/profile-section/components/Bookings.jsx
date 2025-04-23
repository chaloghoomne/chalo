"use client"

// src/components/LatestBookings.js
import { useEffect, useState } from "react"
import { fetchDataFromAPI } from "../../../api-integration/fetchApi"
import { BASE_URL } from "../../../api-integration/urlsVariable"
import { useDispatch } from "react-redux"
import { coTraveler, getVisaType, PackageId } from "../../../redux/actions/package-id-actions"
import { numberofCoTravelers } from "../../../redux/actions/numberoftravelers-actions"
import { useNavigate } from "react-router-dom"

const Bookings = () => {
  const [bookings, setBookings] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Function to generate a fancy ID format
  const formatBookingId = (originalId) => {
    if (!originalId) return "TF-2024-XXXXX"

    // Take the last 5 characters of the original ID
    const shortId = originalId.slice(-5)
    // Current year
    const year = new Date().getFullYear()
    // Random 2-digit number
    const random = Math.floor(Math.random() * 90 + 10)

    return `TF-${year}-${shortId}${random}`
  }

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    let badgeClass = "text-xs font-medium px-2 py-1 rounded-full"

    switch (status) {
      case "pending":
        badgeClass += " bg-yellow-100 text-yellow-800"
        break
      case "sent-to-immigration":
        badgeClass += " bg-orange-100 text-orange-800"
        status = "in-process"
        break
      case "approved":
        badgeClass += " bg-green-100 text-green-800"
        break
      case "rejected":
      case "sent-back":
        badgeClass += " bg-red-100 text-red-800"
        status = "rejected"
        break
      case "blacklist":
        badgeClass += " bg-gray-100 text-gray-800"
        break
      default:
        badgeClass += " bg-blue-100 text-blue-800"
    }

    return <span className={badgeClass}>{status}</span>
  }

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const user = localStorage.getItem("userId")
        const response = await fetchDataFromAPI("POST", `${BASE_URL}user-visa-orders`, { user: user })

        if (response) {
          console.log(response.data)
          setBookings(response.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleBooking = async (id, travlerscount, cotravlerId, visaType) => {
    dispatch(PackageId(id))
    dispatch(getVisaType(visaType))
    dispatch(coTraveler(cotravlerId))
    dispatch(numberofCoTravelers(travlerscount))
    navigate("/persons-details")
  }

  const handleSubmitApplication = async (id, travlerscount, cotravlerId, visaType) => {
    dispatch(PackageId(id))
    dispatch(getVisaType(visaType))
    dispatch(coTraveler(cotravlerId))
    dispatch(numberofCoTravelers(travlerscount))
    navigate("/edit-visa-request")
  }

  const viewApplication = async (id, travlerscount, cotravlerId, visaType) => {
    dispatch(PackageId(id))
    dispatch(getVisaType(visaType))
    dispatch(coTraveler(cotravlerId))
    dispatch(numberofCoTravelers(travlerscount))
    navigate("/view-application")
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="p-2 md:p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-[#2563EB] to-[#7AC7F9] p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-bold text-white">Latest Bookings</h2>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm text-white backdrop-blur-sm">
              {bookings?.length || 0} Bookings
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : bookings?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">No bookings found</h3>
            <p className="text-gray-500 mt-2">Start by creating a new visa application</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
            {bookings?.map((booking, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-gray-100">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s"
                          alt={booking?.country || "Visa"}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-1 left-1 right-1 text-white text-xs font-medium text-center">
                          {booking?.tourType?.name || "Visa"}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {booking?.country || "Unknown Country"}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: <span className="font-mono">{formatBookingId(booking?._id)}</span>
                          </p>
                        </div>
                        <StatusBadge status={booking?.status} />
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">From</p>
                          <p className="text-sm font-medium">{formatDate(booking?.from)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">To</p>
                          <p className="text-sm font-medium">{formatDate(booking?.to)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    {booking?.documentFulfillmentStatus && booking?.isSubmitted ? (
                      <button
                        onClick={() =>
                          viewApplication(
                            booking?._id,
                            booking?.travellersCount,
                            booking?.latestOrderDetailsId,
                            booking?.tourType?.name,
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Application
                      </button>
                    ) : booking?.documentFulfillmentStatus ? (
                      <button
                        onClick={() =>
                          handleSubmitApplication(
                            booking?._id,
                            booking?.travellersCount,
                            booking?.latestOrderDetailsId,
                            booking?.tourType?.name,
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                        Make Payment
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleBooking(
                            booking?._id,
                            booking?.travellersCount,
                            booking?.latestOrderDetailsId,
                            booking?.tourType?.name,
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Complete Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
