import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoCarousel from './VideoCarousel';

gsap.registerPlugin(ScrollTrigger);

export default function CameraModel() {
  const outerGroupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const recLightRef = useRef<THREE.MeshStandardMaterial>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse parallax
  const mouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!outerGroupRef.current) return;

    // Start facing away/side, then rotate to show monitor
    gsap.fromTo(outerGroupRef.current.rotation, 
      { y: Math.PI / 4, x: -0.2 },
      { 
        y: Math.PI, // Face the back (monitor) to the user
        x: 0,
        duration: 2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#camera-section",
          start: "top 60%",
        }
      }
    );

    // REC light blinking
    if (recLightRef.current) {
      gsap.to(recLightRef.current, {
        emissiveIntensity: 2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1
      });
    }
  }, []);

  useFrame((state, delta) => {
    if (!innerGroupRef.current) return;
    
    // Smoothly interpolate target rotation based on mouse
    targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, mouse.current.y * 0.15, 0.1);
    targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, mouse.current.x * 0.2, 0.1);

    innerGroupRef.current.rotation.x = targetRotation.current.x;
    innerGroupRef.current.rotation.y = targetRotation.current.y;
  });

  return (
    <group ref={outerGroupRef} dispose={null} position={[0, 0, 0]}>
      <group ref={innerGroupRef}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.8, 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Top Handle */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 1.8]} />
        <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
      </mesh>

      {/* Viewfinder */}
      <mesh position={[-0.8, 0.8, -0.5]} castShadow>
        <boxGeometry args={[0.6, 0.5, 1.2]} />
        <meshStandardMaterial color="#151515" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[-0.8, 0.8, -1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Lens Mount */}
      <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Lens Barrel */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 1.2, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Focus Ring */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.4, 32]} />
        <meshStandardMaterial color="#111" roughness={0.9} metalness={0.1} wireframe={true} />
      </mesh>

      {/* Lens Glass */}
      <mesh position={[0, 0, 2.41]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
        <meshPhysicalMaterial 
          color="#000" 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={2} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
        />
      </mesh>

      {/* REC Light */}
      <mesh position={[0.9, 1.0, -1.11]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.08, 16]} />
        <meshStandardMaterial 
          ref={recLightRef}
          color="#ff0000" 
          emissive="#ff0000" 
          emissiveIntensity={0} 
          toneMapped={false}
        />
      </mesh>

      {/* Battery Pack */}
      <mesh position={[0, -0.2, -1.2]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Back Monitor Bezel */}
      <mesh position={[0, 0.4, -1.05]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.1]} />
        <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Monitor Screen (HTML Overlay) */}
      <mesh 
        position={[0, 0.4, -1.11]} 
        rotation={[0, Math.PI, 0]}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <planeGeometry args={[2.0, 1.2]} />
        <meshBasicMaterial color="#000" />
        <Html
          transform
          occlude="blending"
          position={[0, 0, 0.01]}
          scale={0.0025}
        >
          <div 
            className={`w-[800px] h-[480px] bg-black overflow-hidden transition-all duration-500 ${isHovered ? 'shadow-[0_0_50px_rgba(255,255,255,0.1)]' : ''}`}
            style={{ pointerEvents: 'auto' }}
          >
            <VideoCarousel />
          </div>
        </Html>
      </mesh>
      </group>
    </group>
  );
}
