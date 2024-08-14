import React, { useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import HorizontalLinearAlternativeLabelStepper from "./components/Step";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { coTraveler } from "../../redux/actions/package-id-actions";
import PersonDetails from "../persons-details/PersonsDetails";

const ImageUpload = () => {
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  console.log(packageId);
  const cotravlerId = useSelector(
    (state) => state.CotravelerIdReducer.cotravlerId
  );
  const travlersCount = useSelector(
    (state) => state.NumberOfTravelerReducer.travlersCount
  );
  console.log(packageId, "packageId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selfie, setSelfie] = useState(null);
  const [passportFront, setPassportFront] = useState(null);
  const [passportBack, setPassportBack] = useState(null);
  const [additional, setAdditional] = useState(null);
  const [packageData, setPackageData] = useState();

  // const [imageSrc, setImageSrc] = useState({
  //   selfie: null,
  //   front: null,
  //   back: null,
  //   additional: null,
  // });

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [important, setImportantPoints] = useState();
  const [step, setStep] = useState(0);
  const webcamRef = React.useRef(null);

  // const capture = useCallback(() => {
  //   console.log(webcamRef, "webcamRef");
  //   console.log(webcamRef.current, "webcamRef.current");
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setImageSrc((prev) => ({ ...prev, [currentField]: imageSrc }));
  //   setIsCameraOpen(false);
  //   uploadImage(imageSrc, currentField);
  // }, [webcamRef, currentField]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}order-detail/${cotravlerId}`
        );
        console.log(response, "response daya");
        if (response) {
          setPassportFront(response?.data?.passportFront);
          setPassportBack(response?.data?.passportBack);
          setSelfie(response?.data?.selfie);
          setAdditional(response?.data?.additional);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];

    if (file) {
      if (field === "selfie") {
        setSelfie(file);
        uploadSelfie(file);
      }
      if (field === "passportBack") {
        setPassportBack(file);
        uploadImage(field, file);
      }
      if (field === "passportFront") {
        setPassportFront(file);
        uploadImage(field, file);
      }
      if (field === "additional") {
        setAdditional(file);
        uploadImage(field, file);
      }
      if (field === "selfie") {
        handlestep(1);
      }

      if (field === "passportFront") {
        handlestep(2);
      }
      if (field === "passportBack") {
        handlestep(3);
      }
      if (field === "additional") {
        handlestep(4);
      }
    }
  };

  useEffect(() => {
    if (additional) {
      handlestep(4);
    }
  }, [additional]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}notes`);
        console.log(response);
        if (response) {
          const filtered = response?.data?.filter(
            (item) => item.type === "Image"
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

  const uploadImage = async (field, file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append(`${field}`, file);
    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-order-details/${cotravlerId}`,
        formData
      );
      console.log(response);
      if (response) {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const uploadSelfie = async (imageSrc) => {
    console.log(imageSrc, "image");
    const formData = new FormData();
    formData.append("selfie", imageSrc);
    formData.append("visaOrder", packageId);
    setUploading(true);
    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-order-details/${cotravlerId}`,
        formData
      );
      console.log(response.data._id, "responsecotravler");
      if (response) {
        console.log("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handlestep = (value) => {
    setStep(value);
  };

  const handleRedirect = () => {
    navigate("/persons-details");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row pb-5 pt-20   h-auto bg-white p-4">
        <div className="flex w-full flex-col md:hidden md:w-[27%] md:min-h-full bg-gray-200 h-full justify-between md:flex-col">
          {important?.map((item) => {
            return (
              <>
                <div className="flex-1 p-4 rounded-lg mb-4 md:mb-0">
                  <div className="bg-white h-auto p-4 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">
                      {item?.heading}
                    </h2>
                    <p className="text-gray-600 mb-4">{item?.description}</p>
                    <ul className="text-left space-y-2">
                      {item?.points?.map((item) => {
                        return (
                          <>
                            <li>✔️ {item}</li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </>
            );
          })}
          {/* <div className="flex-1 p-4 md:pl-0 md:py-4 md:pr-4 rounded-lg ml-0 md:ml-4">
            <div className="bg-white h-auto p-4 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">User Detail</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-32 font-semibold">Name:</span>
                  <span className="text-gray-600">John Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Fathers Name:</span>
                  <span className="text-gray-600">Robert Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Mothers Name:</span>
                  <span className="text-gray-600">Jane Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Passport No.:</span>
                  <span className="text-gray-600">A12345678</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Issue Date:</span>
                  <span className="text-gray-600">01/01/2020</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Expiry Date:</span>
                  <span className="text-gray-600">01/01/2030</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">DOB:</span>
                  <span className="text-gray-600">01/01/1990</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="flex flex-col self-center w-[73%]">
          <h1 className="text-xl poppins-four text-center self-center text-orange-500 ">
            {`Traveler Information: Applicant #${packageData?.orderDetails} of ${travlersCount}`}
          </h1>
          <div className="bg-white p-8 rounded-lg flex flex-col justify-center items-center  w-full max-w-6xl">
            <HorizontalLinearAlternativeLabelStepper value={step} />

            {/* Step Indicator */}
            {/* <div className="flex justify-between mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">1</div>
            <span className="ml-2"></span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">2</div>
            <span className="ml-2"></span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">3</div>
            <span className="ml-2"></span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white">4</div>
            <span className="ml-2"></span>
          </div>
        </div> */}

            {/* Document Upload Sections */}
            <div className="flex flex-wrap flex-col md:flex-row  mb-8">
              {/* Selfie */}
              <div className="  flex flex-col min-w-52 items-center mb-4 md:mb-0">
                <h1 className="text-sm font-semibold mb-4">Upload Photo</h1>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  {selfie ? (
                    <img
                      src={` ${
                        typeof selfie === "string"
                          ? selfie
                          : URL.createObjectURL(selfie)
                      }`}
                      alt="passport front"
                      className="w-24 h-24 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      className="w-24 h-24 object-cover rounded-lg"
                      onChange={(e) => handleFileChange(e, "selfie")}
                    />
                  )}
                </div>
                {uploading && currentField === "selfie" && (
                  <div>Uploading...</div>
                )}
                <ul className="text-start mb-4 space-y-2">
                  <li>✅ A well lit area</li>
                  <li>✅ Remove glasses</li>
                </ul>
              </div>

              {/* Passport Front */}
              <div className="min-w-52 flex flex-col items-center mb-4 md:mb-0">
                <h1 className="text-sm font-semibold mb-4">
                  Front page of your Passport ID
                </h1>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  {passportFront ? (
                    <img
                      src={` ${
                        typeof passportFront === "string"
                          ? passportFront
                          : URL.createObjectURL(passportFront)
                      }`}
                      alt="passport front"
                      className="w-24 h-24 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!selfie}
                      className="w-24 h-24 object-cover rounded-lg"
                      onChange={(e) => handleFileChange(e, "passportFront")}
                    />
                  )}
                </div>
                <ul className="text-start mb-4 space-y-2">
                  <li>✅ A well lit area</li>
                  <li>✅ Remove glasses</li>
                </ul>
                {uploading && currentField === "front" && (
                  <div>Uploading...</div>
                )}
              </div>

              {/* Passport Back */}
              <div className="min-w-52 flex flex-col items-center mb-4 md:mb-0">
                <h1 className="text-sm font-semibold mb-4">
                  Back page of your Passport ID
                </h1>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  {passportBack ? (
                    <img
                      src={`${
                        typeof passportBack === "string"
                          ? passportBack
                          : URL.createObjectURL(passportBack)
                      }`}
                      alt="passport back"
                      className="w-24 h-24 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      disabled={!passportFront}
                      className="w-24 h-24 object-cover rounded-lg"
                      onChange={(e) => handleFileChange(e, "passportBack")}
                    />
                  )}
                </div>
                {uploading && currentField === "back" && (
                  <div>Uploading...</div>
                )}
                <ul className="text-start mb-4 space-y-2">
                  <li>✅ A well lit area</li>
                  <li>✅ Remove glasses</li>
                </ul>
              </div>

              {/* Additional Documents */}
              <div className="min-w-52 flex flex-col items-center mb-4 md:mb-0">
                <h1 className="text-sm font-semibold mb-4">
                  Upload Additional Documents
                </h1>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                  {additional ? (
                    <img
                      src={`${
                        typeof additional === "string"
                          ? additional
                          : URL.createObjectURL(additional)
                      }`}
                      alt="additional documents"
                      className="w-24 h-24 object-cover rounded-lg mt-2"
                    />
                  ) : (
                    <input
                      type="file"
                      disabled={!passportBack}
                      accept="image/*"
                      className="w-24 h-24 object-cover rounded-lg"
                      onChange={(e) => handleFileChange(e, "additional")}
                    />
                  )}
                </div>
                {uploading && currentField === "additional" && (
                  <div>Uploading...</div>
                )}
                <ul className="text-start mb-4 space-y-2">
                  <li>✅ A well lit area</li>
                  <li>✅ Remove glasses</li>
                </ul>
              </div>
            </div>
            {/* {step === 4 && (
            // <button
            //   onClick={handleRedirect}
            //   className="mt-4 bg-orange-500  items-center self-center text-white py-2 px-4 rounded"
            // >
            //   Continue😊
            // </button>
            <PersonDetails />
          )} */}
          </div>
        </div>
        {/* Instructions and User Details */}
        <div className="md:flex  hidden w-full flex-col md:w-[27%] md:min-h-full bg-gray-200 h-full justify-between md:flex-col">
          {important?.map((item) => {
            return (
              <>
                <div className="flex-1 p-4 rounded-lg mb-4 md:mb-0">
                  <div className="bg-white h-auto p-4 rounded-xl">
                    <h2 className="text-xl font-semibold mb-4">
                      {item?.heading}
                    </h2>
                    <p className="text-gray-600 mb-4">{item?.description}</p>
                    <ul className="text-left space-y-2">
                      {item?.points?.map((item) => {
                        return (
                          <>
                            <li>✔️ {item}</li>
                          </>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </>
            );
          })}
          {/* <div className="flex-1 p-4 md:pl-0 md:py-4 md:pr-4 rounded-lg ml-0 md:ml-4">
            <div className="bg-white h-auto p-4 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">User Detail</h2>
              <div className="space-y-2">
                <div className="flex">
                  <span className="w-32 font-semibold">Name:</span>
                  <span className="text-gray-600">John Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Fathers Name:</span>
                  <span className="text-gray-600">Robert Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Mothers Name:</span>
                  <span className="text-gray-600">Jane Doe</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Passport No.:</span>
                  <span className="text-gray-600">A12345678</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Issue Date:</span>
                  <span className="text-gray-600">01/01/2020</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Expiry Date:</span>
                  <span className="text-gray-600">01/01/2030</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">DOB:</span>
                  <span className="text-gray-600">01/01/1990</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {step === 4 && (
        // <button
        //   onClick={handleRedirect}
        //   className="mt-4 bg-orange-500  items-center self-center text-white py-2 px-4 rounded"
        // >
        //   Continue😊
        // </button>
        <PersonDetails />
      )}
    </>
  );
};

export default ImageUpload;
