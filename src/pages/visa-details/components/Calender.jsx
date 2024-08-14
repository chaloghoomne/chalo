import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { calenderDate } from "../../../redux/actions/calender-date-action";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isFixed, setIsFixed] = useState(true);
  const [startDate, setStartDate] = useState("");
  const datePickerRef = useRef(null);
  const dispatch = useDispatch();

  const handleDateClick = (date) => {
    console.log(date, "date");
    setSelectedDate(date);
    dispatch(calenderDate(date));
  };

  const handlefixed = (value) => {
    console.log("hit ");
    setStartDate(value);
    dispatch(calenderDate(value));
  };

  const renderCalendar = () => {
    const days = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18, 19],
      [20, 21, 22, 23, 24, 25, 26],
      [27, 28, 29, 30, 31],
    ];

    return days.map((week, weekIndex) => (
      <div key={weekIndex} className="flex">
        {week.map((day, dayIndex) => (
          <button
            key={dayIndex}
            className="w-10 h-10 text-center text-sm hover:bg-blue-100 focus:outline-none"
            onClick={() =>
              handleDateClick(
                `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${day.toString().padStart(2, "0")}`
              )
            }
          >
            {day}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="w-full bg-white  rounded-lg shadow-lg p-4">
      {/* <h2 className="text-lg font-semibold mb-4">Select your departure date</h2>
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 text-center ${isFixed ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsFixed(true)}
        >
          Fixed Dates
        </button>
        <button
          className={`flex-1 py-2 text-center ${!isFixed ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setIsFixed(false)}
        >
          Flexible
        </button>
      </div> */}

      {selectedDate ? (
        <input
          type="text"
          value={selectedDate}
          onChange={(e) => handleDateClick(e.target.value)}
          placeholder="Selected Date"
          className="w-full p-2 border rounded mb-4"
        />
      ) : (
        <div className="relative flex w-[60%] p-2 border rounded ">
          <DatePicker
            placeholderText="📆"
            ref={datePickerRef}
            selected={startDate}
            onChange={(date) => handlefixed(date)}
          />
        </div>
      )}

      <div className="mb-4">
        {/* <div className="flex font-semibold mb-2">
          <div className="w-10 text-center">Mon</div>
          <div className="w-10 text-center">Tue</div>
          <div className="w-10 text-center">Wed</div>
          <div className="w-10 text-center">Thu</div>
          <div className="w-10 text-center">Fri</div>
          <div className="w-10 text-center">Sat</div>
          <div className="w-10 text-center">Sun</div>
        </div> */}
        {renderCalendar()}
      </div>
      {/* <button className="w-full bg-blue-500 text-white py-2 rounded">
        Proceed to Application
      </button> */}
    </div>
  );
};

export default Calendar;
