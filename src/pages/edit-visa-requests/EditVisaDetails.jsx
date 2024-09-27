import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MdOutlinePersonAdd } from "react-icons/md";
import { IoDocumentsSharp } from "react-icons/io5";
import ModalVisaRequest from "./ModalVisaRequest";
import { LiaShippingFastSolid } from "react-icons/lia";
import { coTraveler, PackageId } from "../../redux/actions/package-id-actions";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { GrCheckboxSelected } from "react-icons/gr";

const EditVisaDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [price, setPrice] = useState(null);
  const [childPrice,setChildPrice] = useState(null)
  const [discount, setDiscount] = useState();
  const [applicationType, setApplicationType] = useState();
  const [insurance, setInsurance] = useState(true);
  const [insurancePrice, setInsurancePrice] = useState(null);
  const [from, setFrom] = useState();
  const [entryType, setEntryType] = useState();
  const [validity, setValidity] = useState();
  const [period, setPeriod] = useState();
  const [processingTime, setProcessingTime] = useState();

  console.log(applicationType, "applicationType");
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
        if (response) {
          setApplicationType(response?.data?.visaOrder?.applicationType);
          setDiscount(response?.data?.visaOrder?.discount);

          setFrom(response?.data?.visaOrder?.from);
          try {
            const responseData = await fetchDataFromAPI(
              "GET",
              `${BASE_URL}visa-category/${response?.data?.visaOrder?.visaCategory}`
            );
            if (responseData) {
              setInsurancePrice(responseData?.data?.insuranceAmount);
              setEntryType(responseData?.data?.entryType);
              setValidity(responseData?.data?.validity);
              setPeriod(responseData?.data?.period);
              setProcessingTime(responseData?.data?.processingTime);

              if (response?.data?.visaOrder?.applicationType === "normal") {
                setPrice(responseData?.data?.price);
                setChildPrice(responseData?.data?.childPrice);
              } else if (
                response?.data?.visaOrder?.applicationType === "express"
                
              ) {
                setChildPrice(responseData?.data?.childPrice);
                setPrice(responseData?.data?.expressPrice);
              } else if (
                response?.data?.visaOrder?.applicationType === "instant"
              ) {
                setChildPrice(responseData?.data?.childPrice);
                setPrice(responseData?.data?.instantPrice);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [packageId]);

  const handlePayment = async () => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}create-order`,
        { amount: 1 }
      );
      console.log(response?.data?.amount, "response amount");
      if (response) {
        const options = {
          key: "rzp_live_7jIGrWcWtT3QMW",
          amount: response?.data?.amount,
          currency: response?.data?.currency,
          name: "Your Company Name",
          description: "Test Transaction",
          image: "https://your-logo-url.com",
          order_id: response?.data?.id,
          callback_url: "https://google.com",
          handler: function (response) {
            console.log(response, "razorpay response");
            const razorpay_order_id = response.razorpay_payment_id;
            const razorpay_payment_id = response.razorpay_payment_id;
            const razorpay_signature = response?.razorpay_signature;
            const verifyPayment = async () => {
              try {
                const responseData = await fetchDataFromAPI(
                  "POST",
                  `${BASE_URL}verify-payment`,
                  {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                  }
                );
                if (responseData) {
                  console.log(responseData, "responseData");
                  try {
                    const response = await fetchDataFromAPI(
                      "GET",
                      `${BASE_URL}user-visa-order/${packageId}`
                    );
                    if (response) {
                      const totalPrice = calculateTotalPrice();
                      try {
                        const responseData = await fetchDataFromAPI(
                          "PUT",
                          `${BASE_URL}edit-visa-order/${packageId}`,
                          {
                            ...response.data,
                            totalAmount: totalPrice.totalAmount,
                            gst: totalPrice.gst,
                            insurance: insurance,
                            insurancePrice,
                            pricePerUser: price,
                            isSubmitted: true,
                          }
                        );
                        if (responseData) {
                          toast.success(`Successfully Submitted`);
                          dispatch(coTraveler(null));
                          dispatch(PackageId(null));
                          navigate(`/`);
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              } catch (error) {
                console.log(error);
                toast.error(`Network Error! Please Try Again Later`);
              }
            };
            verifyPayment();
            console.log("sdfghj");
            // alert(`Payment Successful: ${response.razorpay_payment_id}`);
          },
          prefill: {
            name: "Your Name",
            email: "your-email@example.com",
            contact: "1234567890",
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleSubmit = async () => {};

  const calculateTotalPrice = () => {
    let amount = 0
     const nnn = users.map((item)=>{
      console.log(item.ageGroup,"kkk")
      if(item.ageGroup === "Child"){
        amount += Number(childPrice)
      }else{
        amount += Number(price)
      }
      return  
     });
     console.log(nnn,'jnkdjdj')
    const basePrice = amount
    const discountAmount = discount || 0;
    // const remainingAmount = basePrice - discountAmount;
    const gstAmount = basePrice * 0.18;
 const newnum = Number(insurancePrice)
    const insuranceAmount = isNaN(newnum) ? 0 : Number(insurancePrice) ; // Assuming a fixed insurance price
    console.log(insuranceAmount,"insuranceAmount")
    const totalAmount = basePrice + gstAmount + insuranceAmount ;
    return { totalAmount, discount: discountAmount, gst: gstAmount, basePrice:basePrice };
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="container mx-auto px-4 flex flex-col py-14">
      <div className="flex flex-col justify-between items-center mb-5">
        <button className="bg-orange-500 text-xl font-bold text-white py-3 mt-5 px-10 rounded-[25px]">
          View on {new Date(from).toDateString()}
        </button>
        <h1 className="text-lg font-semibold">Review your information</h1>
      </div>
      <button className="text-xl self-center py-2 w-[65%] mx-3 mb-1 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
        <GrCheckboxSelected size={25} color="white" />
        Plan Selected
      </button>
      <div
        // onClick={() => handleselect(option?._id)}
        // key={index}
        className="border md:min-w-[65%] self-center md:max-w-[65%] my-4 relative gap-3 rounded-[25px] border-blue-500 shadow-sm shadow-blue-200 p-8 py-4 flex  cursor-pointer flex-col justify-between items-center"
      >
        {/* <div
          className={`w-4 h-4 absolute left-3 top-4 mb-4 mx-auto rounded-full border-3 `}
        >
          {" "}
          <FaCircleDot
            size={15}
            color={`${selected === option?._id ? "#3180CA" : "gray"}`}
          />
        </div> */}
        {/* {applicationType && (
          <span className=" bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]  absolute right-16 top-[-12px] text-white shadow-lg shadow-[#7AC7F9] px-9 py-1 rounded-full text-sm">
            {applicationType}
          </span>
        )} */}
        <div className="flex  justify-between w-full px-4">
          <h2 className="text-lg  poppins-five font-semibold">
            {period} Days {entryType}
          </h2>
          {(applicationType === "express" || applicationType === "instant") && (
            <p className="text-lg md:text-[27px] flex gap-2 text-orange-300 poppins-five font-bold">
              <LiaShippingFastSolid size={30} /> {applicationType}
            </p>
          )}
        </div>
        <div className="w-full flex md:flex-row flex-col gap-2 justify-between px-4">
          <p className="text-gray-500 poppins-five text-md">
            Stay Period:{" "}
            <span className="text-md text-gray-400 poppins-three">
              {period} Days
            </span>
          </p>
          <p className="text-gray-500 poppins-five text-md">
            Validity:{" "}
            <span className="text-md text-gray-400 poppins-three">
              {" "}
              {validity} Days
            </span>
          </p>
          {!(
            applicationType === "express" || applicationType === "instant"
          ) && (
            <p className="text-gray-500 poppins-five text-md">
              Processing Time:{" "}
              <span className="text-md text-gray-400 poppins-three">
                {processingTime} Bussiness Days
              </span>
            </p>
          )}
        </div>
      </div>
      <button className="text-xl self-center py-2 w-[65%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center bg-blue-500 text-white font-semibold">
        <MdOutlinePersonAdd size={25} color="white" />
        Travelers Information
      </button>
      <table className="md:min-w-[65%] w-full px-4 md:px-0 self-center md:max-w-[65%] bg-white">
        <thead>
          <tr className="bg-orange-500 text-white">
            <th className="py-2">Traveler Name</th>
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
                <button
                  className="text-green-500"
                  onClick={() => handleEdit(user?._id)}
                >
                  <FaEdit size={22} color="orange" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center self-center my-8 w-full md:max-w-[65%] mx-auto bg-gray-100 md:p-6 py-4 px-2 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="w-full flex justify-between mb-2">
          <span>Total Price:</span>
          <span>
            ₹{totalPrice?.basePrice}
          </span>
        </div>
        {/* <div className="w-full flex justify-between mb-2">
          <span>Discount:</span>
          <span>- ₹{discount || 0} </span>
        </div> */}
        {/* <div className="w-full  h-1 bg-slate-300 self-end my-2 rounded-2xl"></div> */}
        {/* <div className="w-full flex justify-between mb-2">
          <span>Remaining Amount:</span>
          <span>
            ₹{totalPrice.totalAmount - totalPrice.gst - (insurance ? 500 : 0)}{" "}
          </span>
        </div> */}
        <div className="w-full flex justify-between mb-2">
          <span>GST (18%):</span>
          <span>₹{Math.floor(totalPrice.gst)} </span>
        </div>
        {insurancePrice > 0 && (
          <div className="w-full flex justify-between mb-2 items-center">
            <label
              htmlFor="insurance-checkbox"
              className="flex items-center text-sm gap-2"
            >
              <input
                type="checkbox"
                id="insurance-checkbox"
                checked={insurance}
                onChange={(e) => setInsurance(e.target.checked)}
                className="form-checkbox"
              />
              Insurance
            </label>
            {/* <span>{insurance ? `₹${insurancePrice} ` : "0 "}</span> */}
          </div>
        )}
        <div className="w-full flex justify-between font-bold">
          <span>Total Amount:</span>
          <span>₹{Math.floor(totalPrice.totalAmount)} </span>
        </div>
        <div className="w-full flex justify-between relative top-4 font-normal text-xs">
          <span>{insurancePrice}</span>
          {/* <span>₹{Math.floor(totalPrice.totalAmount)} </span> */}
        </div>
      </div>
      
      <div className="flex justify-center my-4">
        <button
          onClick={() => handlePayment()}
          className="bg-orange-500 text-white py-2 px-4 rounded-lg"
        >
          Make Payment
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

export default EditVisaDetails;
