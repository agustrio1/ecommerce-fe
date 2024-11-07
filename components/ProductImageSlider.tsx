'use client';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
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
  return (
    <Swiper
    spaceBetween={20}
    slidesPerView={1}
    loop
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    navigation
    pagination={{ clickable: true, enabled: true }}
    scrollbar={{ draggable: true }}
    modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
    className="w-full rounded-lg shadow-lg"
  >
    {images.map((image, index) => (
      <SwiperSlide key={index}>
        <Image
          src={image.image}
          alt={altText}
          width={600}
          height={400}
          priority
          className="object-cover w-full h-96 rounded-lg"
        />
      </SwiperSlide>
    ))}
  </Swiper>
  
  );
};

export default ProductImageSlider;
