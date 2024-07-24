import React, { useState } from 'react';
import reviewImage from "../../../assets/reviews.png"
const reviews = [
  {
    id: 1,
    name: 'Jaylon Vaccaro',
    rating: 5,
    image: 'https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg',
    review: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industryLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
  },
  {
    id: 2,
    name: 'John Doe',
    rating: 4,
    image: 'https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg',
    review: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industryLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
  },

];

const HomeThird = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const { name, rating, image, review } = reviews[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h2 className="text-lg text-orange-500 mb-2">What's our customer saying</h2>
      <h1 className="text-3xl font-bold mb-6">Our Customer Feedback</h1>
      <div className="flex flex-col md:flex-row items-center justify-between w-full ">
        <div className=" md:block w-full md:w-1/2">
          <img
            src={reviewImage}
            alt="World Map with Customer Photos"
            className="w-full h-auto"
          />
        </div>
        <div className="flex min-h-56 max-h-96 overflow-y-auto flex-col items-start justify-center w-full md:w-1/2 text-left p-4 md:p-8 ">
          <div className="flex items-center mb-4">
            <img
              src={image}
              alt={name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <div className="flex items-center">
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
          <p className="text-gray-600 mb-6">{review}</p>
          <div className="flex gap-3 justify-center w-full">
            <button
              onClick={handlePrevClick}
              className="bg-orange-500 flex justify-center items-center text-white w-10 h-10 p-2 rounded-full shadow hover:bg-orange-600 transition-colors duration-300"
            >
              &lt;
            </button>
            <button
              onClick={handleNextClick}
              className="bg-orange-500 text-white flex justify-center items-center w-10 h-10 p-2 rounded-full shadow hover:bg-orange-600 transition-colors duration-300"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeThird;
