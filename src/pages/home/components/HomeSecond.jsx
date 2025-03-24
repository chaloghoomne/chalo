"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import VisaCard from "./VisaCard"
import { fetchDataFromAPI } from "../../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable"
import { useSelector } from "react-redux"
import debounce from "lodash/debounce"
import { MdKeyboardArrowRight } from "react-icons/md"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Only register plugins on the client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const HomeSecond = forwardRef((props, ref) => {
  const [packages, setPackages] = useState([])
  const [allPackages, setAllPackages] = useState([])
  const [headingData, setHeadingData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const containerRef = useRef(null)
  const elementRef = useRef(null)
  const headingRef = useRef(null)
  const paragraphRef = useRef(null)

  useEffect(() => {
    // Ensure we're in the browser and refs are available
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      !elementRef.current ||
      !headingRef.current ||
      !paragraphRef.current
    )
      return

    // Create a main timeline
    let ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 50%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Element animation with improved motion
    tl.fromTo(
      elementRef.current,
      {
        x: 100,
        y: 30,
        opacity: 0,
        scale: 0.9,
        rotationZ: 2,
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        rotationZ: 0,
        duration: 1.2,
        ease: "power3.out",
      },
    )

    // Animate heading with a modern reveal effect
    tl.fromTo(
      headingRef.current,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.7",
    )

    // Animate paragraph with a fade-in effect
    tl.fromTo(
      paragraphRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Cleanup function
    return () => ctx.revert(); 
  })
  }, [])

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
      setIsLoading(true)
      try {
        const cachedData = localStorage.getItem("Package")

        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          setAllPackages(parsedData)
          setPackages(parsedData)
        } else {
          const response = await fetchDataFromAPI("GET", `${BASE_URL}places?country=${inputValue}`)

          if (response?.data) {
            setAllPackages(response.data)
            setPackages(response.data)
            localStorage.setItem("Package", JSON.stringify(response.data))
          }
        }
      } catch (error) {
        console.error("Error fetching packages:", error)
        setError("Failed to load visa packages")
      } finally {
        setIsLoading(false)
      }
    }

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

  const toggleShowAll = () => {
    setShowAll((prev) => !prev)
  }

  const displayedPackages = showAll ? packages : packages.slice(0, ITEMS_PER_PAGE)

  if (error) {
    return (
      <div className="py-10 px-5 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div
      ref={(el) => {
        // Handle both the forwarded ref and our containerRef
        if (typeof ref === "function") ref(el)
        else if (ref) ref.current = el
        containerRef.current = el
      }}
      className="py-8 md:py-12 px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto"
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading visa packages...</p>
        </div>
      ) : (
        <>
          <h1
            ref={headingRef}
            className="text-3xl md:text-4xl lg:text-5xl poppins-six text-center font-bold mb-6 md:mb-10 relative inline-block w-full"
          >
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-orange-500 hover:to-yellow-600 transition-all duration-700">
              {headingData?.heading || "World Best Visas Requested Countries"}
            </span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-500 rounded-full transition-all duration-300 hover:w-48"></span>
          </h1>
          <p ref={paragraphRef} className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
            {headingData?.subHeading ||
              "Explore our selection of visa packages for the most requested destinations around the world."}
          </p>

          {packages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No visa packages found for your search.</p>
            </div>
          ) : (
            <>
              <div
                ref={elementRef}
                className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              >
                {displayedPackages.map((visa, index) => (
                  <VisaCard
                    key={index}
                    image={visa?.image}
                    altImage={visa?.altImage}
                    city={visa?.city}
                    country={visa?.country}
                    price={visa?.price}
                    rating={visa?.rating}
                    id={visa?._id}
                    description={visa?.description}
                  />
                ))}
              </div>

              {packages.length > ITEMS_PER_PAGE && (
                <button
                  onClick={toggleShowAll}
                  className="group relative mt-10 mx-auto block px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-md text-lg font-semibold poppins-six overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-yellow-300/50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {showAll ? "Show Less" : "View All"}

                    {!showAll && (
                      <span className="flex transition-transform duration-300 group-hover:translate-x-1">
                        <MdKeyboardArrowRight size={22} />
                        <MdKeyboardArrowRight
                          size={22}
                          className="absolute opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-4"
                        />
                      </span>
                    )}
                  </span>

                  {/* Button background animation */}
                  <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-500 to-yellow-500 scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
})

// DisplayName is better than using eslint-disable
HomeSecond.displayName = "HomeSecond"

export default HomeSecond

