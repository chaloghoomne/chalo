"use client"

import { useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch } from "react-redux"
import { fetchDataFromAPI } from "../../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable"
import { searchPackageByValue } from "../../../redux/actions/package-id-actions"
import homefirst from "../../../assets/homefirst.png";
import india from "../../../assets/india.png"
import uae from "../../../assets/UAE.png"
import italy from "../../../assets/Italy.png"
import flight from "../../../assets/flight3.jpg"

const HomeFirst = ({ homeSecondRef }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const dispatch = useDispatch()

  // 3D effect state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const fetchHeadingData = async () => {
      setLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Main`)
        if (response) {
          setData(response.data)
        }
      } catch (error) {
        console.error("Error fetching heading data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeadingData()
  }, [])

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e
    const { left, top, width, height } = currentTarget.getBoundingClientRect()

    // Calculate mouse position relative to the center of the element
    const x = (clientX - left - width / 2) / 20 // Reduced divisor for more subtle movement
    const y = -(clientY - top - height / 2) / 20 // Negative for correct direction

    setMousePosition({ x, y })
  }

  const handleInputValue = (e) => {
    const value = e.target.value
    setInputValue(value)
    dispatch(searchPackageByValue(value))

    if (homeSecondRef?.current) {
      const targetPosition = homeSecondRef.current.offsetTop
      const scrollPosition = targetPosition - window.innerHeight / 3

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative flex flex-col shadow-lg mt-10 md:flex-row items-center gap-6 md:justify-between h-auto px-6 py-8 md:py-12 rounded-xl overflow-hidden" style={{ backgroundImage: `url(${flight})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Desktop Content */}
      <div className="md:flex hidden text-white flex-col items-start w-full md:w-[50%] text-left p-2 md:pt-12 md:pb-8 z-10">
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h1
                className="text-5xl md:w-[90%] flex flex-col gap-3 font-bold mb-6"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
              >
                {data?.title || "Get the VISA simple, fast & Reliable"}
                <span className="text-2xl font-medium mt-2">Get your visa with Chalo Ghoomne</span>
              </h1>

              <p className="text-md relative md:w-[80%] font-medium md:text-lg mb-10 opacity-90">
                {data?.description ||
                  "We make your travel dreams come true with hassle-free visa services and exclusive travel packages."}
              </p>

              <div className="flex items-center md:w-[80%] px-6 flex-wrap gap-5 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                <div className="flex justify-start px-5 bg-white border border-gray-200 rounded-lg items-center shadow-sm">
                  <CiSearch size={24} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Where to..."
                    value={inputValue}
                    onChange={handleInputValue}
                    className="flex-grow focus:outline-none w-[100%] xl:w-64 text-black p-3 rounded-lg"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#F26337] min-w-28 sm:w-full xl:w-36 text-white font-medium py-3 px-6 rounded-full shadow-md"
                >
                  Get Started
                </motion.button>
              </div>

              <p className="mt-4 text-[12px] opacity-80">
                {data?.shortDescription || "*Exclusive offers on VISA service, Air Tickets, and Travel Packages."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Section */}
      <div className="flex items-center md:justify-end justify-center w-full md:w-[45%] p-2 md:px-4 z-10">
        <motion.div
          className="relative w-72 h-72 md:w-96 md:h-96 cursor-pointer"
          style={{ perspective: 1500 }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            setMousePosition({ x: 0, y: 0 })
          }}
        >
          <motion.div
            className="w-full h-full rounded-2xl "
            animate={{
              rotateX: isHovering ? mousePosition.y : 0,
              rotateY: isHovering ? mousePosition.x : 0,
              scale: isHovering ? 1.02 : 1,
              // boxShadow: isHovering ? "0 20px 30px rgba(0,0,0,0.2)" : "0 10px 20px rgba(0,0,0,0.15)",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.8,
            }}
          >
            <motion.img
              src={homefirst}
              alt="Travel Destination"
              className="w-full h-full object-cover absolute top-14 mb-10 lg:top-10 lg:right-24"
              initial={{ scale: 1 }}
              animate={{
                scale: isHovering ? 1.22 : 1.2,
              }}
              transition={{
                scale: { duration: 0.4 },
              }}
            />
            <motion.img
              src={italy}
              alt="Travel Destination"
              className="h-24 w-16 absolute top-44 right-3 md:top-52 md:-right-2 lg:right-24"
              initial={{ scale: 0.5 }}
              animate={{
                scale: isHovering ? 1.22 : 1.2,
                x: [-4, 4, -4],
              }}
              transition={{
                scale: { duration: 0.4 },
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <motion.img
              src={india}
              alt="Travel Destination"
              className="h-28 w-24 absolute -bottom-9 left-4 md:bottom-2 md:left-8 lg:-bottom-14 lg:-left-5"
              initial={{ scale: 0.8 }}
              animate={{
                scale: isHovering ? 1.22 : 1.2,
                x: [-4, 4, -4],
              }}
              transition={{
                scale: { duration: 0.4 },
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            <motion.img
              src={uae}
              alt="Travel Destination"
              className="h-28 w-24 absolute top-16 left-8 md:top-16 md:left-4 lg:top-20 lg:-left-10"
              initial={{ scale: 0.8 }}
              animate={{
                scale: isHovering ? 1.22 : 1.2,
                x: [-4, 4, -4],
              }}
              transition={{
                scale: { duration: 0.4 },
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            {/* <video
        src={myname}
        controls
        className="w-full max-w-3xl rounded-lg shadow-lg"
      /> */}
            <motion.div
              className="absolute inset-0 bg-transparent"
              animate={{
                opacity: isHovering ? 0.6 : 0.4,
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile Content */}
      <div className="flex md:hidden text-white flex-col items-start justify-center w-full text-left p-2 z-10">
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <h1 className="text-2xl font-bold my-5 ">
                {data?.title || "Get the VISA simple, fast & Reliable"}
                <p className="text-xl mt-2">{data?.subHeading || "Get your visa with Chalo Ghoomne"}</p>
              </h1>

              <p className="text-md mb-6 opacity-90">
                {data?.description || "We make your travel dreams come true with hassle-free visa services."}
              </p>

              <div className="flex flex-col items-center p-4 gap-3 bg-white/80 backdrop-blur-sm rounded-xl w-full">
                <div className="flex justify-start w-full px-4 bg-white border border-gray-200 rounded-lg items-center">
                  <CiSearch size={22} className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Where to..."
                    value={inputValue}
                    onChange={handleInputValue}
                    className="flex-grow focus:outline-none w-full text-black p-3"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-[#F26337] w-full text-white font-medium p-3 rounded-lg"
                >
                  Get Started
                </motion.button>
              </div>

              <p className="my-3 text-xs opacity-80">
                {data?.shortDescription || "*Exclusive offers on VISA service, Air Tickets, and Travel Packages."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-300 opacity-20 blur-3xl"
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-3xl"
          animate={{
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 10,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-20"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-white font-medium">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomeFirst

