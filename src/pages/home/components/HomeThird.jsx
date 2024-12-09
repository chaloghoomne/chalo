import React, { useEffect, useState } from "react";
import reviewImage from "../../../assets/reviews.png";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
const reviews = [
  {
    id: 1,
    name: "Jaylon Vaccaro",
    rating: 5,
    image:
      "https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg",
    review:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which . ",
  },
  {
    id: 2,
    name: "John Doe",
    rating: 4,
    image:
      "https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industryLorem Ipsum is simply dummy text of the printing and .  ",
  },
];

const HomeThird = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [data, setData] = useState();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Feedback`
        );
        if (response) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const { name, rating, image, review } = reviews[currentIndex];

  return (
    <div className="flex flex-col container items-center mx-auto justify-center py-20 px-4 md:px-10  ">
      <h2 className="text-[22px] text-orange-500 text-center poppins-five mb-2">
        {data?.heading}
      </h2>
      <h1 className="text-5xl poppins-six text-center  font-bold mb-6">
        {data?.title}
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full ">
        <div className=" md:block w-full md:w-1/2">
          <img
            src={reviewImage}
            alt="World Map with Customer Photos"
            className="w-full h-auto"
          />
        </div>
        <div className="flex min-h-56 md:max-h-[450px] md:overflow-y-auto flex-col items-start justify-center w-full md:w-1/2 text-left p-4 md:p-8 ">
          <div className="flex items-center mb-4">
            <img
              src={image}
              alt={name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-[22px] poppins-five font-bold">{name}</h3>
              <div className="flex gap-2 items-center">
                {[...Array(rating)].map((_, index) => (
                  <svg
                    key={index}
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.381 4.253a1 1 0 00.95.69h4.461c.969 0 1.371 1.24.588 1.81l-3.607 2.631a1 1 0 00-.363 1.118l1.381 4.253c.3.921-.755 1.688-1.54 1.118l-3.607-2.631a1 1 0 00-1.176 0l-3.607 2.631c-.784.57-1.84-.197-1.54-1.118l1.381-4.253a1 1 0 00-.363-1.118L2.67 9.68c-.783-.57-.38-1.81.588-1.81h4.461a1 1 0 00.95-.69l1.38-4.253z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p
            style={{ lineHeight: "2.5rem" }}
            className="text-black text-xl poppins-four mb-6"
          >
            {review}
          </p>
          <div className="flex gap-5 mt-5 justify-center w-full">
            <button
              onClick={handlePrevClick}
              className={`${
                currentIndex === 0 ? "bg-orange-100" : "bg-orange-500"
              } flex justify-center text-lg font-semibold items-center text-white w-14 h-14 p-3 rounded-full shadow duration-300`}
            >
              <IoIosArrowBack size={30} />
            </button>
            <button
              onClick={handleNextClick}
              className="bg-orange-500 text-white text-lg flex justify-center items-center w-14 h-14 p-3 rounded-full shadow  font-semibold duration-300"
            >
              <IoIosArrowForward size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThird;
