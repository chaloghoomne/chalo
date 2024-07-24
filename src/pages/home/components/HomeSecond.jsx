import React from 'react';
import VisaCard from './VisaCard';



const visaData = [
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Tokyo',
    country: 'Tokyo, Japan',
    price: 360,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Rome',
    country: 'Rome, Italy',
    price: 370,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Barcelona',
    country: 'Barcelona, Spain',
    price: 400,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Tokyo',
    country: 'Tokyo, Japan',
    price: 360,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Rome',
    country: 'Rome, Italy',
    price: 370,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Barcelona',
    country: 'Barcelona, Spain',
    price: 400,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Tokyo',
    country: 'Tokyo, Japan',
    price: 360,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Rome',
    country: 'Rome, Italy',
    price: 370,
    rating: '5.0'
  },
  {
    image: 'https://media.tacdn.com/media/attractions-splice-spp-674x446/06/f1/db/f1.jpg',
    city: 'Barcelona',
    country: 'Barcelona, Spain',
    price: 400,
    rating: '5.0'
  },
  // Add more data as needed
];

const HomeSecond = () => {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">World Best Visas Requested Countries</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visaData.map((visa, index) => (
          <VisaCard
            key={index}
            image={visa.image}
            city={visa.city}
            country={visa.country}
            price={visa.price}
            rating={visa.rating}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeSecond;
