import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { calenderDate } from "../../../redux/actions/calender-date-action";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState("");
  const datePickerRef = useRef(null);
  const dispatch = useDispatch();

  const handleDateClick = (day) => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      day + 1
    );
    setSelectedDate(date);
    dispatch(calenderDate(date.toISOString().split("T")[0]));
  };

  const handlefixed = (value) => {
    setStartDate(value);
    setSelectedDate(value);
    dispatch(calenderDate(value.toISOString().split("T")[0]));
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
        {week.map((day, dayIndex) => {
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day + 1 &&
            selectedDate.getMonth() === new Date().getMonth() &&
            selectedDate.getFullYear() === new Date().getFullYear();

          return (
            <button
              key={dayIndex}
              className={`w-10 h-10 text-center text-sm 
              ${isSelected ? "bg-blue-500 text-white" : ""}
               focus:outline-none`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    ));
  };

  return (
    <div className="w-full bg-white  rounded-lg shadow-lg p-4">
      {selectedDate ? (
        <input
          type="text"
          value={selectedDate?.toISOString().split("T")[0]}
          onChange={(e) => handleDateClick(new Date(e.target.value))}
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

      <div className="mb-4">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
