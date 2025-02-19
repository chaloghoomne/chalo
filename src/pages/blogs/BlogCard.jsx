import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="w-80 bg-slate-100 flex flex-col border border-slate-400  rounded-lg overflow-hidden  shadow-gray-200 shadow-lg">
      <img className="w-80 h-56" src={blog.imageUrl} alt={blog.title} />
      <span className="text-gray-600 self-end pr-5  text-sm ml-4">{blog.readingTime}min</span>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          <Link className='underline text-blue-500' to={`/blog/${blog._id}`}>{blog.title}</Link>
        </div>
        <p className="text-gray-700 text-base">
        {blog?.description?.substring(4, 30)}...
        </p>
      </div>
      <div className="px-6 flex justify-between pt-2 pb-2">
        <span className="text-gray-600 text-sm">{blog.publisher}</span>
       
        <span className="text-gray-600 text-sm ml-4">{blog.createdAt.slice(0,10)}</span>

      </div>
      
    </div>
  );
};

export default BlogCard;
