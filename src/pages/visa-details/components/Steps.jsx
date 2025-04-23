import { FaCheckCircle, FaPassport, FaFileAlt, FaPlane } from "react-icons/fa"

const VisaProcessSteps = ({ country }) => {
  return (
    <div className="w-full py-4 px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 sm:mb-8 text-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          How {country} Visa Process Works
        </span>
      </h2>

      <div className="relative">
        {/* Timeline line - thinner on mobile */}
        <div className="absolute left-4 xs:left-5 sm:left-8 top-0 h-[66%] md:h-[64%] w-0.5 sm:w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 rounded-full"></div>

        <div className="space-y-6 sm:space-y-8 relative">
          {/* Step 1 */}
          <div className="flex group">
            <div className="relative flex-shrink-0 z-10">
              <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 rounded-full bg-blue-100 border-2 sm:border-4 border-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaPassport className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3 xs:ml-4 sm:ml-6 w-full">
              <div className="bg-white p-3 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform group-hover:-translate-y-1">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center mr-2 sm:mr-3 font-bold shadow-md text-xs sm:text-base">
                    1
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">
                    Apply on Chalo Ghoomne
                  </h3>
                </div>
                <p className="font-bold text-gray-900 ml-8 sm:ml-11 mb-1 sm:mb-2 text-sm sm:text-base">
                  Quick & Easy Application
                </p>
                <p className="text-gray-600 ml-8 sm:ml-11 text-xs sm:text-sm">
                  Submit your personal information and documents on Chalo Ghoomne.
                </p>
                <div className="ml-8 sm:ml-11 mt-2 sm:mt-3 bg-blue-50 rounded-lg p-2 text-xs sm:text-sm text-blue-700 border border-blue-100">
                  <span className="font-medium">Pro tip:</span> Have your passport and photos ready before starting.
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex group">
            <div className="relative flex-shrink-0 z-10">
              <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 rounded-full bg-blue-100 border-2 sm:border-4 border-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaFileAlt className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3 xs:ml-4 sm:ml-6 w-full">
              <div className="bg-white p-3 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform group-hover:-translate-y-1">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center mr-2 sm:mr-3 font-bold shadow-md text-xs sm:text-base">
                    2
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">Document Verification</h3>
                </div>
                <p className="font-bold text-gray-900 ml-8 sm:ml-11 mb-1 sm:mb-2 text-sm sm:text-base">
                  Thorough Review Process
                </p>
                <p className="text-gray-600 ml-8 sm:ml-11 text-xs sm:text-sm">
                  ChaloGhoomne verifies your documents and submits them to Immigration.
                </p>
                <div className="ml-8 sm:ml-11 mt-2 sm:mt-3 flex items-center">
                  <div className="h-1 flex-grow bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-blue-700">75%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex group">
            <div className="relative flex-shrink-0 z-10">
              <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-16 sm:h-16 rounded-full bg-blue-100 border-2 sm:border-4 border-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaPlane className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-3 xs:ml-4 sm:ml-6 w-full">
              <div className="bg-white p-3 sm:p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform group-hover:-translate-y-1">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center mr-2 sm:mr-3 font-bold shadow-md text-xs sm:text-base">
                    3
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-700">Visa Processing</h3>
                </div>
                <p className="font-bold text-gray-900 ml-8 sm:ml-11 mb-1 sm:mb-2 text-sm sm:text-base">
                  Timely Approval
                </p>
                <p className="text-gray-600 ml-8 sm:ml-11 text-xs sm:text-sm">
                  We work with Immigration to ensure you get your visa on time.
                </p>

                {/* Activity Log - simplified for mobile */}
                <div className="mt-2 sm:mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-4 rounded-lg ml-8 sm:ml-11 border border-blue-100">
                  <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-1 sm:mb-2">Activity Log</h4>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-gray-700 flex items-center text-xs sm:text-sm mb-1 xs:mb-0">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                        Application sent to immigration
                      </p>
                      <span className="text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-600 rounded-full">
                        ON TIME
                      </span>
                    </div>
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between p-1.5 sm:p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                      <p className="text-gray-700 flex items-center text-xs sm:text-sm mb-1 xs:mb-0">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                        Sent to internal intelligence
                      </p>
                      <span className="text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-600 rounded-full">
                        ON TIME
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator - simplified for mobile */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-100 flex flex-col xs:flex-row items-start xs:items-center justify-between">
        <div className="flex items-center mb-2 xs:mb-0">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2 sm:mr-3">
            <FaCheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-800">Current Status</p>
            <p className="text-xs text-blue-600">Processing on schedule</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VisaProcessSteps
