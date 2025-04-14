import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { Helmet } from "react-helmet";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { useLocation } from "react-router-dom";

const AboutUs = () => {
	const [aboutUsData, setAboutUsData] = useState({
		title: "About us",
		description: "We're a fully distributed team...",
		image: "",
	});
	const [metaData, setMetaData] = useState({
		metaTitle: "Chalo Ghoomne - Travel Blogs",
		metaDescription:
			"Explore exciting travel blogs and discover amazing destinations.",
		metaKeywords: "travel, adventure, tourism, destinations",
	});

	useEffect(() => {
		// Fetch About Us data from API
		const fetchData = async () => {
			// const resp = await  axios.get(`${BASE_URL}/about`)
			// setAboutUsData(resp.data.data)
			const res = await fetchDataFromAPI("GET", `${BASE_URL}/about`);
			console.log("API Response:", res.data);

			// Check if the response is structured as expected
			if (res.data) {
				setAboutUsData(res.data); // Directly set the blog object
			} else {
				console.warn("Unexpected API response format:", res.data);
			}
		};
		fetchData();
	}, []);

  useEffect(() => {
      if (aboutUsData) {
        setMetaData({
          metaTitle: aboutUsData.metaTitle || "Chalo Ghoomne - Travel Blogs",
          metaDescription:
          aboutUsData.metaDescription ||
            "Explore exciting travel blogs and discover amazing destinations.",
          metaKeywords:
          aboutUsData.metaKeywords?.join(", ") ||
            "travel, adventure, tourism, destinations",
        });
        // console.log("Updated Meta Data:", metaData);
      }
    }, [aboutUsData]); // ✅ Runs when `blog` updates
  
    if (!aboutUsData) return <div>Loading...</div>;



	return (
		<div className="bg-white mx-auto container text-black mt-20 p-8">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{metaData.metaTitle}</title>
				<meta name="description" content={metaData.metaDescription} />
				<meta name="keywords" content={metaData.metaKeywords} />
				<link rel="canonical" href="https://chaloghoomne.com/" />
			</Helmet>
			<h1 className="text-4xl font-bold poppins-six text-[#F26337] text-center">
				{/* {aboutUsData.title} */}
			</h1>
			<div className="mt-8 flex justify-center">
				<img
					src={
						aboutUsData.image ||
						"https://t4.ftcdn.net/jpg/05/06/80/79/360_F_506807900_w3mbiKhspSodoRQZEC53lWD3mqfoFeum.jpg"
					}
					alt="Team"
					className="rounded-lg shadow-lg"
				/>
			</div>
			<div className="mt-8">
				<div
					dangerouslySetInnerHTML={{
						__html: aboutUsData.description,
					}}
					className="prose prose-lg max-w-none"
				></div>
			</div>
		</div>
	);
};

export default AboutUs;
