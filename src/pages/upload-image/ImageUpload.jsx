import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { calenderDate, returnCalenderDate } from "../../redux/actions/calender-date-action";
import { showButton } from "../../redux/actions/package-id-actions";
import DocumentStepper from "./components/document-stepper";

const ImageUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  const cotravlerId = useSelector((state) => state.CotravelerIdReducer.cotravlerId);
  const travlersCount = useSelector((state) => state.NumberOfTravelerReducer.travlersCount);
  const visaId = useSelector((state) => state.VisaIdReducer.visaId);
  const countryId = useSelector((state) => state.CountryIdReducer.countryId);

  // Component state
  const [packageData, setPackageData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [important, setImportantPoints] = useState(null);
  const [step, setStep] = useState(0);
  const [previews, setPreviews] = useState({});
  const [data, setData] = useState([]);
  const [images, setImages] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle image selection
  const handleImageChange = (e, name, index) => {
    const file = e.target.files[0];
    if (!file) return;

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
    if (index < data.length - 1) {
      setCurrentIndex(index + 1);
      setStep(index + 1);
    } else {
      setStep(data.length);
    }
  };

  // Hide button on component mount
  useEffect(() => {
    dispatch(showButton(false));
  }, []);

  // Fetch visa documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}visa-category/${visaId}`
        );
        
        if (response.status === 503) {
          navigate("/503");
          return;
        }
        
        if (response) {
          console.log(response)
          const filterDoc = response?.data?.documents.filter(
            (doc) => doc.show === "true" || doc.show === true
          );
          filterDoc.sort((a,b)=> a.position - b.position);
          console.log(filterDoc)
          setData(filterDoc);
        }
      } catch (error) {
        setError("Failed to load document requirements");
        console.error(error);
        navigate("/503");
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchDocuments();
  }, [visaId]);

  

  // Fetch package data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-visa-order/${packageId}`
        );
        
        if (response.status === 503) {
          navigate("/503");
          return;
        }
        
        if (response) {
          setPackageData(response?.data);
        }
      } catch (error) {
        console.error(error);
        navigate("/503");
      }
    };
    
    fetchData();
  }, [packageId]);

  // Reset calendar dates
  useEffect(() => {
    dispatch(returnCalenderDate(null));
    dispatch(calenderDate(null));
  }, []);

  // Fetch order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}order-detail/${cotravlerId}`
        );
        
        if (response.status === 503) {
          navigate("/503");
        }
      } catch (error) {
        console.error(error);
        navigate("/503");
      }
    };
    
    fetchData();
  }, [cotravlerId]);

  // Upload images to server
  const token = localStorage.getItem("token");
  const uploadImage = async (data) => {
    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-order-details/${cotravlerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        data
      );
      console.log(data)
      
      if (response.status === 503) {
        navigate("/503");
      }
      
      return response;
    } catch (error) {
      console.error(error);
      navigate("/503");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setUploading(true);
    
    const formData = new FormData();
    let hasImages = false;
    
    data.forEach((item, index) => {
      const imageFile = images[item.name];
      
      if (imageFile) {
        formData.append(`documents[${index}][image]`, imageFile);
        hasImages = true;
      }
    });
    
    if (!hasImages) {
      setError("Please upload at least one document");
      setUploading(false);
      return;
    }
    
    dispatch(showButton(true));
    
    try {
      const response = await uploadImage(formData);
      if (response?.success) {
        // Show success message or navigate
      }
    } catch (error) {
      setError("Failed to upload documents");
      console.error(error);
    }
  };

  // Calculate upload progress
  const uploadProgress = data.length > 0 
    ? (Object.keys(previews).length / data.length) * 100 
    : 0;

  // Get current document
  const currentDocument = data[currentIndex] || null;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Document Upload | Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      
      <div className="h-full w-full max-w-6xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-center text-orange-500">
            {packageData?.orderDetails 
              ? `Traveler Information: Applicant #${packageData?.orderDetails} of ${travlersCount}`
              : "Document Upload"}
          </h1>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Upload Progress</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-40 w-full bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-20 w-full bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <>
              {/* Document stepper */}
              <div className="mb-6">
                <DocumentStepper documents={data} activeStep={step} />
              </div>
              
              {/* Current document upload */}
              <div className="mb-6">
                <div className="overflow-hidden border rounded-lg">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="font-medium flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {currentDocument?.name || "Document"} Upload
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {currentDocument && (
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Upload area */}
                        <div className="flex flex-col items-center">
                          <div 
                            className={`
                              border-2 border-dashed rounded-lg p-6 w-full h-48
                              flex flex-col items-center justify-center
                              ${previews[currentDocument.name] ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-orange-300'}
                              transition-colors cursor-pointer
                            `}
                            onClick={() => document.getElementById(`file-upload-${currentIndex}`).click()}
                          >
                            {previews[currentDocument.name] ? (
                              <>
                                <div className="relative w-full h-full">
                                  <img
                                    src={previews[currentDocument.name] || "/placeholder.svg"}
                                    alt={`Preview of ${currentDocument.name}`}
                                    className="w-full h-full object-contain"
                                  />
                                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <span className="mt-2 text-sm text-gray-500">Click to change</span>
                              </>
                            ) : (
                              <>
                                <div className="mb-3 p-3 rounded-full bg-orange-100">
                                  {currentDocument.icon ? (
                                    <img src={currentDocument.icon || "/placeholder.svg"} alt="Icon" className="w-8 h-8" />
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                  )}
                                </div>
                                <p className="text-sm text-center mb-1">
                                  <span className="font-medium">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 text-center">
                                  SVG, PNG, JPG or GIF (max. 2MB)
                                </p>
                              </>
                            )}
                            <input
                              id={`file-upload-${currentIndex}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, currentDocument.name, currentIndex)}
                              className="hidden"
                            />
                          </div>
                          
                          {/* Navigation buttons */}
                          <div className="flex gap-2 mt-4">
                            {currentIndex > 0 && (
                              <button 
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                onClick={() => {
                                  setCurrentIndex(currentIndex - 1);
                                  setStep(currentIndex - 1);
                                }}
                              >
                                Previous
                              </button>
                            )}
                            
                            {currentIndex < data.length - 1 && previews[currentDocument.name] && (
                              <button 
                                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600"
                                onClick={() => {
                                  setCurrentIndex(currentIndex + 1);
                                  setStep(currentIndex + 1);
                                }}
                              >
                                Next Document
                              </button>
                            )}
                            
                            {currentIndex === data.length - 1 && previews[currentDocument.name] && (
                              <button 
                                className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
                                onClick={handleSubmit}
                                disabled={uploading}
                              >
                                {uploading ? "Uploading..." : "Submit All Documents"}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Instructions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2 text-sm">Instructions:</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {currentDocument.description || "Please upload a clear image of your document."}
                          </p>
                          
                          {currentDocument.points && (
                            <ul className="space-y-2">
                              {currentDocument.points.map((point, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          {!currentDocument.points && (
                            <ul className="space-y-2">
                              <li className="text-sm flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Ensure the document is clearly visible</span>
                              </li>
                              <li className="text-sm flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>All text should be readable</span>
                              </li>
                              <li className="text-sm flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Upload in a well-lit environment</span>
                              </li>
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Document thumbnails */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {data.map((item, index) => (
                  <div 
                    key={index}
                    className={`
                      border rounded-lg p-2 cursor-pointer transition-all
                      ${currentIndex === index ? 'ring-2 ring-orange-500' : ''}
                      ${previews[item.name] ? 'bg-orange-50' : 'bg-white'}
                    `}
                    onClick={() => {
                      setCurrentIndex(index);
                      setStep(index);
                    }}
                  >
                    <div className="aspect-square relative overflow-hidden rounded-md mb-1">
                      {previews[item.name] ? (
                        <>
                          <img 
                            src={previews[item.name] || "/placeholder.svg"} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 bg-green-500 text-white p-0.5 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          {item.icon ? (
                            <img src={item.icon || "/placeholder.svg"} alt="Icon" className="w-8 h-8 opacity-70" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-medium truncate text-center">{item.name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
