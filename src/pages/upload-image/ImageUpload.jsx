import React, { useState, useEffect } from "react";

import HorizontalLinearAlternativeLabelStepper from "./components/Step";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// import PersonDetails from "../persons-details/PersonsDetails";
import {
  calenderDate,
  returnCalenderDate,
} from "../../redux/actions/calender-date-action";
import { showButton } from "../../redux/actions/package-id-actions";

const ImageUpload = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  console.log(packageId);
  const cotravlerId = useSelector(
    (state) => state.CotravelerIdReducer.cotravlerId
  );
  const travlersCount = useSelector(
    (state) => state.NumberOfTravelerReducer.travlersCount
  );
  const visaId = useSelector((state) => state.VisaIdReducer.visaId);
  const countryId = useSelector((state) => state.CountryIdReducer.countryId);
  console.log(packageId, "packageId");

  const [packageData, setPackageData] = useState();

  const [uploading, setUploading] = useState(false);
  const [important, setImportantPoints] = useState();
  const [step, setStep] = useState(0);
  // const [documents, setDocuments] = useState();
  const [previews, setPreviews] = useState({});
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageChange = (e, name, index) => {
    const file = e.target.files[0];

    // Update images state
    setImages((prev) => ({
      ...prev,
      [name]: file,
    }));

    // Generate and update the preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({
      ...prev,
      [name]: previewUrl,
    }));

    // Enable the next image input
    if (index <= data.length - 1) {
      setCurrentIndex(index + 1);
      setStep(index + 1);
    }
    console.log(data?.length,"data length")
   
  };

  useEffect(()=>{
    dispatch(showButton(false))
  },[])

  

  // useEffect(() => {
  //   const fetchShowCoTraveler = async () => {
  //     try {
  //       const response = await fetchDataFromAPI(
  //         "GET",
  //         `${BASE_URL}place/${countryId}`
  //       );
  //       console.log(response?.data, "response daya");
  //       if (response) {
  //         setImportantPoints(response?.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchShowCoTraveler();
  // }, []);

  useEffect(() => {
    const fetchShowCoTraveler = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}visa-category/${visaId}`
        );
        console.log(response, "response data");
        if (response) {
          const filterDoc = response?.data?.documents.filter(
            (doc) => doc.show === "true" || doc.show === true
          );

          setData(filterDoc);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchShowCoTraveler();
  }, []);

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
    dispatch(returnCalenderDate(null));
    dispatch(calenderDate(null));
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
          console.log(response, "sxdfghjkl");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchProfileImage = async () => {
  //     try {
  //       const response = await fetchDataFromAPI(
  //         "GET",
  //         `${BASE_URL}notes-by-package/${countryId}`
  //       );
  //       console.log(response, "wertyuioptewertyui");
  //       if (response) {
  //         const filtered = response?.data?.filter(
  //           (item) => item.type === "Image"
  //         );
  //         console.log(filtered, "filtered");

  //         setImportantPoints(filtered);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchProfileImage();
  // }, []);

  const uploadImage = async (data) => {
    console.log(data);
    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-order-details/${cotravlerId}`,
        data
      );
      console.log(response);
      if (response) {
        console.log(response);
        return response;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const imageArray = data.map((item) => ({
      name: item.name,
      image: images[item.name],
    }));

    // Now you can send imageArray to your backend
    const formData = new FormData();
    imageArray.forEach((item, index) => {
      formData.append(`documents[${index}][name]`, item.name);
    });
    imageArray.forEach((item) => {
      if (typeof item.image === "string") {
        console.log("");
      } else {
        formData.append("documents", item.image);
      }
    });
    dispatch(showButton(true))
    const getData = uploadImage(formData);
    console.log(getData, "getdatatata");
    return getData;
  };

  console.log(data, "datatata");
  console.log(step, "step");
  return (
    <>
      <div className="flex flex-col md:flex-row pb-5 pt-20   h-auto bg-white p-4">
        <div className="flex w-full flex-col mb-5 md:hidden md:w-[27%] md:min-h-full bg-gray-200 h-full justify-between md:flex-col">
          <>
            <div className="flex-1 p-4 rounded-lg mb-4 md:mb-0">
              <div className="bg-white h-auto p-4 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                  {important?.docHeading}
                </h2>
                <p className="text-gray-600 mb-4">
                  {important?.docDescription}
                </p>
                <ul className="text-left space-y-2">
                  {important?.docPoints?.map((item) => {
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
        </div>
        <div className="flex flex-col self-center w-[73%]">
          {/* <h1 className="text-xl poppins-four text-center self-center text-orange-500 ">
            {`Traveler Information: Applicant #${packageData?.orderDetails} of ${travlersCount}`}
          </h1> */}
          <div className="bg-white p-8 rounded-lg flex flex-col justify-center items-center  w-full max-w-6xl">
            <HorizontalLinearAlternativeLabelStepper
              documents={data}
              value={step}
            />

            {/* Step Indicator */}

            {/* Document Upload Sections */}
            <div className="flex flex-wrap flex-col md:flex-row   my-8">
              {/* Selfie */}
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col min-w-52 items-center mb-4 md:mb-0"
                >
                  <label className=" flex gap-2 text-gray-700">
                    <img src={item?.icon} className="w-5 h-5" />
                    {item?.name}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                    {/* Show the preview if it exists */}
                    {previews[item?.name] ? (
                      <img
                        src={previews[item?.name]}
                        alt={`Preview of ${item?.name}`}
                        className="w-24 h-24 object-contain rounded-lg mt-2"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        disabled={index !== currentIndex}
                        onChange={(e) =>
                          handleImageChange(e, item?.name, index)
                        }
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  {/* <ul className="text-start mb-4 space-y-2">
                    <li>✅ A well lit area</li>
                    <li>✅ Remove glasses</li>
                  </ul> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Instructions and User Details */}
        <div className="md:flex  hidden w-full flex-col md:w-[27%] md:min-h-full bg-gray-200 h-full justify-between md:flex-col">
          <>
            <div className="flex-1 p-4 rounded-lg mb-4 md:mb-0">
              <div className="bg-white h-auto p-4 rounded-xl">
                {data?.map((item) => {
                  return (
                    <>
                      <h2 className="text-xl font-semibold mb-4">
                        {item?.name}
                      </h2>
                      <p
                        style={{ overflowWrap: "anywhere" }}
                        className="text-gray-600 mb-4"
                      >
                        {" "}
                        {item?.description}
                      </p>
                    </>
                  );
                })}
                {/* <ul className="text-left space-y-2">
                  {important?.docPoints?.map((item) => {
                    return (
                      <>
                        <li>✔️ {item}</li>
                      </>
                    );
                  })}
                </ul> */}
              </div>
            </div>
          </>
        </div>
      </div>
      {step === data?.length && <button onClick={handleSubmit} className="bg-orange-500 text-white relative top-[-40px] px-4 py-2 rounded-lg">Submit Documents</button>}
    </>
  );
};

export default ImageUpload;
