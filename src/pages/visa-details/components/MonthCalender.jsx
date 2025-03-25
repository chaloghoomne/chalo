import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Calendar } from "primereact/calendar";
import {
	calenderDate,
	returnCalenderDate,
} from "../../../redux/actions/calender-date-action";
import { FloatLabel } from "primereact/floatlabel";
import "primereact/resources/themes/lara-light-cyan/theme.css";
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

const MonthCalender = ({ onClose }) => {
	const dispatch = useDispatch();

	// Local state to temporarily store selected dates
	const [dateRange, setDateRange] = useState([]);

	// Handle date selection
	const handleDateSelection = (e) => {
		console.log("Selected Date Range:", e.value)
		setDateRange(e.value);
	};

	// Handle Proceed button
	const proceedFunc = () => {
		if (!dateRange || dateRange.length !== 2) {
			toast.error("Please select both Travel and Return Dates");
			return;
		}
		console.log(dateRange)
		const formattedVisaDate = dateRange[0].toISOString().split("T")[0]; // First date
		const formattedReturnDate = dateRange[1].toISOString().split("T")[0]; // Second date

		console.log("Dispatching Visa Date:", formattedVisaDate);
		console.log("Dispatching Return Date:", formattedReturnDate);

		// Dispatch dates to Redux
		dispatch(calenderDate(format(formattedVisaDate, "yyyy-MM-dd")));
		dispatch(returnCalenderDate(format(formattedReturnDate, "yyyy-MM-dd")));

		// Close the calendar
		onClose();
	};

	return (
		<div className="   rounded-lg object-fill overflow-auto shadow-lg">
			{/* Date Picker */}
			<div className=" bottom-2 rounded-lg">
				{/* <FloatLabel>
          <Calendar
            value={dateRange}
            onChange={handleDateSelection}
            selectionMode="range"
            variant="filled"
            className="w-full h-10"
          />
          <label htmlFor="travel_date">Select Travel & Return Dates</label>
        </FloatLabel> */}
				<Calendar
					value={dateRange}
					onChange={handleDateSelection}
					selectionMode="range"
					inline
					className=" "  
					// style={{ maxWidth: "450px", fontSize: "10px", padding: "8px" }}
				/>
			</div>


			{/* Proceed Button */}
			<button
				onClick={proceedFunc}
				className="w-full bg-blue-500 text-white py-2 rounded-full"
			>
				Proceed to Application
			</button>
		</div>
	);
};

export default MonthCalender;
