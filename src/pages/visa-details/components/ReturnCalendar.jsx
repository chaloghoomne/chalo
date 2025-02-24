import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  isBefore,
  isValid,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { returnCalenderDate } from "../../../redux/actions/calender-date-action";

const ReturnCalender = () => {
  const dispatch = useDispatch();
  const travelDate = useSelector((state) => state.CalenderReducer.visaDate);
  const returnDate = useSelector((state) => state.ReturnCalenderReducer.returnDate);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(returnDate || "");

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    if (!travelDate) return;
    if (isBefore(day, parseISO(travelDate))) return; // Prevents selecting a date before travelDate

    const formattedDate = format(day, "yyyy-MM-dd");
    setSelectedDate(formattedDate);
    dispatch(returnCalenderDate(formattedDate));
  };

  const handleInputChange = (e) => {
    const inputDate = e.target.value;
    setSelectedDate(inputDate);

    const parsedDate = parseISO(inputDate);
    if (!isValid(parsedDate) || (travelDate && isBefore(parsedDate, parseISO(travelDate)))) return;

    setCurrentDate(parsedDate);
    dispatch(returnCalenderDate(format(parsedDate, "yyyy-MM-dd")));
  };

  const isDateInRange = (date) => {
    if (!travelDate || !returnDate) return false;
    return isWithinInterval(date, {
      start: parseISO(travelDate),
      end: parseISO(returnDate),
    });
  };

  const isDateDisabled = (date) => {
    if (!travelDate) return false;
    return isBefore(date, parseISO(travelDate));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        {/* Input Field for Manual Date Entry */}
        <input
          type="date"
          value={selectedDate || ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          min={travelDate || format(new Date(), "yyyy-MM-dd")}
        />

        {/* Month Navigation */}
        <div className="flex justify-between items-center w-full">
          <button
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            onClick={handlePrevMonth}
            disabled={isBefore(startOfMonth(subMonths(currentDate, 1)), startOfMonth(new Date()))}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-lg font-semibold text-gray-800">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <button
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mt-4 w-full">
          {/* Day Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-500">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {daysInMonth.map((day) => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const disabled = isDateDisabled(day);
            const inRange = isDateInRange(day);

            return (
              <div
                key={formattedDate}
                className={`
                  flex justify-center items-center w-10 h-10 text-sm rounded-full cursor-pointer transition
                  ${disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-100"}
                  ${inRange ? "bg-blue-200" : ""}
                  ${selectedDate === formattedDate ? "bg-blue-500 text-black font-bold" : ""}
                  ${travelDate === formattedDate ? "border border-blue-500" : ""}
                  ${!isSameMonth(day, currentDate) ? "text-gray-400" : ""}
                `}
                onClick={() => !disabled && handleDateClick(day)}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReturnCalender;
