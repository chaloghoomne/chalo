import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
} from "date-fns";
import "./style.css"
import {
  calenderDate,
  returnCalenderDate,
} from "../../../redux/actions/calender-date-action";

const ReturnCalender = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const travelDate = useSelector((state) => state.CalenderReducer.visaDate);
  const returnDate = useSelector((state) => state.ReturnCalenderReducer.returnDate);

 

  const dispatch = useDispatch();
  

  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = format(day, "yyyy-MM-dd");
      setSelectedDate(clickedDate);
    dispatch(returnCalenderDate(clickedDate));
  };

  const isDateInRange = (date) => {
    if (!travelDate || !returnDate) return false;
    
    return isWithinInterval(date, {
      start: parseISO(travelDate),
      end: parseISO(returnDate)
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
    <div className="w-full bg-white min-h-56 rounded-lg shadow-lg px-4">
     <div className="relative flex w-[90%] flex-col gap-2 p-2 border rounded">
       
       <input type="text"
       value={selectedDate || returnDate}
       className="w-[90%] border border-black rounded-lg text-black p-2" />
       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
     <div className="calendar">
       <div>
         <div
           className="header"
           style={{
             textAlign: "start",
           }}
         >
           Calendar
         </div>
         <div className="divider"></div>
       </div>
       <div className="nav-buttons">
         <div className="month">{format(currentDate, "MMMM yyyy")}</div>
         <div
           style={{
             display: "flex",
             gap: "10px",
           }}
         >
           <div className="nav-button" onClick={handlePrevMonth}>
             &lt; Prev
           </div>
           <div className="nav-button" onClick={handleNextMonth}>
             Next &gt;
           </div>
         </div>
       </div>

       <div className="days">
       {/* {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium p-2">
                  {day}
                </div>
              ))} */}
         {daysInMonth.map((day) => {
           const formattedDate = format(day, "yyyy-MM-dd");
           const disabled = isDateDisabled(day);
           const inRange = isDateInRange(day);
           return (
             <div
               title=""
               key={day.toISOString()}
               className={`day  ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-100'}
                      ${inRange ? 'bg-blue-100' : ''}
                      ${returnDate === formattedDate ? 'selected' : ''}
                      ${travelDate === formattedDate ? 'bg-blue-500 text-white' : ''} ${
                 isSameMonth(day, currentDate) ? "current-month" : ""
               }`}
               onClick={() => handleDateClick(day)}
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

export default ReturnCalender;
