import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import CameraModel from './CameraModel';
import VideoCarousel from './VideoCarousel';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function CameraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    setWebGLSupported(isWebGLAvailable());
    
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          }
        }
      );
    }
  }, []);

  return (
    <section 
      id="camera-section"
      ref={sectionRef} 
      className="relative h-[120vh] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute top-12 left-0 w-full text-center z-10 pointer-events-none">
        <h2 className="text-sm tracking-[0.3em] text-zinc-500 uppercase font-mono">Interactive View</h2>
        <p className="text-2xl font-light mt-2 text-zinc-300">Explore our latest productions</p>
      </div>
      
      <div className="w-full h-full absolute inset-0">
        {webGLSupported ? (
          <Canvas 
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#09090b']} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            {/* Rim Light */}
            <spotLight position={[0, 5, -10]} angle={0.3} penumbra={1} intensity={2} color="#ffffff" />
            
            <CameraModel />
            
            <Environment preset="studio" />
            <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 pt-32">
            <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
              <VideoCarousel />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
