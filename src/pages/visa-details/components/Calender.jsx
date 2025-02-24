import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
  parseISO,
  isValid,
  isToday,
} from "date-fns";
import { calenderDate } from "../../../redux/actions/calender-date-action";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const dispatch = useDispatch();
  const travelDate = useSelector((state) => state.CalenderReducer.visaDate);
  const today = startOfDay(new Date());

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(travelDate || "");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    if (!isBefore(startOfMonth(prevMonth), startOfMonth(today))) {
      setCurrentDate(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    if (!isBefore(day, today)) {
      const formattedDate = format(day, "yyyy-MM-dd");
      setSelectedDate(formattedDate);
      dispatch(calenderDate(formattedDate));
    }
  };

  const handleInputChange = (e) => {
    const inputDate = e.target.value;
    setSelectedDate(inputDate);

    const parsedDate = parseISO(inputDate);
    if (isValid(parsedDate) && !isBefore(parsedDate, today)) {
      setCurrentDate(parsedDate);
      dispatch(calenderDate(format(parsedDate, "yyyy-MM-dd")));
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center">
        {/* Input Field for Manual Date Entry */}
        <input
          type="date"
          value={selectedDate}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          min={format(today, "yyyy-MM-dd")}
        />

        {/* Month Navigation */}
        <div className="flex justify-between items-center w-full">
          <button
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            onClick={handlePrevMonth}
            disabled={isBefore(startOfMonth(subMonths(currentDate, 1)), startOfMonth(today))}
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
            const isBeforeToday = isBefore(day, today);

            return (
              <div
                key={formattedDate}
                className={`
                  flex justify-center items-center w-10 h-10 text-sm rounded-full cursor-pointer transition
                  ${isBeforeToday ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-100"}
                  ${selectedDate === formattedDate ? "bg-blue-500 text-white font-bold" : ""}
                  ${isToday(day) ? "border border-blue-500" : ""}
                  ${!isSameMonth(day, currentDate) ? "text-gray-400" : ""}
                `}
                onClick={() => !isBeforeToday && handleDateClick(day)}
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

export default Calendar;
