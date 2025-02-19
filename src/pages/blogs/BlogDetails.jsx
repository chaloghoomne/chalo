import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { Helmet } from "react-helmet";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";
import "tailwindcss/tailwind.css";

const BlogDetails = () => {
	const { id } = useParams();
	const [blog, setBlog] = useState("");

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const res = await axios.get(`${BASE_URL}blog/${id}`);
				console.log("API Response:", res.data);

				// Ensure API response structure is correct
				if (res.data && res.data.data) {
					setBlog(res.data.data);

					console.log(blog);
				} else {
					console.warn("Unexpected API response format:", res.data);
				}
			} catch (error) {
				console.error("Error fetching blog details:", error);
			}
		};

		fetchBlog();
	}, [id]);
	if (!blog) return <div>Loading...</div>;

	return (
		<div className="container mx-auto mt-24  px-20">
			<Helmet>
				<meta charSet="utf-8" />
				<title>Chalo Ghoomne</title>
				<link rel="canonical" href="https://chaloghoomne.com/" />
			</Helmet>
			<img
				src={blog.imageUrl}
				alt={blog.title}
				className="w-full h-64 object-cover mb-6 rounded"
			/>
			<div className="flex items-center mb-4">
				<span className="text-gray-600 mr-4">{blog.publisher}</span>
				<span className="text-gray-600">{blog.readingTime}min</span>
			</div>
			<h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
			{/* <div>{blog.description}</div> */}
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
