// src/Homepage.js
import React, { useRef } from "react";
import HomeSecond from "./components/HomeSecond";
import HomeFirst from "./components/HomeFirst";
import HomeThird from "./components/HomeThird";
import HomeFourth from "./components/HomeFourth";

const Home = () => {
  const homeSecondRef = useRef(null);

  return (
    <div className="min-w-screen">
      <HomeFirst homeSecondRef={homeSecondRef} />
      <HomeSecond ref={homeSecondRef} />
      <div className="h-[2px] rounded-lg  bg-black/10 "></div>
      <HomeThird />
      <div className="h-[2px]  rounded-lg  bg-black/10 "></div>
      <HomeFourth />
    </div>
  );
};

export default Home;
