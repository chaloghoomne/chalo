"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Calendar } from "primereact/calendar"
import { calenderDate, returnCalenderDate } from "../../../redux/actions/calender-date-action"
import "primereact/resources/themes/lara-light-cyan/theme.css"
import { format } from "date-fns"

const MonthCalender = ({ onClose }) => {
  const dispatch = useDispatch()

  // Local state to temporarily store selected dates
  const [dateRange, setDateRange] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [datesDispatched, setDatesDispatched] = useState(false)

  // Get today's date to prevent past date selection
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to avoid timezone issues

  // Handle date selection
  const handleDateSelection = (e) => {
    console.log("Selected Date Range:", e.value)
    setDateRange(e.value)
  }

  // Immediately dispatch dates when they're selected
  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      try {
        const formattedVisaDate = format(dateRange[0], "yyyy-MM-dd")
        const formattedReturnDate = format(dateRange[1], "yyyy-MM-dd")

        console.log("Auto-dispatching dates:", formattedVisaDate, formattedReturnDate)

        dispatch(calenderDate(formattedVisaDate))
        dispatch(returnCalenderDate(formattedReturnDate))

        setDatesDispatched(true)
      } catch (error) {
        console.error("Error formatting dates:", error)
      }
    }
  }, [dateRange, dispatch])

  // Handle Proceed button
  const proceedFunc = () => {
    if (!dateRange || dateRange.length !== 2) {
      toast.error("Please select both Travel and Return Dates")
      return
    }

    // Prevent multiple clicks
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // If dates weren't already dispatched, do it now (fallback)
      if (!datesDispatched) {
        const formattedVisaDate = format(dateRange[0], "yyyy-MM-dd")
        const formattedReturnDate = format(dateRange[1], "yyyy-MM-dd")

        dispatch(calenderDate(formattedVisaDate))
        dispatch(returnCalenderDate(formattedReturnDate))
      }

      // Close the calendar immediately
      if (onClose) onClose()
    } catch (error) {
      console.error("Error in proceedFunc:", error)
      toast.error("There was an error processing your dates. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-xl overflow- h-[600px] max-w-md w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-lg text-white p-4">
        <h2 className="text-xl font-semibold text-center">Select Travel Dates</h2>
        <p className="text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-100 bg-[length:300%_100%] text-sm mt-1 animate-text-color-pulse">Choose your travel and return dates</p>
      </div>

      {/* Date Picker */}
      <div className="p-4">
        <div className="bg-blue-50 rounded-lg p-2 mb-4">
          <Calendar
            value={dateRange}
            onChange={handleDateSelection}
            selectionMode="range"
            inline
            readOnlyInput
            minDate={today}
            className="w-full"
            panelClassName="border-0"
          />
        </div>

        {/* Selected Date Display */}
        <div className="mb-4 px-2">
          {dateRange && dateRange.length === 2 ? (
            <div className="flex justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500">Travel Date</span>
                <span className="font-medium text-blue-700">{format(dateRange[0], "MMM dd, yyyy")}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-gray-500">Return Date</span>
                <span className="font-medium text-blue-700">{format(dateRange[1], "MMM dd, yyyy")}</span>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">Please select both travel and return dates</p>
          )}
        </div>

        {/* Proceed Button */}
        <button
          onClick={proceedFunc}
          disabled={isSubmitting || !dateRange || dateRange.length !== 2}
          className={`w-full py-3 px-4 rounded-b-lg text-white -bottom-6 left-0 absolute font-medium transition-all duration-300 ${
            isSubmitting || !dateRange || dateRange.length !== 2
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Proceed to Application"
          )}
        </button>
      </div>
    </div>
  )
}

export default MonthCalender

