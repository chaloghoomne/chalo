import React from "react"
import { CheckCircle } from "lucide-react"

const DocumentStepper = ({ documents, activeStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {documents.map((doc, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${
                    idx < activeStep
                      ? "bg-green-500 text-white"
                      : idx === activeStep
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {idx < activeStep ? <CheckCircle className="w-4 h-4" /> : <span>{idx + 1}</span>}
              </div>
              <span className="text-xs mt-1 text-center hidden md:block max-w-[80px] truncate">{doc.name}</span>
            </div>

            {idx < documents.length - 1 && (
              <div
                className={`
                  h-0.5 flex-1 mx-2
                  ${idx < activeStep ? "bg-green-500" : "bg-gray-200"}
                `}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default DocumentStepper

