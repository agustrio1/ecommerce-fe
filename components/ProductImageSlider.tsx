'use client';

import { useState } from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductImage {
  isPrimary: boolean;
  image: string;
}

interface ProductImageSliderProps {
  images: ProductImage[];
  altText: string;
}

const ProductImageSlider: React.FC<ProductImageSliderProps> = ({
  images,
  altText,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Main Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          enabled: true 
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="w-full aspect-square md:aspect-[4/3] lg:aspect-[16/9]"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image.image}
                alt={`${altText} - ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={index === 0}
                className="object-contain"
                quality={80}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Navigation */}
      <div className="hidden md:flex justify-center mt-4 gap-2">
        {images.map((image, index) => (
          <button
            key={`thumb-${index}`}
            onClick={() => setActiveIndex(index)}
            className={`w-16 h-16 relative rounded-lg overflow-hidden transition-all
              ${activeIndex === index ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'}`}
          >
            <Image
              src={image.image}
              alt={`${altText} thumbnail ${index + 1}`}
              fill
              sizes="64px"
              className="object-contain" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageSlider;
