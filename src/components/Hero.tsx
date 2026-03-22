import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/60 z-10" />
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4"
      />
      <div className="relative z-20 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-8xl font-bold tracking-tighter uppercase font-sans"
        >
          Cinematic<br />Vision
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light"
        >
          Experience the world through a different lens. Governmental and institutional narratives crafted with precision.
        </motion.p>
      </div>
    </section>
  );
}
