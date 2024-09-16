import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  calenderDate,
  returnCalenderDate,
} from "../../../redux/actions/calender-date-action";

const ReturnCalender = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const visaDate = useSelector((state) => state.CalenderReducer.visaDate);
  const [startDate, setStartDate] = useState("");
  const datePickerRef = useRef(null);
  ``;
  const dispatch = useDispatch();
  const minDate = visaDate ? new Date(visaDate) : null;
  const handleDateClick = (day) => {
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      day + 1
    );
    setSelectedDate(date);
    dispatch(returnCalenderDate(date.toISOString().split("T")[0]));
  };

  const handleDateChange = (date) => {
    if (date) {
      // Ensure we're working with UTC dates
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setSelectedDate(utcDate);
      dispatch(returnCalenderDate(utcDate.toISOString().split("T")[0]));
    } else {
      setSelectedDate(null);
      dispatch(returnCalenderDate(null));
    }
  };

  const handleInputChange = (e) => {
    const inputDate = e.target.value;
    const parsedDate = new Date(inputDate);

    if (!isNaN(parsedDate.getTime())) {
      // Valid date
      handleDateChange(parsedDate);
    } else {
      // Invalid date, you might want to show an error message here
      setSelectedDate(null);
      dispatch(returnCalenderDate(null));
    }
  };

  const handlefixed = (value) => {
    if (minDate && value < minDate) {
      value = minDate;
    }
    setStartDate(value);
    setSelectedDate(value);
    dispatch(returnCalenderDate(value.toISOString().split("T")[0]));
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
    <div className="w-full bg-white min-h-56 rounded-lg shadow-lg p-4">
      {/* {selectedDate ? (
        <input
          type="text"
          readOnly
          value={selectedDate?.toISOString().split("T")[0]}
          onChange={(e) => handleDateClick(new Date(e.target.value))}
          placeholder="Selected Date"
          className="w-full p-2 border rounded mb-4"
        />
      ) : ( */}
      <div className="relative flex w-[90%] p-2 border rounded">
        <DatePicker
          placeholderText="📆"
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          minDate={minDate}
          dateFormat="yyyy-MM-dd"
          customInput={
            <input
              type="text"
              value={
                selectedDate ? selectedDate.toISOString().split("T")[0] : ""
              }
              onChange={handleInputChange}
              className="w-full"
            />
          }
        />
      </div>
      {/* )} */}

      {/* <div className="mb-4">{renderCalendar()}</div> */}
    </div>
  );
};

export default ReturnCalender;
