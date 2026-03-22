import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Camera, Circle } from 'lucide-react';

// The Hole Material punches a transparent hole in the canvas
const holeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 1,
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.ZeroFactor,
  blendDst: THREE.ZeroFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.ZeroFactor,
  depthWrite: false,
});

const CinemaCamera = ({ isRecording, screenRef }: { isRecording: boolean, screenRef: React.RefObject<THREE.Mesh | null> }) => {
  const group = useRef<THREE.Group>(null);
  const recLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (isRecording && recLight.current) {
      // Blink the REC light
      recLight.current.intensity = Math.sin(state.clock.elapsedTime * 8) * 0.5 + 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 2.5]} />
        <meshStandardMaterial color="#111" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Lens Mount */}
      <mesh position={[0, 0, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 32]} />
        <meshStandardMaterial color="#333" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Lens */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 32]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Matte Box */}
      <mesh position={[0, 0, 2.4]}>
        <boxGeometry args={[1.4, 1.2, 0.6]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>

      {/* Top Handle */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.2, 0.5, 1.8]} />
        <meshStandardMaterial color="#111" roughness={0.6} />
      </mesh>

      {/* Battery */}
      <mesh position={[0, 0, -1.4]}>
        <boxGeometry args={[1.2, 1.2, 0.4]} />
        <meshStandardMaterial color="#222" roughness={0.8} />
      </mesh>

      {/* Side Monitor (LCD Screen) */}
      <group position={[-0.85, 0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Monitor Bezel */}
        <mesh>
          <boxGeometry args={[1.6, 1.0, 0.1]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} />
        </mesh>
        
        {/* The Screen Hole (Reveals the website) */}
        <mesh ref={screenRef} position={[0, 0, 0.06]} renderOrder={999}>
          <planeGeometry args={[1.5, 0.9]} />
          <meshBasicMaterial color="#000" /> {/* Initially black */}
        </mesh>
      </group>

      {/* REC Light */}
      <mesh position={[-0.8, 0.5, 1.0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={isRecording ? "#ff0000" : "#330000"} />
      </mesh>
      {isRecording && (
        <pointLight ref={recLight} position={[-0.8, 0.5, 1.0]} color="#ff0000" distance={2} />
      )}
    </group>
  );
};

const DustParticles = () => {
  const count = 1000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
};

const Scene = ({ isRecording, screenRef, cameraGroupRef }: { isRecording: boolean, screenRef: React.RefObject<THREE.Mesh | null>, cameraGroupRef: React.RefObject<THREE.Group | null> }) => {
  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={0.2} />
      <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
      <spotLight position={[-5, 5, -5]} angle={0.15} penumbra={1} intensity={1} color="#4444ff" />
      
      {/* Background that hides the website initially */}
      <mesh position={[0, 0, -5]} scale={[100, 100, 1]} renderOrder={-1}>
        <planeGeometry />
        <meshBasicMaterial color="#000000" depthWrite={false} />
      </mesh>

      <DustParticles />

      <group ref={cameraGroupRef}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <CinemaCamera isRecording={isRecording} screenRef={screenRef} />
        </Float>
      </group>
    </>
  );
};

export default function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const cameraGroupRef = useRef<THREE.Group>(null);
  const uiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    if (!cameraGroupRef.current || !uiRef.current || !containerRef.current) return;

    // Initial state
    gsap.set(cameraGroupRef.current.position, { x: 2, y: -1, z: -3 });
    gsap.set(cameraGroupRef.current.rotation, { x: 0.2, y: -0.5, z: 0.1 });
    gsap.set(uiRef.current, { opacity: 0 });

    // 1. Camera emerges and rotates to face the screen to the viewer
    tl.to(cameraGroupRef.current.position, {
      x: -0.5, // Align the side screen to center (screen local is x:-0.85, z:0.5. Rotated 90deg -> x:0.5. Group x:-0.5 makes world x:0)
      y: 0,
      z: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, 0.0);

    tl.to(cameraGroupRef.current.rotation, {
      x: 0,
      y: Math.PI / 2, // Rotate 90 degrees so the left side (screen) faces front
      z: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, 0.0);

    // 2. Turn on REC and punch hole
    tl.add(() => {
      setIsRecording(true);
      setShowUI(true);
      // Play shutter sound
      const audio = new Audio('https://cdn.freesound.org/previews/234/234000_4160000-lq.mp3'); // Example shutter
      audio.volume = 0.3;
      audio.play().catch(e => console.log("Audio play prevented by browser"));
      
      // Change screen material to punch hole
      if (screenRef.current) {
        screenRef.current.material = holeMaterial;
      }
    }, 1.0);

    tl.to(uiRef.current, {
      opacity: 1,
      duration: 0.2
    }, 1.0);

    // 3. Push in to the screen until it fills the viewport
    tl.to(cameraGroupRef.current.position, {
      x: -0.5,
      y: 0,
      z: 4.0, // Move camera very close to the viewer (camera is at z:5, screen is at z:0.85 relative to group. Group at z:4.0 -> screen at z:4.85. Distance = 0.15)
      duration: 1.0,
      ease: "power2.in"
    }, 1.5);

    // Animate UI scale to match the 3D push-in
    tl.to(uiRef.current, {
      scale: 28, // Scale up the UI overlay to match the 3D screen getting closer
      opacity: 0, // Fade out the UI as it gets too close
      duration: 1.0,
      ease: "power2.in"
    }, 1.5);

    // 4. Fade out the entire intro overlay
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut"
    }, 2.3);

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
    >
      <Canvas 
        gl={{ alpha: true, antialias: true }} 
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Scene isRecording={isRecording} screenRef={screenRef} cameraGroupRef={cameraGroupRef} />
      </Canvas>

      {/* Cinematic UI Overlay */}
      <div 
        ref={uiRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {/* We need the UI to scale up with the camera screen. 
            Actually, it's easier to just have the UI fixed on the screen, 
            and it scales up or fades out as the camera pushes in. */}
        <div className="relative w-[60vw] h-[35vw] max-w-[800px] max-h-[450px] border border-white/20 flex flex-col justify-between p-4">
          
          {/* Top Bar */}
          <div className="flex justify-between items-start text-white font-mono text-sm">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
              <span className="font-bold tracking-widest">REC</span>
            </div>
            <div className="flex gap-4">
              <span>ISO 800</span>
              <span>F 2.8</span>
              <span>1/48</span>
            </div>
            <div className="tracking-widest">
              00:00:02:14
            </div>
          </div>

          {/* Center Crosshair */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white/50"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-white/50"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-white/50"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-white/50"></div>
          </div>

          {/* Bottom Bar */}
          <div className="flex justify-between items-end text-white font-mono text-sm">
            <div>SONY FX9</div>
            <div className="flex gap-2">
              <div className="w-16 h-2 bg-white/20 rounded overflow-hidden">
                <div className="w-3/4 h-full bg-green-500"></div>
              </div>
              <div className="w-16 h-2 bg-white/20 rounded overflow-hidden">
                <div className="w-3/4 h-full bg-green-500"></div>
              </div>
            </div>
            <div>5600K</div>
          </div>

          {/* Frame Corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
        </div>
      </div>
    </div>
  );
}
