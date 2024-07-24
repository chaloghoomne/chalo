import React from 'react';

const HomeFive = () => {
  const blogs = [
    {
      title: 'Lorem Ipsum is simply dummy text of the printing and',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://media.istockphoto.com/id/1249327609/photo/tourist-couple-enjoy-view-of-the-taj-mahal-agra-at-sunrise-with-moody-sky.jpg?s=612x612&w=0&k=20&c=ns1llSnPO3byvd2qLarWLkmo1K0lnKLa-fddf26Nvh4=', // Replace with the actual path to your image
    },
    {
      title: 'Lorem Ipsum is simply dummy text of the printing and',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://media.istockphoto.com/id/1249327609/photo/tourist-couple-enjoy-view-of-the-taj-mahal-agra-at-sunrise-with-moody-sky.jpg?s=612x612&w=0&k=20&c=ns1llSnPO3byvd2qLarWLkmo1K0lnKLa-fddf26Nvh4=', // Replace with the actual path to your image
    },
    {
      title: 'Lorem Ipsum is simply dummy text of the printing and',
      description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
      image: 'https://media.istockphoto.com/id/1249327609/photo/tourist-couple-enjoy-view-of-the-taj-mahal-agra-at-sunrise-with-moody-sky.jpg?s=612x612&w=0&k=20&c=ns1llSnPO3byvd2qLarWLkmo1K0lnKLa-fddf26Nvh4=', // Replace with the actual path to your image
    },
  ];

  return (
    <div className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Our Recent <span className="text-blue-600">Blogs!</span></h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img className="w-full h-48 object-cover" src={blog.image} alt={blog.title} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                <p className="mt-2 text-gray-600">{blog.description}</p>
                <button className="mt-4 bg-[#F26337] text-white px-4 py-2 rounded">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFive;
