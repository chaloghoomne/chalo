import React, { useRef, useState } from "react";
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
} from "date-fns";
import { calenderDate } from "../../../redux/actions/calender-date-action";

const Calendar = () => {
  const travelDate = useSelector((state) => state.CalenderReducer.visaDate);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const dispatch = useDispatch();

  const today = startOfDay(new Date()); // Get start of today for consistent comparison

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    // Only allow going back to the current month
    if (!isBefore(startOfMonth(newDate), startOfMonth(today))) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    // Prevent selecting dates before today
    if (isBefore(day, today)) {
      return;
    }
    
    const clickedDate = format(day, "yyyy-MM-dd");
    setSelectedDate(clickedDate);
    dispatch(calenderDate(clickedDate));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <div className="w-full bg-white min-h-56 rounded-lg shadow-lg p-4">
      <div className="relative flex w-[90%] flex-col gap-2 p-2 border rounded">
        <input
          type="text"
          value={selectedDate || travelDate}
          className="w-[90%] border border-black rounded-lg text-black p-2"
          readOnly
        />
        <div className="flex flex-col gap-2.5">
          <div className="calendar">
            <div>
              <div className="text-left font-medium text-lg">Calendar</div>
              <div className="border-t my-2"></div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-medium">
                {format(currentDate, "MMMM yyyy")}
              </div>
              <div className="flex gap-2.5">
                <button
                  className="px-3 py-1 rounded hover:bg-gray-100"
                  onClick={handlePrevMonth}
                  disabled={isBefore(startOfMonth(subMonths(currentDate, 1)), startOfMonth(today))}
                >
                  &lt; Prev
                </button>
                <button
                  className="px-3 py-1 rounded hover:bg-gray-100"
                  onClick={handleNextMonth}
                >
                  Next &gt;
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {/* {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))} */}
              
              {/* Calendar days */}
              {daysInMonth.map((day) => {
                const formattedDate = format(day, "yyyy-MM-dd");
                const isBeforeToday = isBefore(day, today);
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      p-2 text-center cursor-pointer rounded
                      ${isBeforeToday ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                      ${travelDate === formattedDate ? 'bg-blue-500 text-white' : ''}
                      ${!isSameMonth(day, currentDate) ? 'text-gray-400' : ''}
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
      </div>
    </div>
  );
};

export default Calendar;