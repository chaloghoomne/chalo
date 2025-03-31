import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const VisaProcessSteps = ({ country }) => {
  return (
    <div className="max-w-3xl mx-auto py-2">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        How {country} Visa Process Works
      </h2>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="relative flex items-start">
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 mt-5 flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-blue-600 animate-pulseSlow" />
              </div>
              <div className="absolute top-15 left-5 w-[0.15rem] h-44 bg-gradient-to-b from-blue-500 to-blue-100"></div>
            </div>
          </div>
          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg w-full border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-bold">1</div>
              <h3 className="text-lg font-semibold text-blue-700">Apply on Chalo Ghoomne</h3>
            </div>
            <p className="font-bold text-gray-900 ml-11 mb-2">Quick & Easy Application</p>
            <p className="text-gray-600 ml-11">
              Submit your personal information and documents on Chalo Ghoomne.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative flex items-start">
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div className="w-10 h-10 mt-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaCheckCircle className="w-6 h-6 text-blue-600 animate-pulseSlow" />
              </div>
              <div className="absolute top-15 left-5 w-[0.15rem] h-44 bg-gradient-to-b from-blue-500 to-blue-100"></div>
            </div>
          </div>
          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg w-full border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-bold">2</div>
              <h3 className="text-lg font-semibold text-blue-700">Document Verification</h3>
            </div>
            <p className="font-bold text-gray-900 ml-11 mb-2">Thorough Review Process</p>
            <p className="text-gray-600 ml-11">
              ChaloGhoomne verifies your documents and submits them to Immigration.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative flex items-start">
          <div className="flex flex-col items-center mr-6">
            <div className="relative">
              <div className="w-10 h-10 mt-5 rounded-full bg-blue-100 flex items-center justify-center">
              <FaCheckCircle className="w-6 h-6 text-blue-600 transition-transform animate-pulseSlow" />
    
              </div>
            </div>
          </div>
          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg w-full border-l-4 border-blue-500">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 font-bold">3</div>
              <h3 className="text-lg font-semibold text-blue-700">Visa Processing</h3>
            </div>
            <p className="font-bold text-gray-900 ml-11 mb-2">Timely Approval</p>
            <p className="text-gray-600 ml-11">
              We work with Immigration to ensure you get your visa on time.
            </p>

            {/* Additional Info (logs) */}
            <div className="mt-2 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg ml-11 border border-blue-100">
              <div className="flex items-center justify-between mb-1 hover:bg-white p-1 rounded transition-colors duration-200">
                <p className="text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Application has been sent to the immigration supervisor
                </p>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-600 rounded-full">ON TIME</span>
              </div>
              <hr className="my-2 border-blue-100" />
              <div className="flex items-center justify-between hover:bg-white p-2 rounded transition-colors duration-200">
                <p className="text-gray-700 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Application has been sent to internal intelligence
                </p>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-600 rounded-full">ON TIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaProcessSteps;
