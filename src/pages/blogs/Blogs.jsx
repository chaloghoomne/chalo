import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "./BlogCard";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { Helmet } from "react-helmet";

const Blog = () => {
  const [blogs, setBlogs] = useState([]); // All blogs from API
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Blogs after filtering
  const [sortOrder, setSortOrder] = useState("latest"); // Sorting state

  useEffect(() => {
    axios
      .get(`${BASE_URL}/blogs`) // Replace with your actual API URL
      .then((response) => {
        const sortedBlogs = sortBlogs(response.data.data, "latest");
        setBlogs(response.data.data);
        setFilteredBlogs(sortedBlogs);
      })
      .catch((error) => console.error("Error fetching blogs", error));
  }, []);

  console.log(filteredBlogs);

  // ✅ Function to sort blogs by date (newest to oldest or vice versa)
  const sortBlogs = (blogs, order) => {
    return [...blogs].sort((a, b) => {
      const dateA = new Date(a.createdAt); // Assuming the API returns a "date" field
      const dateB = new Date(b.createdAt);
      return order === "latest" ? dateB - dateA : dateA - dateB;
    });
  };

  // ✅ Function to toggle sorting order
  const handleSort = (order) => {
    setSortOrder(order);
    setFilteredBlogs(sortBlogs(blogs, order));
  };

  if (filteredBlogs.length === 0) {
    return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
  }

  return (
    <div className="container mt-28 mx-auto px-4">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Blogs</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <h2 className="text-2xl mb-4">Recently Published</h2>

      {/* 🔥 Sorting Options */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => handleSort("latest")}
          className={`px-4 py-2 rounded-md transition ${
            sortOrder === "latest" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          Show Most Recent
        </button>
        <button
          onClick={() => handleSort("oldest")}
          className={`px-4 py-2 rounded-md transition ${
            sortOrder === "oldest" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          Show Oldest First
        </button>
      </div>

      {/* 🔥 Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, index) => (
          <BlogCard key={blog?.id || index} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
