import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../api-integration/urlsVariable';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/blog/${id}`)  // Replace with your API URL
      .then(response => setBlog(response.data.data))
      .catch(error => console.error('Error fetching blog details', error));
  }, [id]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-24  px-20 px-4">
      <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover mb-6 rounded" />
      <div className="flex items-center mb-4">
        <span className="text-gray-600 mr-4">{blog.publisher}</span>
        <span className="text-gray-600">{blog.readingTime}min</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      
      <div className="text-gray-800">
        <p>{blog.description}</p>
      </div>
    </div>
  );
};

export default BlogDetails;
