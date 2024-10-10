// src/Homepage.js
import React, { useRef } from "react";
import HomeSecond from "./components/HomeSecond";
import HomeFirst from "./components/HomeFirst";
import HomeThird from "./components/HomeThird";
import HomeFourth from "./components/HomeFourth";

const Home = () => {
  const homeSecondRef = useRef(null);

  return (
    <>
      <HomeFirst homeSecondRef={homeSecondRef} />
      <HomeSecond ref={homeSecondRef} />
      <div className="h-1 rounded-lg border-2  border-black/10 "></div>
      <HomeThird />
      <div className="h-1 rounded-lg border-2  border-black/10 "></div>
      <HomeFourth />
    </>
  );
};

export default Home;
