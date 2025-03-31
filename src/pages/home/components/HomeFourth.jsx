"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import ratings from "../../../assets/homefourth.png";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomeFourth = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsLoading(true);
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/About`
        );
        if (response) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfileImage();
  }, []);

  return (
    <section className=" py-24  w-screen bg-white">
      <div className=" px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary border-primary/20 rounded-full">
                {data?.title || "About Us"}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                {data?.heading || "Trusted by thousands of customers"}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                {data?.description || "We provide exceptional service with a focus on quality and customer satisfaction."}
              </p>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {data?.subItems?.map((item, index) => (
                <motion.div
                  key={item?.id || index}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl h-46 transition-all duration-300 border border-gray-200 "
                >
                  <h3 className="mt-4 text-2xl font-bold text-primary">
                    {item?.heading}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item?.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition-all">
              Learn more
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full rounded-2xl overflow-hidden bg-gray-100 p-2 shadow-xl border border-gray-200">
              <motion.img
                src={ratings}
                alt="Happy Customer"
                className="w-[100%] h-auto rounded-xl relative z-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute top-6 left-6 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border border-gray-200"
              >
                <FaStar className="text-yellow-500 text-xl" />
                <span className="font-medium text-sm">4.8 Rating</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeFourth;
