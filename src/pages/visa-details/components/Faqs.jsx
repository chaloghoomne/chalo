import React, { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDownIcon as HiOutlineChevronDown, CircleChevronUpIcon as HiOutlineChevronUp } from 'lucide-react';

const FAQs = forwardRef(({ data }, ref) => {
  const [expandedId, setExpandedId] = useState(null);
  const answerRefs = useRef({});

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div ref={ref} className="w-full py-12 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center relative">
          <span className="relative z-10">Frequently Asked Questions</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-purple-100 rounded-full -z-0"></span>
        </h1>
        
        <div className="space-y-6">
          {data?.map((item) => {
            const isActive = expandedId === item._id;
            return (
              <div
                key={item._id}
                className={`rounded-lg border ${
                  isActive ? "border-purple-200 shadow-sm" : "border-gray-100"
                } transition-all duration-200 overflow-hidden`}
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-100 rounded-lg"
                  onClick={() => toggleExpand(item._id)}
                  aria-expanded={isActive}
                >
                  <h3
                    className={`text-lg font-semibold ${
                      isActive ? "text-purple-700" : "text-gray-800"
                    } transition-colors duration-200`}
                  >
                    {item.question}
                  </h3>
                  <div className={`ml-4 transition-transform duration-300 ${isActive ? "rotate-180" : "rotate-0"}`}>
                    <HiOutlineChevronDown 
                      size={20} 
                      className={`${isActive ? "text-purple-600" : "text-gray-500"}`}
                    />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div 
                    className="p-5 pt-0 text-gray-600 bg-white"
                    ref={el => answerRefs.current[item._id] = el}
                  >
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-purple-700 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline"
                      dangerouslySetInnerHTML={{
                        __html: item.answer,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

FAQs.displayName = "FAQs";

export default FAQs;
