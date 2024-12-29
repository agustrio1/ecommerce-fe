'use client';

import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';

import "swiper/css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <section className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">Tidak ada kategori tersedia.</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Kategori Populer
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded" />
          </div>
        </header>

        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            slidesPerView={2}
            spaceBetween={24}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 6,
              },
            }}
            className="py-4"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link href={`/categories/${category.slug}`} className="block group">
                  <article className="relative aspect-square rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <Image
                      src={category.image || ''}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="/placeholder-card.svg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h3 className="text-white font-semibold text-lg group-hover:text-blue-200 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="swiper-button-prev !hidden md:!flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm text-gray-800 w-10 h-10 rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl -left-5" />
          <button className="swiper-button-next !hidden md:!flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm text-gray-800 w-10 h-10 rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:shadow-xl -right-5" />
        </div>
      </div>
    </section>
  );
};

export default React.memo(CategorySection);
