import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IoMdCalendar } from "react-icons/io";
import { MdOutlinePersonAdd } from "react-icons/md";
import { IoDocumentsSharp } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { coTraveler, PackageId } from "../../redux/actions/package-id-actions";
import { toast } from "react-toastify";

const PersonDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const countryId = useSelector((state) => state.CountryIdReducer.countryId);
  const [showCoTravler, setShowCoTravler] = useState();
  console.log(showCoTravler, "showCoTravler");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    passportNumber: "",
    dob: "",
    passportIssueDate: "",
    passportValidTill: "",
  });

  const handleFields = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchShowCoTraveler = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}place/${countryId}`
        );
        console.log(response?.data, "response daya");
        if (response) {
          setShowCoTravler(response?.data?.showCoTraveller);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchShowCoTraveler();
  }, []);

  const [importantPoints, setImportantPoints] = useState([]);
  const [packageData, setPackageData] = useState({});
  const selectedDate = useSelector((state) => state.CalenderReducer.visaDate);
  const travlersCount = useSelector(
    (state) => state.NumberOfTravelerReducer.travlersCount
  );
  const cotravlerId = useSelector(
    (state) => state.CotravelerIdReducer.cotravlerId
  );
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  console.log(
    packageId,
    travlersCount,
    "travlersCount",
    packageData?.orderDetails
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-visa-order/${packageId}`
        );
        console.log(response?.data, "response daya");
        if (response) {
          setPackageData(response?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handlefurtherTravler = () => {};

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}notes`);
        console.log(response);
        if (response) {
          const filtered = response?.data?.filter(
            (item) => item.type === "Personal Details"
          );
          console.log(filtered, "filtered");

          setImportantPoints(filtered);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {
    console.log("try enter");

    if (formData.dob && formData.passportIssueDate) {
      console.log("enter");
      calculatePassportValidity(formData.dob, formData.passportIssueDate);
    }
  }, [formData]);

  const calculatePassportValidity = (dob, issueDate) => {
    const dobDate = new Date(dob);
    const issueDateObj = new Date(issueDate);
    const currentDate = new Date();

    // Assuming passport is valid for 10 years from issue date
    const validityPeriod = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
    const validityDate = new Date(issueDateObj.getTime() + validityPeriod);

    if (validityDate < dobDate) {
      toast.error("Passport expiry date is earlier than date of birth.");
      return "";
    }

    if (validityDate < currentDate) {
      toast.error("Passport has expired.");
      return "";
    }

    setFormData((prevData) => ({
      ...prevData,
      passportValidTill: validityDate.toISOString().slice(0, 10),
    }));

    return validityDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  };

  const validatePassportDetails = () => {
    const { passportNumber, passportIssueDate, dob } = formData;

    // Regex pattern for passport number validation
    // This example assumes passport numbers are alphanumeric and between 6 and 9 characters
    const passportNumberRegex = /^[A-Z0-9]{6,9}$/;

    // Passport number validation
    if (!passportNumberRegex.test(passportNumber)) {
      toast.error("Invalid passport number.");
      return false;
    }

    // Calculate and set passportValidTill date
    const passportValidTillDate = calculatePassportValidity(
      dob,
      passportIssueDate
    );
    if (!passportValidTillDate) {
      return false;
    }

    setFormData((prevData) => ({
      ...prevData,
      passportValidTill: passportValidTillDate,
    }));

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassportDetails()) {
      return;
    }

    console.log("hhh");
    if (packageData?.orderDetails === travlersCount) {
      try {
        const response = await fetchDataFromAPI(
          "PUT",
          `${BASE_URL}edit-order-details/${cotravlerId}`,
          { ...formData, detailsFulfilled: true }
        );
        console.log(response);
        if (response) {
          console.log(response);
          navigate("/edit-visa-request");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await fetchDataFromAPI(
          "PUT",
          `${BASE_URL}edit-order-details/${cotravlerId}`,
          { ...formData, detailsFulfilled: true }
        );
        console.log(response);
        if (response) {
          try {
            const response = await fetchDataFromAPI(
              "POST",
              `${BASE_URL}add-order-details`,
              { visaOrder: packageId }
            );
            console.log(response.data._id, "responsecotravler");
            if (response) {
              console.log();
              dispatch(coTraveler(response?.data?._id));
            }
          } catch (error) {
            console.log(error);
          }
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
      window.location.href = "/upload-image";
      // navigate("/upload-image");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row px-3 justify-center items-center py-10 min-h-screen sm:bg-gray-200 bg-white ">
      <div className=" lg:w-[70%] w-full flex h-full mx-5 border-gray-300 border py-2 bg-white justify-center items-center ">
        <div className="bg-white p-8 px-10  rounded-lg  w-full max-w-2xl">
          {/* Visa Validity */}
          <div className="flex flex-col justify-between items-center mb-5">
            <button className="bg-orange-500 text-xl font-bold text-white py-3 mt-5 px-10 rounded-[25px]">
              View on {new Date(packageData?.visaOrder?.from).toDateString()}
            </button>
            <h1 className="text-lg font-semibold">Review your information</h1>
          </div>

          <div className=" p-4 flex flex-col rounded-lg mb-4">
            <button className="text-xl py-2 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
              <IoMdCalendar size={25} color="white" /> VISA Validity
            </button>
            <div className="flex relative justify-between mt-2">
              <div className="flex flex-col px-5 gap-2">
                <span>From</span>
                <input
                  type="date"
                  className="bg-white text-black rounded-md "
                  defaultValue={packageData?.visaOrder?.from?.slice(0, 10)}
                  disabled
                />
              </div>
              <img
                src="https://i.pinimg.com/originals/8d/d0/25/8dd0251b583a044fa7f5c40c9c978d06.png"
                className="w-44 hidden lg:block absolute right-48 top-[-48px] "
                alt=""
              />
              <div className="flex flex-col gap-2">
                <span>Until</span>
                <input
                  type="date"
                  className="bg-white text-black rounded-md "
                  defaultValue={packageData?.visaOrder?.to?.slice(0, 10)}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}

          <button className="text-xl  py-2 w-[95%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
            <MdOutlinePersonAdd size={25} color="white" />
            Personal Information
          </button>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 mb-4">
              <div>
                <label className="block text-sm font-semibold">
                  First Name
                </label>
                <input
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Last Name</label>
                <input
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Fathers Name
                </label>
                <input
                  name="fatherName"
                  required
                  value={formData.fatherName}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Mothers Name
                </label>
                <input
                  name="motherName"
                  required
                  value={formData.motherName}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Gender</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Passport Number
                </label>
                <input
                  name="passportNumber"
                  required
                  value={formData.passportNumber}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={formData.dob}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Passport Issued On
                </label>
                <input
                  type="date"
                  name="passportIssueDate"
                  required
                  value={formData.passportIssueDate}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Passport Valid Till
                </label>
                <input
                  type="date"
                  name="passportValidTill"
                  required
                  value={formData.passportValidTill}
                  onChange={handleFields}
                  className="w-full p-2 border rounded-lg"
                  readOnly
                />
              </div>
            </div>
            {/* Documents Submitted */}
            {/* <button className="text-xl  py-3 w-[95%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
              <IoDocumentsSharp size={25} color="white" />
              Documents Submitted
            </button> */}
            {/* <div className="flex justify-between md:px-10 mb-4 ">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  className="md:w-24 md:h-24 w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  className="md:w-24 md:h-24 w-20 h-20 object-cover rounded-lg"
                />
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  className="md:w-24 md:h-24 w-20 h-20 object-cover rounded-lg"
                />
              </div>
            </div> */}
            {/* <div className="my-6 w-full flex justify-center items-center">
              <input
                {...register("Name")}
                defaultValue="Name"
                className="w-[70%] font-semibold text-2xl p-4 border rounded-[25px]"
              />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </div> */}
            {/* Co-Traveller */}
            {showCoTravler && (
              <>
                <div className=" text-black p-4 flex justify-start font-bold  items-center mb-4">
                  <h2 className="text-2xl font-semibold">Co-Traveller</h2>
                </div>
                <div className="w-full flex justify-center items-center">
                  <div className="flex flex-col  w-full py-4 border-gray-200 border rounded-xl  md:w-[60%] shadow-md shadow-gray-200 items-center mb-8">
                    <p className="text-lg font-semibold mb-4">
                      By adding another traveller /-
                    </p>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                      {" "}
                    </button>
                    <RxPerson size={100} color="orange" />

                    {/* <button
                      onClick={handleCotraveler}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    >
                      Add Co-Traveller
                    </button> */}
                  </div>
                </div>
              </>
            )}
            {/* Proceed to Checkout */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
              >
                {packageData?.orderDetails === travlersCount
                  ? "Proceed to Checkout"
                  : `Add Traveler ${
                      packageData?.orderDetails + 1
                    }/${travlersCount}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex w-full mt-10 flex-col md:w-[30%] bg-white sm:bg-gray-200 h-full justify-start  md:flex-col">
        <div className="self-start p-4 rounded-lg mb-4 md:mb-0">
          {importantPoints?.map((item) => {
            return (
              <>
                <div className="bg-white h-auto p-4 mb-4 rounded-xl">
                  <h2 className="text-xl flex gap-3 font-semibold mb-4">
                    <img src={item?.image} className="w-10 h-10" alt="" />
                    {item?.heading}
                  </h2>
                  <p className="text-gray-600 mb-4">{item?.description}</p>
                  {/* <ul className="text-left space-y-2">
              <li>✔️ Position your head in the oval</li>
              <li>✔️ Make sure you're in a well-lit area</li>
              <li>✔️ Remove glasses</li>
              <li>✔️ Avoid glares and blurs</li>
            </ul> */}
                </div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
