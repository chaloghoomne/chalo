// src/components/LatestBookings.js
import React, { useEffect, useState } from "react";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL } from "../../../api-integration/urlsVariable";
import { useDispatch } from "react-redux";
import {
  coTraveler,
  getVisaType,
  PackageId,
} from "../../../redux/actions/package-id-actions";
import { numberofCoTravelers } from "../../../redux/actions/numberoftravelers-actions";
import { useNavigate } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const user = localStorage.getItem("userId");
        console.log(user)
        const response = await fetchDataFromAPI(
          "POST",
          `${BASE_URL}user-visa-orders`,{user:user}
        );
        if (response) {
          console.log(response.data);
          setBookings(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  const handleBooking = async (id, travlerscount, cotravlerId, visaType) => {
    dispatch(PackageId(id));
    dispatch(getVisaType(visaType));
    dispatch(coTraveler(cotravlerId));
    dispatch(numberofCoTravelers(travlerscount));
    navigate("/persons-details");
  };

  const handleSubmitApplication = async (
    id,
    travlerscount,
    cotravlerId,
    visaType
  ) => {
    dispatch(PackageId(id));
    dispatch(getVisaType(visaType));
    dispatch(coTraveler(cotravlerId));
    dispatch(numberofCoTravelers(travlerscount));
    navigate("/edit-visa-request");
  };

  const viewApplication = async (id, travlerscount, cotravlerId, visaType) => {
    dispatch(PackageId(id));
    dispatch(getVisaType(visaType));
    dispatch(coTraveler(cotravlerId));
    dispatch(numberofCoTravelers(travlerscount));
    navigate("/view-application");
  };

  return (
    <div className="md:p-4 p-1">
      <div className="bg-white md:p-4 p-1 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Latest Bookings</h2>
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search by Booking ID"
              className="border border-gray-300 w-44 sm:w-auto rounded p-2 pl-10"
            />
            <span className="absolute left-0 top-0 mt-2 ml-2 text-gray-500">
              <i className="fas fa-search"></i>
            </span>
          </div> */}
        </div>
        <div className="flex flex-wrap  justify-evenly gap-4">
          {bookings?.map((booking, index) => (
            <div
              key={index}
              className="bg-gray-100 md:min-w-[420px] relative md:p-4 p-3 rounded shadow-md flex flex-col"
            >
              <div className="w-full flex items-center gap-1">
                <img
                  // src={booking?.visaCategory?.image}
                  src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZsL6PVn0SNiabAKz7js0QknS2ilJam19QQ&s"
                  alt="Visa"
                  className="w-24 h-24 rounded object-cover mr-4"
                />
                <div className="flex flex-col ">
                  <h4 className="text-md mt-5 sm:top-0 font-medium">
                    {booking?.country}{" "}
                    <p className="text-sm text-gray-600">ID: {booking?._id}</p>
                  </h4>
                  <div className="flex w-full">
                    <div className="flex md:flex-row flex-col gap-3  ">
                      <p className="text-sm flex flex-col  text-gray-600">
                        From:
                        <span className="text-xs">
                          {booking?.from ? booking.from.slice(0, 10) : "N/A"}
                        </span>
                      </p>
                      <p className="text-sm flex flex-col text-gray-600">
                        To:
                        <span className="text-xs">
                          {booking?.to ? booking.to.slice(0, 10) : "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Booking Status:
                        {booking?.status === "pending" && (
                          <span className="text-xs text-yellow-400">
                            {booking?.status}
                          </span>
                        )}
                        {booking?.status === "sent-to-immigration" && (
                          <span className="text-xs text-orange-400">
                            in-process
                          </span>
                        )}
                        {booking?.status === "approved" && (
                          <span className="text-xs text-green-400">
                            {booking?.status}
                          </span>
                        )}
                        {booking?.status === "rejected" && (
                          <span className="text-xs text-red-400">
                            {booking?.status}
                          </span>
                        )}
                        {booking?.status === "blacklist" && (
                          <span className="text-xs text-gray-700">
                            {booking?.status}
                          </span>
                        )}
                        {booking?.status === "sent-back" && (
                          <span className="text-xs text-red-700">rejected</span>
                        )}
                      </p>
                    </div>

                    {booking?.documentFulfillmentStatus &&
                    booking?.isSubmitted ? (
                      <button
                        onClick={() =>
                          viewApplication(
                            booking?._id,
                            booking?.travellersCount,
                            booking?.latestOrderDetailsId,
                            booking?.tourType?.name
                          )
                        }
                        className="text-blue-500 text-sm absolute right-2 top-2 px-3 py-1 rounded "
                      >
                        Application Submitted
                      </button>
                    ) : (
                      <>
                        {booking?.documentFulfillmentStatus ? (
                          <button
                            onClick={() =>
                              handleSubmitApplication(
                                booking?._id,
                                booking?.travellersCount,
                                booking?.latestOrderDetailsId,
                                booking?.tourType?.name
                              )
                            }
                            className="bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]  text-white  px-3 py-1 text-xs rounded-[25px] absolute right-2 top-2  "
                          >
                            Make Payment
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleBooking(
                                booking?._id,
                                booking?.travellersCount,
                                booking?.latestOrderDetailsId,
                                booking?.tourType?.name
                              )
                            }
                            className="bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]  text-white  px-3 py-1 text-xs rounded-[25px] absolute right-2 top-2  "
                          >
                            Complete Application
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* <button className=" absolute md:right-2   bottom-2 bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]  text-white  px-3 py-1 text-xs rounded-[25px]">
                  Make Payment
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
