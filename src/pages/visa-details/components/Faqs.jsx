import React, { useState, useRef, useEffect } from "react";
import { GoPlusCircle } from "react-icons/go";
import { FiMinusCircle } from "react-icons/fi";

function FAQs({ data }) {
  console.log(data, "data");
  const [toggle, setToggle] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const answerRef = useRef(null);
  const [answerHeight, setAnswerHeight] = useState(0);
  const [imageShadow, setImageShadow] = useState(false);
  const [imageShadow2, setImageShadow2] = useState(false);

  const handleshadow = () => {
    setImageShadow(!imageShadow);
  };

  const handleshadow2 = () => {
    setImageShadow2(!imageShadow2);
  };

  const array = [
    {
      id: 1,
      question: "How do I open a trading account with your platform?",
      answer: `To open a trading account, you can simply click on the "Open
Account" button on our homepage and follow the registration process.`,
    },
    {
      id: 2,
      question: "What types of accounts are available?",
      answer: ` We offer several types of accounts, including individual, joint,
retirement (IRA), and margin accounts. Each type of account has
different features and benefits to suit various trading needs.`,
    },
    {
      id: 3,
      question: "What are your trading fees and commissions?",
      answer: `Our trading fees and commissions vary depending on the type of
security and the volume of the trade. Please refer to our pricing page
for a detailed breakdown of all applicable fees and commissions.`,
    },
    {
      id: 4,
      question: "How do I open a trading account?",
      answer: ` You can open a trading account by visiting our website, clicking on
the "Open Account" button, and filling out the required personal and
financial information`,
    },
    {
      id: 5,
      question: "What is your customer support like?",
      answer: `We take pride in our dedicated customer support team, available
24/5 to assist you with any inquiries or issues. `,
    },
    {
      id: 6,
      question: " How do you ensure the security of my account and funds?",
      answer: ` We prioritize the security and privacy of our clients' accounts and
funds. Our platform utilizes advanced encryption protocols and secure
servers to protect sensitive information.`,
    },
    {
      id: 7,
      question: " Do you provide educational resources for traders?",
      answer: `Yes, we understand the importance of continuous learning for
traders. Our education center offers a wide range of resources,
including video tutorials, webinars, e-books, and trading courses.`,
    },
    {
      id: 8,
      question: "How are orders executed, and what are the fees involved?",
      answer: ` We prioritize efficient order execution to ensure the best possible
prices for our clients. Orders are executed through our advanced
trading engines and liquidity providers, using various order types
(market, limit, stop-loss, etc.).`,
    },
    {
      id: 9,
      question: " What financial instruments can I trade?",
      answer: `Our trading platform gives you access to a diverse range of
financial instruments, including forex (currency pairs), stocks
(domestic and international), commodities (gold, oil, etc.)`,
    },
    {
      id: 10,
      question: "What trading platforms and tools do you offer?",
      answer: `We provide access to industry-leading trading platforms, including
our proprietary web-based platform and advanced desktop applications.`,
    },
  ];

  useEffect(() => {
    if (answerRef.current) {
      setAnswerHeight(answerRef.current.scrollHeight);
    }
  }, [expandedId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div
        id="faq"
        className="w-full relative z-20  px-5 flex  bg-cover flex-col bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] py-5"
      >
        <div className=" relative z-0 w-full pt-8 pb-5 flex  justify-center">
          <p
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            className=" text-5xl font-bold rajdhani text-white"
          >
            Most Common
            <span className="text-orange-400 rajdhani ml-2 text-5xl font-bold">
              FAQ
            </span>
          </p>
        </div>
        <div className="flex md:flex-row flex-col relative z-10 pt-7 w-full pb-5 justify-evenly flex-wrap px-28">
          {data?.map((item) => {
            return (
              <div
                key={item._id}
                className={`max-w-[45%] min-w-[45%] flex flex-col px-3 my-2 rounded-md ${
                  expandedId === item._id ? "bg-orange-100" : "bg-[#21251A]"
                } py-4`}
                style={{
                  maxHeight:
                    expandedId === item._id ? `${answerHeight + 72}px` : "65px",
                }}
              >
                <div className="flex justify-between w-full">
                  <p
                    className={`${
                      expandedId === item._id ? "text-orange-500" : "text-white"
                    } font-medium rajdhani text-lg`}
                  >
                    {item.question}
                  </p>
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleExpand(item._id)}
                  >
                    {expandedId === item.id ? (
                      <FiMinusCircle size={20} color="green" />
                    ) : (
                      <GoPlusCircle size={20} color="white" />
                    )}
                  </div>
                </div>
                {expandedId === item._id && (
                  <p
                    className="text-black text-md rajdhani pt-2"
                    ref={answerRef}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default FAQs;
