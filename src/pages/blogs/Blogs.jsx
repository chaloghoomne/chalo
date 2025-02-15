import React, { useEffect, useState } from 'react';

import axios from 'axios';
import BlogCard from './BlogCard';
import { BASE_URL } from '../../api-integration/urlsVariable';
import { Helmet } from 'react-helmet';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/blogs`)  // Replace with your API URL
      .then(response => setBlogs(response.data.data))
      .catch(error => console.error('Error fetching blogs', error));
  }, []);

  return (
    <div className="container mt-28 mx-auto px-4">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <h2 className="text-2xl mb-4">Recently Published</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blogs.map((blog,index) => (
          <BlogCard key={blog?.id || index} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default Blog;
