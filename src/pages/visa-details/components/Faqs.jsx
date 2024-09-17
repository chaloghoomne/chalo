import React, { useState, useRef, useEffect } from "react";
import { GoPlusCircle } from "react-icons/go";
import { FiMinusCircle } from "react-icons/fi";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
function FAQs({ data }) {
  const [expandedId, setExpandedId] = useState(null);
  const answerRef = useRef(null);
  const [answerHeight, setAnswerHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setAnswerHeight(answerRef.current.scrollHeight);
    }
  }, [expandedId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        Frequently Asked Questions
      </h1>
      <div className="w-full max-w-4xl mx-auto">
        {data?.map((item) => {
          const isActive = expandedId === item._id;
          return (
            <div
              key={item._id}
              className={`mb-4 border-b ${
                isActive ? "border-gray-400" : "border-gray-300"
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer py-4"
                onClick={() => toggleExpand(item._id)}
              >
                <p
                  className={`text-lg font-semibold ${
                    isActive ? "text-black" : "text-gray-700"
                  }`}
                >
                  {item.question}
                </p>
                <div className="ml-2">
                  {isActive ? (
                    <HiOutlineChevronUpDown size={24} color="black" />
                  ) : (
                    <HiOutlineChevronUpDown size={24} color="black" />
                  )}
                </div>
              </div>
              {isActive && (
                <div className="text-gray-600 py-2" ref={answerRef}>
                  {item.answer.includes("•") ? (
                    <ul className="list-disc pl-5">
                      {item.answer.split("•").map((line, index) => (
                        <li key={index} className="py-1">
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FAQs;
