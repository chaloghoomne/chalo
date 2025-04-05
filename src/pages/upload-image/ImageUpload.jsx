"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Helmet } from "react-helmet"
import { Upload, CheckCircle, Camera, Info, AlertCircle } from "lucide-react"

import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { calenderDate, returnCalenderDate } from "../../redux/actions/calender-date-action"
import { showButton } from "../../redux/actions/package-id-actions"

const ImageUpload = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Redux state
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId)
  const cotravlerId = useSelector((state) => state.CotravelerIdReducer.cotravlerId)
  const travlersCount = useSelector((state) => state.NumberOfTravelerReducer.travlersCount)
  const visaId = useSelector((state) => state.VisaIdReducer.visaId)

  // Component state
  const [packageData, setPackageData] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState({})
  const [data, setData] = useState([])
  const [images, setImages] = useState({})
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInfo, setShowInfo] = useState(null)

  // Hide button on component mount
  useEffect(() => {
    dispatch(showButton(false))
  }, [])

  // Reset calendar dates
  useEffect(() => {
    dispatch(returnCalenderDate(null))
    dispatch(calenderDate(null))
  }, [])

  // Fetch visa documents
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}visa-category/${visaId}`)

        if (response.status === 503) {
          navigate("/503")
          return
        }

        if (response) {
          const filterDoc = response?.data?.documents.filter((doc) => doc.show === "true" || doc.show === true)
          filterDoc.sort((a, b) => a.position - b.position)
          setData(filterDoc)
        }
      } catch (error) {
        setError("Failed to load document requirements")
        console.error(error)
        navigate("/503")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [visaId])

  // Fetch package data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}user-visa-order/${packageId}`)

        if (response.status === 503) {
          navigate("/503")
          return
        }

        if (response) {
          setPackageData(response?.data)
        }
      } catch (error) {
        console.error(error)
        navigate("/503")
      }
    }

    fetchData()
  }, [packageId])

  // Fetch order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}order-detail/${cotravlerId}`)

        if (response.status === 503) {
          navigate("/503")
        }
      } catch (error) {
        console.error(error)
        navigate("/503")
      }
    }

    fetchData()
  }, [cotravlerId])

  // Handle image selection
  const handleImageChange = (e, name) => {
    const file = e.target.files[0]
    if (!file) return

    // Update images state
    setImages((prev) => ({
      ...prev,
      [name]: file,
    }))

    // Generate and update the preview URL
    const previewUrl = URL.createObjectURL(file)
    setPreviews((prev) => ({
      ...prev,
      [name]: previewUrl,
    }))
  }

  // Upload images to server
  const token = localStorage.getItem("token")
  const uploadImage = async (formData) => {
    try {
        const response = await fetch(`${BASE_URL}edit-order-details/${cotravlerId}`, {
            method: "PUT",
            body: formData,  // ✅ Use formData as the body
            headers: {
                Authorization: `Bearer ${token}`,  // ✅ Keep only the auth header
            },
        });

        const result = await response.json();
        console.log("Response from server:", result);
        return result;
    } catch (error) {
        console.error("Upload failed:", error);
    }
};



  
  // const formData = new FormData()
  const handleSubmit = async () => {
    setUploading(true);

    let hasImages = false;
    const formData = new FormData();

    data.forEach((item, index) => {
        const imageFile = images[item.name];
        if (imageFile) {
            formData.append("documents", imageFile); // Now sending as `documents`
            formData.append(`names[${index}]`, item.name);
            hasImages = true;
        }
    });

    if (!hasImages) {
        setError("Please upload at least one document");
        setUploading(false);
        return;
    }

    console.log("Final FormData before sending:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    dispatch(showButton(true));

    try {
        const response = await uploadImage(formData);
        if (response?.success) {
            console.log("Upload Successful:", response);
        }
    } catch (error) {
        setError("Failed to upload documents");
        console.error(error);
    } finally {
        setUploading(false);
    }
};


  // useEffect(()=>{
  //   for (const pair of formData.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }
    
  // })
  

  // Calculate upload progress
  const uploadProgress = data.length > 0 ? (Object.keys(previews).length / data.length) * 100 : 0

  // Check if all required documents are uploaded
  const allUploaded = data.length > 0 && Object.keys(previews).length === data.length

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Document Upload | Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-4 flex items-center justify-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <h1 className="text-2xl font-bold text-center">
              {packageData?.orderDetails
                ? `Traveler Information: Applicant #${packageData?.orderDetails} of ${travlersCount}`
                : "Upload Your Documents"}
            </h1>

            {/* Progress indicator */}
            <div className="mt-4 max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span>Upload Progress</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2.5">
                <div
                  className="bg-white h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-xl"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="block sm:inline">{error}</span>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-700 mb-2">Required Documents</h2>
                  <p className="text-sm text-gray-500">
                    Click on each tile to upload the corresponding document. All documents must be clear and legible.
                  </p>
                </div>

                {/* Document grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className={`
                        relative group rounded-xl overflow-hidden border-2 transition-all duration-300
                        ${previews[item.name] ? "border-green-400 shadow-md" : "border-orange-200 hover:border-orange-400"}
                        cursor-pointer
                      `}
                      onClick={() => {
                        document.getElementById(`file-upload-${index}`).click()
                        setSelectedDoc(item)
                      }}
                      onMouseEnter={() => setShowInfo(item.name)}
                      onMouseLeave={() => setShowInfo(null)}
                    >
                      <input
                        id={`file-upload-${index}`}
                        type="file"
                        // accept="image/*"
                        onChange={(e) => handleImageChange(e, item.name)}
                        className="hidden"
                      />

                      <div className="aspect-square">
                        {previews[item.name] ? (
                          <div className="relative w-full h-full">
                            <img
                              src={previews[item.name] || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <div className="bg-white p-2 rounded-full">
                                <Camera className="w-6 h-6 text-orange-500" />
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-orange-50">
                            <div className="mb-2 p-3 rounded-full bg-white">
                              {item.icon ? (
                                <img src={item.icon || "/placeholder.svg"} alt="Icon" className="w-10 h-10" />
                              ) : (
                                <Upload className="w-8 h-8 text-orange-400" />
                              )}
                            </div>
                            <span className="text-xs font-medium text-center text-gray-700">Upload</span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-white border-t">
                        <h3 className="text-sm font-medium text-gray-800 truncate">{item.name}</h3>
                      </div>

                      {/* Info tooltip */}
                      {showInfo === item.name && (
                        <div className="absolute z-10 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 text-xs text-gray-600 -top-2 left-full ml-2 transform -translate-y-full">
                          <div className="font-medium text-gray-800 mb-1">{item.name}</div>
                          <p className="mb-2">{item.description || "Please upload a clear image of your document."}</p>
                          {item.points && item.points.length > 0 ? (
                            <ul className="space-y-1">
                              {item.points.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-1">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit button */}
                <div className="flex justify-center mt-8">
                  <button
                    className={`
                      px-8 py-3 rounded-full font-medium text-white
                      flex items-center gap-2 transition-all duration-300
                      ${
                        allUploaded
                          ? "bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                    `}
                    onClick={handleSubmit}
                    disabled={!allUploaded || uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submit All Documents
                      </>
                    )}
                  </button>
                </div>

                {/* Instructions panel */}
                {selectedDoc && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-5 h-5 text-orange-500" />
                      <h3 className="font-medium text-gray-800">Instructions for {selectedDoc.name}</h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {selectedDoc.description || "Please upload a clear image of your document."}
                    </p>

                    <ul className="space-y-2">
                      {selectedDoc.points ? (
                        selectedDoc.points.map((point, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Ensure the document is clearly visible</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>All text should be readable</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Upload in a well-lit environment</span>
                          </li>
                          <li className="text-sm flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Make sure the entire document fits in the frame</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ImageUpload

