import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import { Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const VIDEOS = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?q=80&w=1974&auto=format&fit=crop",
    video: "https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=2006&auto=format&fit=crop",
    video: "https://videos.pexels.com/video-files/2887463/2887463-uhd_2560_1440_25fps.mp4"
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=2059&auto=format&fit=crop",
    video: "https://videos.pexels.com/video-files/3121475/3121475-uhd_2560_1440_24fps.mp4"
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    video: "https://videos.pexels.com/video-files/3121460/3121460-uhd_2560_1440_24fps.mp4"
  }
];

export default function VideoCarousel() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-zinc-950 relative">
      {activeVideo ? (
        <div className="absolute inset-0 z-50 bg-black flex flex-col">
          <button 
            onClick={() => setActiveVideo(null)}
            className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/80 p-2 rounded-full backdrop-blur-sm transition-colors"
          >
            Close
          </button>
          <video 
            src={activeVideo} 
            autoPlay 
            controls 
            className="w-full h-full object-contain"
          />
        </div>
      ) : null}

      <Swiper
        modules={[Navigation, Pagination, Mousewheel]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        mousewheel={true}
        loop={true}
        className="w-full h-full"
      >
        {VIDEOS.map((item) => (
          <SwiperSlide key={item.id}>
            <div 
              className="w-full h-full relative group cursor-pointer"
              onClick={() => setActiveVideo(item.video)}
            >
              <img 
                src={item.thumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              
              {/* Hover Video Preview */}
              <video 
                src={item.video}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom styles for Swiper to match cinematic feel */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .swiper:hover .swiper-button-next,
        .swiper:hover .swiper-button-prev {
          opacity: 0.7;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          opacity: 1 !important;
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.3;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
