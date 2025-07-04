"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import VisaCard from "./VisaCard"
import { fetchDataFromAPI } from "../../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable"
import { useSelector } from "react-redux"
import debounce from "lodash/debounce"
import { MdKeyboardArrowRight } from "react-icons/md"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"

const HomeSecond = forwardRef((props, ref) => {
  const [packages, setPackages] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [headingData, setHeadingData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef(null)
  const sectionInView = useInView(containerRef, { once: false, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (sectionInView) {
      controls.start("visible")
    }
  }, [sectionInView, controls])

  const ITEMS_PER_PAGE = 12

  const inputValue = useSelector((state) => state.SearchPackageReducer.inputValue)

  // Fetch heading data
  useEffect(() => {
    const fetchHeadingData = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Main`)
        if (response) {
          setHeadingData(response.data)
        }
      } catch (error) {
        console.error("Error fetching heading data:", error)
        setError("Failed to load page content")
      }
    }

    fetchHeadingData()
  }, [])

  // Fetch packages data
  useEffect(() => {
    const fetchPackages = async () => {
  setIsLoading(true);
  try {
    const cachedData = localStorage.getItem("Package");
    const cachedVersion = localStorage.getItem("PackageVersion");

    // 1. Get the latest version from the server
    const versionRes = await fetchDataFromAPI("GET", `${BASE_URL}places/version`);
    const serverVersion = versionRes?.version; // <- FIX: extract the actual version string

    console.log("Cached version:", cachedVersion);
    console.log("Server version:", serverVersion);

    // 2. Use cached data only if versions match
    if (cachedData && cachedVersion === serverVersion && cachedVersion !== null) {
      const parsedData = JSON.parse(cachedData);
      setAllPackages(parsedData);
      setPackages(parsedData);
      console.log("✅ Loaded packages from localStorage");
    } else {
      // 3. Fetch fresh data
      const response = await fetchDataFromAPI("GET", `${BASE_URL}places?country=${inputValue}`);
      if (response?.data) {
        setAllPackages(response.data);
        setPackages(response.data);
        localStorage.setItem("Package", JSON.stringify(response.data));
        localStorage.setItem("PackageVersion", serverVersion); // <- FIX: save correct version
        console.log("🔄 Fetched new data and updated cache");
      }
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    setError("Failed to load visa packages");
  } finally {
    setIsLoading(false);
  }
};


    fetchPackages()
  }, [inputValue])

  // Filter and sort packages based on input
  useEffect(() => {
    const filterAndSortPackages = debounce(() => {
      if (!allPackages.length) return

      if (!inputValue.trim()) {
        setPackages(allPackages)
      } else {
        const filtered = allPackages
          .filter(
            (visa) =>
              visa?.country?.toLowerCase().includes(inputValue.toLowerCase()) ||
              visa?.city?.toLowerCase().includes(inputValue.toLowerCase()),
          )
          .sort((a, b) => {
            const countryA = a?.country?.toLowerCase() || ""
            const countryB = b?.country?.toLowerCase() || ""
            const query = inputValue.toLowerCase()

            // Prioritize countries that start with the search term
            if (countryA.startsWith(query) !== countryB.startsWith(query)) {
              return countryA.startsWith(query) ? -1 : 1
            }

            return countryA.localeCompare(countryB)
          })

        setPackages(filtered)
      }
    }, 300)

    filterAndSortPackages()
    return () => filterAndSortPackages.cancel()
  }, [inputValue, allPackages])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleShowAll = () => {
    setShowAll((prev) => !prev)
  }

  const displayedPackages = showAll ? packages : packages.slice(0, ITEMS_PER_PAGE)
  console.log(displayedPackages)

  // Animation variants
  const containerVariants = {
    hidden: isMobile ? { opacity: 1 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0 : 0.05,
        delayChildren: isMobile ? 0 : 0.1,
      },
    },
  }

  const headingVariants = {
    hidden: isMobile ? { opacity: 1 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0 : 0.5,
      },
    },
  }

  const paragraphVariants = {
    hidden: isMobile ? { opacity: 1, y: 0 } : { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: isMobile ? "tween" : "spring",
        stiffness: 100,
        damping: 15,
        delay: isMobile ? 0 : 0.2,
        duration: isMobile ? 0 : undefined,
      },
    },
  }

  const cardVariants = {
    hidden: isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: isMobile ? "tween" : "spring",
        stiffness: isMobile ? undefined : 70,
        duration: isMobile ? 0 : undefined,
        damping: isMobile ? undefined : 15,
        delay: isMobile ? 0 : i * 0.03,
      },
    }),
  }

  const buttonVariants = {
    hidden: isMobile ? { opacity: 1 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0 : 0.5,
        delay: isMobile ? 0 : 0.2,
      },
    },
    hover: {
      scale: isMobile ? 1 : 1.03,
      transition: {
        duration: isMobile ? 0 : 0.2,
      },
    },
    tap: {
      scale: isMobile ? 1 : 0.98,
    },
  }

  const loaderVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "linear",
      },
    },
  }

  if (error) {
    return (
      <motion.div
        className="py-10 px-5 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-red-500"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {error}
        </motion.p>
        <motion.button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={(el) => {
        // Handle both the forwarded ref and our containerRef
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
        containerRef.current = el
      }}
      className="py-6 md:py-12 px-3 md:px-5 lg:px-5 max-w-screen mx-auto overflow-x-hidden"
      variants={containerVariants}
      initial={isMobile ? "visible" : "hidden"}
      animate={isMobile ? "visible" : controls}
    >
      {isLoading ? (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[200px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
            variants={loaderVariants}
            animate="animate"
          ></motion.div>
          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading visa packages...
          </motion.p>
        </motion.div>
      ) : (
        <>
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl poppins-six text-center font-bold mb-4 md:mb-6 relative inline-block w-full"
            variants={headingVariants}
          >
            <motion.span
              className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-orange-500 hover:to-yellow-600 transition-all duration-700"
              whileHover={{ scale: 1.02 }}
            >
              {headingData?.heading || "World Best Visas Requested Countries"}
            </motion.span>
            <motion.span
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-500 rounded-full"
              whileHover={{ width: 200 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            ></motion.span>
          </motion.h1>

          <motion.p className="text-center text-gray-600 max-w-3xl mx-auto mb-8" variants={paragraphVariants}>
            {headingData?.subHeading ||
              "Explore our selection of visa packages for the most requested destinations around the world."}
          </motion.p>

          {packages.length === 0 ? (
            <motion.div
              className="text-center py-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p
                className="text-xl text-gray-600"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                No visa packages found for your search.
              </motion.p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                variants={containerVariants}
              >
                <AnimatePresence>
                  {displayedPackages.map((visa, index) => (
                    <motion.div
                      key={visa?._id || index}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <VisaCard
                        image={visa?.image}
                        altImage={visa?.altImage}
                        city={visa?.city}
                        country={visa?.country}
                        price={visa?.price}
                        rating={visa?.rating}
                        slug = {visa?.slug}
                        id={visa?._id}
                        description={visa?.description}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {packages.length > ITEMS_PER_PAGE && (
                <motion.button
                  onClick={toggleShowAll}
                  className="group relative mt-8 mx-auto block px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md text-base sm:text-lg font-semibold poppins-six overflow-hidden"
                  variants={buttonVariants}
                  whileHover={isMobile ? undefined : "hover"}
                  whileTap={isMobile ? undefined : "tap"}
                >
                  <motion.span className="relative z-10 flex items-center justify-center gap-2">
                    {showAll ? "Show Less" : "View All"}

                    {!showAll && !isMobile && (
                      <motion.span
                        className="flex"
                        animate={isMobile ? undefined : { x: [0, 5, 0] }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          duration: 1.5,
                        }}
                      >
                        <MdKeyboardArrowRight size={22} />
                        <motion.span
                          initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                          animate={isMobile ? undefined : { opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <MdKeyboardArrowRight size={22} />
                        </motion.span>
                      </motion.span>
                    )}

                    {!showAll && isMobile && (
                      <span className="flex">
                        <MdKeyboardArrowRight size={22} />
                        <MdKeyboardArrowRight size={22} />
                      </span>
                    )}
                  </motion.span>

                  {/* Button background animation - disabled on mobile */}
                  {!isMobile && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-500 to-yellow-500"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    ></motion.span>
                  )}
                </motion.button>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  )
})

// DisplayName is better than using eslint-disable
HomeSecond.displayName = "HomeSecond"

export default HomeSecond

