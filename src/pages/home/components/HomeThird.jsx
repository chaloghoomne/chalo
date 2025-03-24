"use client"

import { useEffect, useState, useRef } from "react"
import { fetchDataFromAPI } from "../../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable"
import { motion, AnimatePresence } from "framer-motion"
import { FaQuoteLeft, FaStar, FaStarHalf } from "react-icons/fa"
import { HiChevronLeft, HiChevronRight } from "react-icons/hi"
import homethird from "../../../assets/homeThird.png"
import {gsap} from "gsap"
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Sample reviews data (will be replaced with API data in production)
const reviews = [
  {
    id: 1,
    name: "Jaylon Vaccaro",
    position: "Travel Enthusiast",
    rating: 5,
    image: "https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg",
    review:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which.",
  },
  {
    id: 2,
    name: "John Doe",
    position: "Business Traveler",
    rating: 4.5,
    image: "https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg",
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industryLorem Ipsum is simply dummy text of the printing and.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    position: "Digital Nomad",
    rating: 5,
    image: "https://www.shutterstock.com/image-photo/profile-picture-smiling-successful-young-260nw-2040223583.jpg",
    review:
      "The visa process was incredibly smooth and the customer service was exceptional. I couldn't have asked for a better experience with my international travel plans.",
  },
]

const HomeThird = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [data, setData] = useState()
  const [isAnimating, setIsAnimating] = useState(false)
  const testimonialsRef = useRef(null)

  const containerRef = useRef(null)
  const elementRef = useRef(null)
  const headingRef = useRef(null)
  const paragraphRef = useRef(null)

  useEffect(() => {
  let ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 60%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      elementRef.current,
      { x: 100, y: 30, opacity: 0, scale: 0.9, rotationZ: 2 },
      { x: 0, y: 0, opacity: 1, scale: 1, rotationZ: 0, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(
        headingRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.7"
      )
      .fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.5"
      );
  });

  return () => ctx.revert(); // ✅ Proper cleanup to remove only this component's animations
}, []);
  
  

  useEffect(() => {
    const fetchHeadingData = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Feedback`)
        if (response) {
          setData(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchHeadingData()
  }, [])

  const handlePrevClick = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNextClick = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalf key="half-star" className="text-yellow-400" />)
    }

    return stars
  }

  const currentReview = reviews[currentIndex]

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-orange-50 py-16 md:py-24">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-100 rounded-full opacity-30 translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={testimonialsRef}>
        {/* Section heading with animated underline */}
        <div className="text-center mb-16">
          <h2 className="inline-block text-orange-500 text-lg md:text-xl font-medium mb-3 relative">
            {data?.heading || "TESTIMONIALS"}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></span>
          </h2>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 relative inline-block">
            {data?.title || "What Our Clients Say"}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full"></div>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left side - Decorative image */}
          <div className="w-full lg:w-5/12 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-2xl transform rotate-3"></div>
              <div ref={headingRef} className="relative bg-white p-4 md:p-6 rounded-2xl shadow-xl transform -rotate-3 transition-transform duration-500 hover:rotate-0">
                <img
                  src={homethird}
                  alt="World Map with Customer Testimonials"
                  className="w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/600x400?text=World+Map"
                  }}
                />

                {/* Floating testimonial bubbles */}
                <div className="absolute top-1/4 left-1/4 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-lg overflow-hidden transform hover:scale-110 transition-transform duration-300">
                  <img
                    src={reviews[0].image || "/placeholder.svg"}
                    alt="Testimonial"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1/3 right-1/4 w-10 h-10 md:w-14 md:h-14 rounded-full border-4 border-white shadow-lg overflow-hidden transform hover:scale-110 transition-transform duration-300">
                  <img
                    src={reviews[1].image || "/placeholder.svg"}
                    alt="Testimonial"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-1/4 right-1/3 w-12 h-12 md:w-16 md:h-16 rounded-full border-4 border-white shadow-lg overflow-hidden transform hover:scale-110 transition-transform duration-300">
                  <img
                    src={reviews[2].image || "/placeholder.svg"}
                    alt="Testimonial"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center mt-8 gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-orange-500">500+</p>
                <p className="text-gray-600 text-sm md:text-base">Happy Clients</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-orange-500">50+</p>
                <p className="text-gray-600 text-sm md:text-base">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-orange-500">4.9</p>
                <p className="text-gray-600 text-sm md:text-base">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right side - Testimonial carousel */}
          <div className="w-full lg:w-7/12">
            <div className="relative bg-white rounded-2xl shadow-xl p-6 md:p-10 overflow-hidden">
              {/* Quote icon */}
              <FaQuoteLeft className="absolute top-6 left-6 text-orange-200 text-4xl md:text-6xl opacity-50" />

              {/* Testimonial content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10"
                >
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-orange-100">
                        <img
                          src={currentReview.image || "/placeholder.svg"}
                          alt={currentReview.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {currentIndex + 1}/{reviews.length}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{currentReview.name}</h3>
                      <p className="text-gray-500">{currentReview.position}</p>
                      <div className="flex mt-1">{renderRatingStars(currentReview.rating)}</div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-8">"{currentReview.review}"</p>
                </motion.div>
              </AnimatePresence>

              {/* Navigation controls */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePrevClick}
                  className="group flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300"
                  disabled={isAnimating}
                >
                  <span className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all duration-300">
                    <HiChevronLeft className="w-5 h-5" />
                  </span>
                  <span className="hidden md:inline text-sm font-medium">Previous</span>
                </button>

                {/* Pagination dots */}
                <div className="hidden md:flex items-center gap-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAnimating && index !== currentIndex) {
                          setIsAnimating(true)
                          setCurrentIndex(index)
                          setTimeout(() => setIsAnimating(false), 500)
                        }
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "bg-orange-500 w-6" : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextClick}
                  className="group flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors duration-300"
                  disabled={isAnimating}
                >
                  <span className="hidden md:inline text-sm font-medium">Next</span>
                  <span className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-orange-500 group-hover:bg-orange-50 transition-all duration-300">
                    <HiChevronRight className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeThird

