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

  const handleDateChange = (date) => {
    if (date) {
      // Ensure we're working with UTC dates
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setSelectedDate(utcDate);
      dispatch(calenderDate(utcDate.toISOString().split("T")[0]));
    } else {
      setSelectedDate(null);
      dispatch(calenderDate(null));
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
      dispatch(calenderDate(null));
    }
  };

  return (
    <div className="w-full bg-white  min-h-56   rounded-lg shadow-lg p-4">
      {/* {selectedDate ? (
        <input
          type="text"
          value={selectedDate?.toISOString().split("T")[0]}
          onChange={(e) => handleDateClick(new Date(e.target.value))}
          placeholder="Selected Date"
          readOnly
          className="w-full p-2 border rounded mb-4"
        />
      ) : ( */}
      <div className="relative flex w-[90%] p-2 border rounded">
        <DatePicker
          placeholderText="📆"
          ref={datePickerRef}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd-MM-yyyy"
           minDate={new Date()}
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

export default Calendar;
