import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { MdOutlinePersonAdd } from "react-icons/md";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

import { FaDownload, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalVisaRequest from "../../edit-visa-requests/ModalVisaRequest";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL } from "../../../api-integration/urlsVariable";
import {
  coTraveler,
  PackageId,
} from "../../../redux/actions/package-id-actions";
import { Helmet } from "react-helmet";

const ViewApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [price, setPrice] = useState(null);
  const [status, setStatus] = useState();
  const [description, setDescription] = useState();
  const [document, setDocument] = useState();
  const [applicationType, setApplicationType] = useState();
  const [childPrice,setChildPrice] = useState(null)
  const [insurance, setInsurance] = useState(true);
  const [insurancePrice, setInsurancePrice] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [gst, setGst] = useState();
  const [amount,setAmount] = useState()
  const [from, setFrom] = useState();
  console.log(users, "insurance");
  console.log(childPrice, "childprice");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}order-details-by-category/${packageId}`
        );
        if (response) {
          setUsers(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [packageId, selectedUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-visa-order/${packageId}`
        );
        console.log(response.data, "response daya");
        if (response) {
          setApplicationType(response?.data?.visaOrder?.applicationType);
          // setDiscount(response?.data?.visaOrder?.discount);

          setInsurance(response?.data?.visaOrder?.insurance);
          setInsurancePrice(response?.data?.visaOrder?.insurancePrice);
          setPrice(response?.data?.visaOrder?.pricePerUser);
          setTotalAmount(response?.data?.visaOrder?.totalAmount);
          setGst(response?.data?.visaOrder?.gst);
          setStatus(response?.data?.visaOrder?.status);
          setDescription(response?.data?.visaOrder?.description);
          setChildPrice(response?.data?.visaCategory?.childPrice);
          setFrom(response?.data?.visaOrder?.from);
          setDocument(response?.data?.visaOrder?.document);
          // try {
          //   const responseData = await fetchDataFromAPI(
          //     "GET",
          //     `${BASE_URL}visa-category/${response?.data?.visaOrder?.visaCategory}`
          //   );
          //   if (responseData) {
          //     setInsurancePrice(responseData?.data?.insuranceAmount);
          //     if (response?.data?.visaOrder?.applicationType === "normal") {
          //       setPrice(responseData?.data?.price);
          //     } else if (
          //       response?.data?.visaOrder?.applicationType === "express"
          //     ) {
          //       setPrice(responseData?.data?.expressPrice);
          //     } else if (
          //       response?.data?.visaOrder?.applicationType === "instant"
          //     ) {
          //       setPrice(responseData?.data?.instantPrice);
          //     }
          //   }
          // } catch (error) {
          //   console.log(error);
          // }
          let amount = 0
          const nnn = users.map((item)=>{
           console.log(item.ageGroup,"kkk")
           if(item.ageGroup === "Child"){
             amount += Number(childPrice)
           }else{
             amount += Number(price)
           }
           setAmount(amount)
           return  
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [packageId]);

  const handleView = async (id) => {
    try {
      const response = await fetchDataFromAPI(
        "GET",
        `${BASE_URL}order-detail/${id}`
      );
      if (response) {
        setSelectedUser(response.data);
        setIsEdit(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetchDataFromAPI(
        "GET",
        `${BASE_URL}order-detail/${id}`
      );
      if (response) {
        setSelectedUser(response.data);
        setIsEdit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    navigate(-1);
  };

 

  // const calculateTotalPrice = () => {
  //   const basePrice = price * users.length;
  //   const discountAmount = discount || 0;
  //   // const remainingAmount = basePrice - discountAmount;
  //   const gstAmount = basePrice * 0.18;
  //   const insuranceAmount = insurance ? insurancePrice : 0; // Assuming a fixed insurance price
  //   const totalAmount = basePrice + gstAmount + insuranceAmount;
  //   return { totalAmount, discount: discountAmount, gst: gstAmount };
  // };

  // const totalPrice = calculateTotalPrice();
  const downloadImageWithFileSaver = (url, filename) => {
    saveAs(url, filename);
  };

  return (
    <div className="container mx-auto px-4 flex flex-col py-14">
     <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <div className="flex flex-col justify-between items-center mb-5">
        <button className="bg-orange-500 text-xl font-bold text-white py-3 mt-5 px-10 rounded-[25px]">
          View on {new Date(from).toDateString()}
        </button>
        <h1 className="text-lg font-semibold">Review your information</h1>
      </div>
      <div className="w-[65%] flex justify-center self-center gap-2 items-center">
        {status === "sent-back" && (
          <>
            <div className="my-5 ">
              <h2 className="text-3xl text-red-500 px-2 poppins-five text-center  font-bold mb-5">
                Rejected
              </h2>
              <p
                style={{ overflowWrap: "anywhere" }}
                className="text-sm items-center max-h-24 overflow-auto  poppins-four  my-2"
              >
                {description}
              </p>
            </div>
          </>
        )}
        {status === "sent-to-immigration" && (
          <>
            <div className="my-5 ">
              <h2 className="text-3xl text-orange-500 px-2 poppins-five text-center  font-bold mb-5">
                In Processing...
              </h2>
              <p
                style={{ overflowWrap: "anywhere" }}
                className="text-sm items-center max-h-24 overflow-auto  poppins-four  my-2"
              >
                Soon You will able to Download your Visa here😊{" "}
                {/* {description} */}
              </p>
            </div>
          </>
        )}
        {status === "rejected" && (
          <>
            <div className="my-5 ">
              <h2 className="text-3xl text-red-500 px-2 poppins-five text-center  font-bold mb-5">
                Rejected
              </h2>
              <p
                style={{ overflowWrap: "anywhere" }}
                className="text-sm items-center max-h-24 overflow-auto  poppins-four  my-2"
              >
                {description}
              </p>
            </div>
          </>
        )}
        {status === "blacklist" && (
          <>
            <div className="my-5 ">
              <h2 className="text-3xl text-red-500 px-2 poppins-five text-center  font-bold mb-5">
                Black List
              </h2>
              <p
                style={{ overflowWrap: "anywhere" }}
                className="text-sm items-center max-h-24 overflow-auto  poppins-four  my-2"
              >
                {description}
              </p>
            </div>
          </>
        )}
        {status === "approved" && (
          <>
            <div className="mt-2 mb-5">
              <h2 className="text-3xl text-green-600 px-2 poppins-five  font-bold mb-5">
                Approved😊
              </h2>
              <p
                onClick={() => downloadImageWithFileSaver(document, "Visa.pdf")}
                className="text-sm flex bg-blue-500 p-2 w-48 rounded-lg px-5 text-white  gap-4 items-center poppins-four  my-2"
              >
                Download Visa
                <FaDownload
                  size={20}
                  className="cursor-pointer "
                  color="white"
                />
              </p>
            </div>
          </>
        )}
      </div>
      <button className="text-xl self-center py-2 w-[65%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
        <MdOutlinePersonAdd size={25} color="white" />
        Travelers Information
      </button>
      <table className="min-w-[65%] self-center max-w-[65%] bg-white">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="py-2">Traveler Name </th>
            <th className="py-2">Age Group</th>
            <th className="py-2">Price</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user?._id} className="text-center">
              <td className="py-2 text-lg poppins-four font-medium ">
                {user?.firstName} {user?.lastName}
              </td>
              <td className="py-2 text-lg poppins-four font-medium ">
                {user?.ageGroup} 
                
              </td>
              <td className="py-2 text-lg poppins-four font-medium ">
                {user?.ageGroup === "Child"?childPrice:price} 
              </td>
              <td className="py-2">
                <button
                  className="mr-5 text-blue-500"
                  onClick={() => handleView(user?._id)}
                >
                  <FaEye size={22} color="orange" />
                </button>
                {/* <button
                  className="text-green-500"
                  onClick={() => handleEdit(user?._id)}
                >
                  <FaEdit size={22} color="orange" />
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center my-8 w-full max-w-[65%] mx-auto bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="w-full flex justify-between mb-2">
          <span>Total Price:</span>
          <span>
    {amount}
          </span>
        </div>
        {/* <div className="w-full flex justify-between mb-2">
          <span>Discount:</span>
          <span>- ₹{discount || 0} </span>
        </div>
        <div className="w-full  h-1 bg-slate-300 self-end my-2 rounded-2xl"></div> */}
        {/* <div className="w-full flex justify-between mb-2">
          <span>Remaining Amount:</span>
          <span>
            ₹{totalPrice.totalAmount - totalPrice.gst - (insurance ? 500 : 0)}{" "}
          </span>
        </div> */}
        <div className="w-full flex justify-between mb-2">
          <span>GST (18%):</span>
          <span>₹{Math.floor(gst)} </span>
        </div>
        {insurance && (
          <div className="w-full flex justify-between mb-2 items-center">
            <label
              htmlFor="insurance-checkbox"
              className="flex items-center gap-2"
            >
              {/* <input
              type="checkbox"
              id="insurance-checkbox"
              checked={insurance}
              onChange={(e) => setInsurance(e.target.checked)}
              className="form-checkbox"
            /> */}
              Insurance
            </label>
            <span>{insurance ? `₹${insurancePrice} ` : "0"}</span>
          </div>
        )}
        <div className="w-full flex justify-between font-bold">
          <span>Total Amount:</span>
          <span>₹{Math.floor(totalAmount)} </span>
        </div>
      </div>
      <div className="flex justify-center my-4">
        <button
          onClick={() => handleSubmit()}
          className="bg-orange-500 text-white py-2 px-4 rounded-lg"
        >
          Back
        </button>
      </div>
      {selectedUser && (
        <ModalVisaRequest
          user={selectedUser}
          isEdit={isEdit}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default ViewApplication;
