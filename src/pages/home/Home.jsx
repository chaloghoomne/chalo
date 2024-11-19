import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HomeSecond from "./components/HomeSecond";
import HomeFirst from "./components/HomeFirst";
import HomeThird from "./components/HomeThird";
import HomeFourth from "./components/HomeFourth";
import { FaWhatsapp } from "react-icons/fa";

const Home = () => {
  const homeSecondRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // If we're coming from the Visa link with the specific state
    if (location.state?.scrollToVisaSection && homeSecondRef.current) {
      homeSecondRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-w-screen">
      <HomeFirst homeSecondRef={homeSecondRef} />
      <div id="visa-section">
        <HomeSecond ref={homeSecondRef} />
      </div>
      <div className="h-[2px] rounded-lg bg-black/10"></div>
      <HomeThird />
      <div className="h-[2px] rounded-lg bg-black/10"></div>
      <HomeFourth />
      <a
        href="https://wa.me/919555535252"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 rounded-full p-3 shadow-lg whatsapp-icon hover:scale-110 transition-transform duration-300 ease-in-out"
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </a>
    </div>
  );
};

export default Home;