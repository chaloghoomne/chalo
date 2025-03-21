import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { Helmet } from "react-helmet";
import "react-quill/dist/quill.snow.css";
import "tailwindcss/tailwind.css";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";

const BlogDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate()
	const [blog, setBlog] = useState(null);
	const [metaData, setMetaData] = useState({
		metaTitle: "Chalo Ghoomne - Travel Blogs",
		metaDescription:
			"Explore exciting travel blogs and discover amazing destinations.",
		metaKeywords: "travel, adventure, tourism, destinations",
	});

	const { slug } = useParams(); // Get slug from URL
	if (!slug) return <p>Error: Blog not found</p>;
    const blogId = slug.split("-").pop(); // Extract the ID from "my-blog-title-65e1234abcd98765f4321abc"
    console.log(blogId)
    

	// ✅ Fetch Blog Data
	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const res = await fetchDataFromAPI(
					"GET",
					`${BASE_URL}blog/${blogId}`
				);
				// const res = await axios.get(`${BASE_URL}blog/${id}`);
				// console.log("API Response:", res.data);
				// if (res.status === 503) {
				// 	navigate("/503"); // Redirect to Service Unavailable page
				// }

				// Check if the response is structured as expected
				if (res.data) {
					setBlog(res.data); // Directly set the blog object 
				} else {
					console.warn("Unexpected API response format:", res.data);
				}
			} catch (error) {
				navigate("/503")
				console.error("Error fetching blog details:", error);
			}
		};

		fetchBlog();
	}, [id]);


	// const location = useLocation();
	// console.log(location.pathname);
			
	// ✅ Set Meta Data after `blog` is updated
	useEffect(() => {
		if (blog) {
			
			setMetaData({
				
				metaTitle: blog.metaTitle || "Chalo Ghoomne - Travel Blogs",
				metaDescription:
					blog.metaDescription ||
					"Explore exciting travel blogs and discover amazing destinations.",
				metaKeywords:
					blog.metaKeywords?.join(", ") ||
					"travel, adventure, tourism, destinations",
			});
			// console.log("Updated Meta Data:", metaData);
		}
	}, [blog]); // ✅ Runs when `blog` updates

	if (!blog) return <div>Loading...</div>;

	return (
		<div className="container mx-auto mt-24 px-20">
			{/* ✅ Meta Tags */}
			<Helmet>
				<meta charSet="utf-8" />
				<title>{metaData.metaTitle}</title>
				<meta name="description" content={metaData.metaDescription} />
				<meta name="keywords" content={metaData.metaKeywords} />
				<link rel="canonical" href="https://chaloghoomne.com/" />
			</Helmet>

			{/* ✅ Blog Content */}
			<img
				src={blog.imageUrl}
				alt={blog.imageAlt || blog.title}
				className="w-full h-64 object-cover mb-6 rounded"
			/>
			<div className="flex items-center mb-4">
				<span className="text-gray-600 mr-4">{blog.publisher}</span>
				<span className="text-gray-600">{blog.readingTime} min</span>
			</div>
			<h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
			<div
				dangerouslySetInnerHTML={{
					__html: blog.description,
				}}
				className="prose prose-lg max-w-none"
			></div>
		</div>
	);
};

export default BlogDetails;
