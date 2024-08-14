import React from "react";

function AddressDetails({ user }) {
  console.log(user, "user");
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <div className="p-4 flex flex-col md:flex-row items-center md:items-start">
        {/* <div className="ml-4 md:ml-8">
          <h3 className="text-xl font-bold">Siddhesh Kumar Singh</h3>
          <p className="text-gray-600">xyz@gmail.com</p>
          <p className="text-gray-600">+91 8005456381</p>
        </div> */}
        {/* <div className="ml-auto mt-4 md:mt-0">
          <div className="text-sm text-gray-600">
            <span>Passport Number: </span>
            <span className="font-semibold">V7616124</span>
          </div>
          <div className="text-sm text-gray-600">
            <span>Passport Expiry: </span>
            <span className="font-semibold">25/05/2025</span>
          </div>
        </div> */}
      </div>
      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Address Details</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Address Line 1</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={user?.addressLineOne}
              readOnly
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block text-gray-700">Address Line 2</label>
            <input
              type="text"
              value={user?.addressLineTwo}
              readOnly
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Enter your address"
            />
          </div>
          <div>
            <label className="block text-gray-700">City</label>
            <input
              value={user?.city}
              readOnly
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="City"
            />
          </div>
          {/* <div>
            <label className="block text-gray-700">State</label>
            <input
              value={user?.state}
              readOnly
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="State"
            />
          </div>
          <div>
            <label className="block text-gray-700">Pincode</label>
            <input
              value={user?.pincode}
              readOnly
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Pincode"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AddressDetails;
