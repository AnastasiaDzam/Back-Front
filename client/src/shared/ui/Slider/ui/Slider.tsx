/* eslint-disable @typescript-eslint/ban-ts-comment */
import styles from './Slider.module.css';
import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

//@ts-ignore
import 'swiper/css';
//@ts-ignore
import 'swiper/css/navigation';
//@ts-ignore
import 'swiper/css/pagination';
//@ts-ignore
import 'swiper/css/scrollbar';

type SliderProps = {
  images: { src: string }[];
};

export function Slider({ images }: SliderProps): React.JSX.Element {
  return (
    <Swiper
      className={styles.swiperContainer}
      loop={false}
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={0}
      speed={400}
      slidesPerView="auto"
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {images.map((image) => (
        <SwiperSlide key={image.src}>
          <div className={styles.slide}>
            <img
              className={styles.image}
              src={`${import.meta.env.VITE_IMAGES}/${image.src}`}
              alt="картинка желания"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
