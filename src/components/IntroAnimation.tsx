import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, MeshTransmissionMaterial, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'motion/react';

const Lens = ({ onComplete }: { onComplete: () => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const focusRingRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (!groupRef.current || !focusRingRef.current || !glassRef.current || !cameraRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    // Initial state
    groupRef.current.position.z = -5;
    groupRef.current.rotation.x = Math.PI / 8;
    groupRef.current.rotation.y = -Math.PI / 8;

    // 1. Fade in & subtle rotation
    tl.to(groupRef.current.rotation, {
      y: Math.PI / 8,
      x: 0,
      duration: 2,
      ease: "power2.inOut"
    }, 0);

    // 2. Focus ring rotation
    tl.to(focusRingRef.current.rotation, {
      z: Math.PI / 2,
      duration: 1.5,
      ease: "power1.inOut"
    }, 0.2);

    // 3. Move lens towards viewer (filling screen)
    tl.to(groupRef.current.position, {
      z: 2.5, // Move close to camera
      duration: 1.5,
      ease: "power3.in"
    }, 1.5);

    // Also rotate it to face perfectly forward
    tl.to(groupRef.current.rotation, {
      x: 0,
      y: 0,
      duration: 1.5,
      ease: "power3.in"
    }, 1.5);

  }, [onComplete]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 3]} fov={50} />
      
      <group ref={groupRef}>
        {/* Rotate the entire lens assembly to face the camera (Z axis) */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          {/* Main Lens Body */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[1, 1, 2, 64]} />
            <meshStandardMaterial color="#111111" roughness={0.7} metalness={0.3} />
          </mesh>

          {/* Focus Ring */}
          <mesh ref={focusRingRef} position={[0, 0.2, 0]}>
            <cylinderGeometry args={[1.02, 1.02, 0.6, 64]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
          </mesh>

          {/* Red Ring (Sony G Master style) */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[1.01, 1.01, 0.05, 64]} />
            <meshStandardMaterial color="#ff3333" roughness={0.4} metalness={0.5} />
          </mesh>

          {/* Front Lens Barrel */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.95, 1, 0.4, 64]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.8} />
          </mesh>

          {/* Glass Element */}
          <mesh ref={glassRef} position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.9, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4]} />
            <MeshTransmissionMaterial 
              backside
              samples={4}
              thickness={0.5}
              chromaticAberration={0.05}
              anisotropy={0.1}
              distortion={0.1}
              distortionScale={0.5}
              temporalDistortion={0.0}
              clearcoat={1}
              attenuationDistance={0.5}
              attenuationColor="#ffffff"
              color="#e0f7fa"
            />
          </mesh>

          {/* Inner barrel details */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.85, 0.85, 0.1, 64]} />
            <meshStandardMaterial color="#050505" roughness={0.8} />
          </mesh>
        </group>
      </group>

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <spotLight position={[-5, 5, 5]} intensity={1} angle={0.5} penumbra={1} />
      <Environment preset="studio" />
    </>
  );
};

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [isFinished, setIsFinished] = useState(false);

  const handleComplete = () => {
    setIsFinished(true);
    setTimeout(onComplete, 500); // Allow fade out
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        >
          <Canvas gl={{ antialias: true, alpha: false }}>
            <color attach="background" args={['#000000']} />
            <Lens onComplete={handleComplete} />
          </Canvas>
          
          {/* Blur overlay for focus effect */}
          <motion.div 
            className="absolute inset-0 pointer-events-none backdrop-blur-md bg-black/20"
            initial={{ backdropFilter: "blur(10px)" }}
            animate={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
