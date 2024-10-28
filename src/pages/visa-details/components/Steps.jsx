import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // For adding a check icon to each step

const VisaProcessSteps = ({ country }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-10 text-center">
        How {country} Visa Process Works
      </h2>

      {/* Step 1 */}
      <div className="relative flex items-start mb-12">
        <div className="flex flex-col items-center mr-6">
          <div className="relative">
            <FaCheckCircle className="w-6 h-6 text-blue-600" />
            <div className="absolute top-7 left-2 w-1 h-40 bg-gradient-to-b from-blue-500 to-gray-300"></div>
          </div>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h3 className="text-lg font-semibold text-blue-700">Step 1</h3>
          <p className="font-bold text-gray-900">Apply on Chalo Ghoomne</p>
          <p className="text-gray-600">
            Submit your personal Information and documents on Chalo Ghoomne.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="relative flex items-start mb-12">
        <div className="flex flex-col items-center mr-6">
          <div className="relative">
            <FaCheckCircle className="w-6 h-6 text-blue-600" />
            <div className="absolute top-7 left-2 w-1 h-40 bg-gradient-to-b from-blue-500 to-gray-300"></div>
          </div>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h3 className="text-lg font-semibold text-blue-700">Step 2</h3>
          <p className="font-bold text-gray-900">Your Documents Are Verified</p>
          <p className="text-gray-600">
            ChaloGhoomne verifies your documents and submits them to Immigration.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="relative flex items-start">
        <div className="flex flex-col items-center mr-6">
          <div className="relative">
            <FaCheckCircle className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg w-full">
          <h3 className="text-lg font-semibold text-blue-700">Step 3</h3>
          <p className="font-bold text-gray-900">Your Visa Gets Processed</p>
          <p className="text-gray-600">
            We work with Immigration to ensure you get your visa on time.
          </p>

          {/* Additional Info (logs) */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                Application has been sent to the immigration supervisor
              </p>
              <span className="text-xs text-green-600">ON TIME</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between">
              <p className="text-gray-700">
                Application has been sent to internal intelligence
              </p>
              <span className="text-xs text-green-600">ON TIME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaProcessSteps;
