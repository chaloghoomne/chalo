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
import ImageUpload from "../upload-image/ImageUpload";
import { Helmet } from "react-helmet";

const PersonDetails = () => {
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const buttonShow = useSelector((state)=>state.ShowButtonReducer.buttonShow)
  const countryId = useSelector((state) => state.CountryIdReducer.countryId);
  const childId = useSelector((state) => state.ChildSHowIdReducer.childId);
  const [showCoTravler, setShowCoTravler] = useState();
   const [childData,setChildData] = useState()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    ageGroup:"",
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
   
        if (response) {
          setShowCoTravler(response?.data?.showCoTraveller);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchShowCoTraveler();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}visa-category/${childId}`
        );
        if (response) {
          setChildData(response.data);
         
        }
      } catch (error) {
        console.log(error);
      }
     
    };
    fetchProfileImage();
  }, [childId]);


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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-visa-order/${packageId}`
        );
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
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}notes-by-package/${countryId}`
        );
        if (response) {
          const filtered = response?.data?.filter(
            (item) => item.type === "Personal Details"
          );

          setImportantPoints(filtered);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  useEffect(() => {

    if (formData.dob && formData.passportIssueDate) {
      calculatePassportValidity(formData.dob, formData.passportIssueDate);
    }
  }, [formData.dob, formData.passportIssueDate]);

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
      toast.error(`All Fields are Required`)
      return;
    }

    // const kuchaayega = save();
    // console.log(kuchaayega, "kuchaayega");
    // if (kuchaayega) {
      if (packageData?.orderDetails === travlersCount) {
        try {
          const response = await fetchDataFromAPI(
            "PUT",
            `${BASE_URL}edit-order-details/${cotravlerId}`,
            { ...formData, detailsFulfilled: true }
          );
          if (response) {
            navigate("/edit-visa-request");
          }
        } catch (error) {
          console.log(error);
          toast.error("Network error! Try again Later");
        }
      } else {
        try {
          const response = await fetchDataFromAPI(
            "PUT",
            `${BASE_URL}edit-order-details/${cotravlerId}`,
            { ...formData, detailsFulfilled: true }
          );
          if (response) {
            try {
              const response = await fetchDataFromAPI(
                "POST",
                `${BASE_URL}add-order-details`,
                { visaOrder: packageId }
              );
              if (response) {
                dispatch(coTraveler(response?.data?._id));
              }
            } catch (error) {
              console.log(error);
            }
          }
        } catch (error) {
          toast.error("Network error! Try again Later");
        }
        window.location.href = "/persons-details";
        // navigate("/upload-image");
      }
  };

 

  return (
    <div className="flex flex-col lg:flex-row px-3 justify-center items-center pt-20 min-h-screen  bg-white">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <div className=" lg:w-full w-full flex h-full rounded-lg mx-5 border-gray-300 mx-auto container py-2 bg-white justify-center items-center w-[90%] mx-[5%]  ">
        <div className="bg-white pt-12  px-3 sm:px-10 rounded-lg  w-full ">
          {/* Visa Validity */}
          <div className="flex flex-col justify-between items-center mb-5">
            <button className="bg-orange-500 text-xl font-bold text-white py-3 mt-5 px-10 rounded-[25px]">
              View on {new Date(packageData?.visaOrder?.from).toDateString()}
            </button>
            {/* <h1 className="text-lg font-semibold">Review your information</h1> */}
            <h1 className="text-xl poppins-four mt-3 text-center self-center text-orange-500 ">
            {`Traveler Information: Applicant #${packageData?.orderDetails} of ${travlersCount}`}
          </h1>
          </div>

          <div className=" p-4 relative flex flex-col w-full rounded-lg mb-4">
            <button className="text-xl z-30 w-full py-2 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
              <IoMdCalendar size={25} color="white" /> Traveller Information
            </button>
            <div className="flex relative justify-between mt-2">
              <div className="flex flex-col px-5 gap-2">
                <span>Travel Date</span>
                <input
                  type="date"
                  className="bg-white text-black rounded-md "
                  defaultValue={packageData?.visaOrder?.from?.slice(0, 10)}
                  disabled
                />
              </div>
              <div>
              <img
                src="https://t3.ftcdn.net/jpg/05/69/35/72/360_F_569357280_YSngXd8RPso9rI1D3YxakFBAnfVgxkwn.jpg"
                className="w-[290px] z-0 hidden lg:block absolute right-[40%] top-[-45px] "
                alt=""
              /></div>
              <div className="flex flex-col gap-2">
                <span>Return Date</span>
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
          <div className=" px-4 relative flex flex-col w-full rounded-lg my-4">
          <button className="text-xl z-30 py-2 w-full rounded-2xl px-5   flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
            <MdOutlinePersonAdd size={25} color="white" />
            Personal Information
          </button>
</div>
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
  <label className="block text-sm font-semibold">Age Group</label>
  <select
    name="ageGroup"
    required
    value={formData.ageGroup}
    onChange={handleFields}
    className="w-full p-2 border rounded-lg"
  >
    <option value="">Select Age Group</option>
    {childData?.childPrice >0 && <option value="Child">Under 18</option>}
   <option value="Adult">18 and Over</option>
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
                  max={new Date().toISOString().split('T')[0]}
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
           

            <ImageUpload  />
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
             { buttonShow && <button
                type="submit"
                className="bg-[#F26438] text-white py-2 px-8 mt-12 text-lg poppins-three rounded-full"
              >
                {packageData?.orderDetails === travlersCount
                  ? "Proceed to Checkout"
                  : `Add Traveler ${
                      packageData?.orderDetails + 1
                    }/${travlersCount}`}
              </button>}
            </div>
          </form>
        </div>
      </div>

      {/* <div className="flex w-full mt-10 flex-col md:w-[30%] bg-white sm:bg-gray-200 h-full justify-start  md:flex-col">
        <div className="self-start p-4 rounded-lg gap-5 mb-4 md:mb-0">
          {importantPoints?.map((item) => {
            return (
              <>

                <div className="bg-white h-auto mb-5 p-4 rounded-xl">

                  <h2 className="text-xl flex gap-3 font-semibold mb-4">
                    <img src={item?.image} className="w-10 h-10" alt="" />
                    {item?.heading}
                  </h2>
                  <p className="text-gray-600 mb-4">{item?.description}</p>
                 
                </div>
              </>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};

export default PersonDetails;
