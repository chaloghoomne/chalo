import React, { useState } from "react";
import Calendar from "./Calender";
import { calenderDate } from "../../../redux/actions/calender-date-action";
import { useDispatch, useSelector } from "react-redux";
import { CalenderReducer } from "./../../../redux/reducers/calender-date-reducer";
import { toast } from "react-toastify";
import ReturnCalender from "./ReturnCalendar";

const MonthCalender = ({ onClose }) => {
  const visaDate = useSelector((state) => state.CalenderReducer.visaDate);
  const returnDate = useSelector(
    (state) => state.ReturnCalenderReducer.returnDate
  );
  console.log(visaDate, "vsaDate");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFixed, setIsFixed] = useState(true);
  const dispatch = useDispatch();
  const months = [
    { name: "Sept", year: 2024 },
    { name: "Oct", year: 2024 },
    { name: "Nov", year: 2024 },
    { name: "Dec", year: 2024 },
    { name: "Jan", year: 2025 },
    { name: "Feb", year: 2025 },
    { name: "Mar", year: 2025 },
    { name: "Apr", year: 2025 },
    { name: "May", year: 2025 },
    { name: "June", year: 2025 },
    { name: "July", year: 2025 },
    { name: "Aug", year: 2025 },
  ];

  const handleMonthClick = (month, year) => {
    setSelectedDate(`${month} ${year}`);
    dispatch(calenderDate(`${month} ${year}`));
  };

  console.log(selectedDate, "sdfghjk", ` 2024 Sept `);

  const renderMonthCards = () => {
    return (
      <div className="grid grid-cols-3 gap-4">
        {months.map((month, index) => (
          <button
            key={index}
            className={`p-4 border ${
              selectedDate === `${month.year} ${month.name}`
                ? "bg-blue-400"
                : ""
            } rounded-lg shadow-md flex flex-col items-center`}
            onClick={() =>
              // handleMonthClick(`${new Date().getFullYear()}`, month.name)
              handleMonthClick(`${month.year}`, month.name)
            }
          >
            <svg
              className="w-8 h-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {month.name} {month.year}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const handleflexible = (value) => {
    setSelectedDate(value);
    dispatch(calenderDate(value));
  };

  const proceedFunc = () => {
    if (visaDate && returnDate) {
      onClose();
    } else {
      toast.error("First Select Travel and Return  Date");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg max-h-[500px] overflow-auto shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Select your departure date</h2>
      <div className="flex gap-5 mb-4">
        <button
          className={`flex-1 py-2 text-center rounded-lg ${
            isFixed ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsFixed(true)}
        >
          Travel Date
        </button>
        <button
          className={`flex-1 py-2 text-center rounded-lg ${
            !isFixed ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setIsFixed(false)}
        >
          Return Date
        </button>
      </div>
      {/* {!isFixed && (
        <input
          type="text"
          value={selectedDate}
          readOnly
          onChange={(e) => handleflexible(e.target.value)}
          placeholder="Selected Date"
          className="w-full p-2 border rounded mb-4"
        />
      )} */}
      <div className="mb-4 ">{isFixed ? <Calendar /> : <ReturnCalender />}</div>
      <button
        onClick={() => proceedFunc()}
        className="w-full bg-blue-500 text-white py-2 rounded-lg"
      >
        Proceed to Application
      </button>
    </div>
  );
};

export default MonthCalender;
