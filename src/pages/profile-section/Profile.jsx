import React, { useEffect, useState } from "react";
import AddressDetails from "./components/AddressDetails";
import Travelers from "./components/Traveler";
import Bookings from "./components/Bookings";
import ProfileCard from "./components/ProfileCard";
import { IoPaperPlaneSharp } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { Helmet } from "react-helmet";

function Profile() {
  const [activeTab, setActiveTab] = useState("travelers");
  const [userData, setUserData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-profile`
        );
        if (response) {
          setUserData(response?.data);
        } else {
          console.log("");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col mt-16 h-[100%] min-h-screen bg-gray-100">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <div className="w-full h-96 bg-cover object-cover">
        <img
          src="https://images.pexels.com/photos/1450340/pexels-photo-1450340.jpeg?cs=srgb&dl=pexels-asadphoto-1450340.jpg&fm=jpg"
          className="w-full h-96 bg-cover"
          alt=""
        />
      </div>
      <div className="flex flex-col w-full px-5">
        <div className="w-full my-3 ">
          <ProfileCard user={userData} />
        </div>
        {/* Sidebar */}
        <div className="w-full h-full   flex-col flex lg:flex-row">
          <aside className="flex h-44  rounded-xl flex-col  w-full md:w-1/4 bg-white shadow-lg">
            <nav className="flex-grow p-4">
              <ul className="space-y-2">
                <li className="flex gap-1 items-center">
                  <IoPaperPlaneSharp
                    size={22}
                    color={activeTab === "travelers" ? "#3180CA" : "black"}
                  />
                  <button
                    className={`w-full text-left p-2 ${
                      activeTab === "travelers"
                        ? "text-blue-500 underline"
                        : "hover:text-gray-100"
                    }`}
                    onClick={() => setActiveTab("travelers")}
                  >
                    Traveler
                  </button>
                </li>
                <li className="flex gap-1 items-center">
                  <CiLocationOn
                    size={22}
                    color={activeTab === "addressDetails" ? "#3180CA" : "black"}
                  />
                  <button
                    className={`w-full text-left p-2 ${
                      activeTab === "addressDetails"
                        ? "text-blue-500 underline "
                        : "hover:text-gray-100"
                    }`}
                    onClick={() => setActiveTab("addressDetails")}
                  >
                    Address Details
                  </button>
                </li>

                <li className="flex gap-1 items-center">
                  <MdDateRange
                    size={22}
                    color={activeTab === "bookings" ? "#3180CA" : "black"}
                  />
                  <button
                    className={`w-full text-left p-2 ${
                      activeTab === "bookings"
                        ? "text-blue-500 underline"
                        : "hover:text-gray-100"
                    }`}
                    onClick={() => setActiveTab("bookings")}
                  >
                    Bookings
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="w-full h-[100%]  p-4">
            {activeTab === "addressDetails" && (
              <AddressDetails user={userData} />
            )}
            {activeTab === "travelers" && <Travelers user={userData} />}
            {activeTab === "bookings" && <Bookings user={userData} />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
