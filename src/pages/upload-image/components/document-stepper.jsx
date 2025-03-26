import React from "react"

const DocumentStepper = ({ documents, activeStep }) => {
  if (!documents || documents.length === 0) return null

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {documents.map((doc, index) => (
          <React.Fragment key={index}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    index < activeStep
                      ? "bg-orange-500 text-white"
                      : index === activeStep
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {index < activeStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>

              {/* Step label (only show on larger screens) */}
              <span className="text-xs mt-1 hidden sm:block text-center max-w-[80px] truncate">{doc.name}</span>
            </div>

            {/* Connector line */}
            {index < documents.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-1
                  ${index < activeStep ? "bg-orange-500" : "bg-gray-200"}
                `}
              />
            )}
          </React.Fragment>
        ))}

        {/* Final step (submission) */}
        <div className="flex flex-col items-center">
          <div
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${activeStep >= documents.length ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-500"}
            `}
          >
            {activeStep >= documents.length ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <span className="text-xs">✓</span>
            )}
          </div>
          <span className="text-xs mt-1 hidden sm:block">Submit</span>
        </div>
      </div>
    </div>
  )
}

export default DocumentStepper

