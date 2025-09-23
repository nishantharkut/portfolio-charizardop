"use client";

import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, ContactShadows, useGLTF, useAnimations, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import TypewriterRoles from '../ui/RotatingRoles';
import ScrollVelocity from '../ui/ScrollVelocity';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { getHeroData } from '../../../data';
import { useIntersectionModelLoading, useModelPreloading, usePerformanceAwareModelLoading } from '../../../hooks/useIntersectionModelLoading';
import * as THREE from 'three';

// Device and Browser Detection Hook
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    isMobile: false,
    supportsWebGL2: false,
    memoryLimit: 4000, // Default to 4GB for SSR
    maxTextureSize: 1024,
    devicePixelRatio: 1 // Default for SSR
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    setIsClient(true);

    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const supportsWebGL2 = !!canvas.getContext('webgl2');

    // Get device memory (if available)
    const deviceMemory = (navigator as any).deviceMemory || 4;

    // Detect low-end devices
    const isLowEnd = isMobile && deviceMemory <= 2;

    // Get max texture size
    const maxTextureSize = gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 1024;

    setCapabilities({
      isLowEnd,
      isMobile,
      supportsWebGL2,
      memoryLimit: deviceMemory * 1000,
      maxTextureSize: Math.min(maxTextureSize, isLowEnd ? 512 : 2048),
      devicePixelRatio: window.devicePixelRatio || 1
    });
  }, []);

  // Memoize capabilities to prevent unnecessary re-renders
  const memoizedCapabilities = useMemo(() => capabilities, [
    capabilities,
  ]);

  return { capabilities: memoizedCapabilities, isClient };
}

// Performance Monitor Component
function PerformanceController({ onPerformanceChange }: { onPerformanceChange: (settings: any) => void }) {
  return (
    <PerformanceMonitor
      onIncline={(api) => {
        // Performance is good, increase quality
        onPerformanceChange({
          shadows: true,
          antialias: true,
          pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
          enableEffects: true
        });
      }}
      onDecline={(api) => {
        // Performance is struggling, reduce quality
        onPerformanceChange({
          shadows: false,
          antialias: false,
          pixelRatio: 1,
          enableEffects: false
        });
      }}
      onFallback={(api) => {
        // Very poor performance, minimal quality
        onPerformanceChange({
          shadows: false,
          antialias: false,
          pixelRatio: 1,
          enableEffects: false
        });
      }}
    />
  );
}

// Optimized Charizard Model Component with LOD and Performance Features
function CharizardModel({ capabilities, performanceSettings, onError, onModelLoaded }: {
  capabilities: any,
  performanceSettings: any,
  onError?: () => void,
  onModelLoaded?: () => void
}) {
  const group = useRef<THREE.Group>(null!);
  const [modelError, setModelError] = useState(false);

  // Always call useGLTF - let ErrorBoundary handle loading errors
  const gltf = useGLTF('/models/charizard.glb');
  const { scene, animations } = gltf;

  // Always call these hooks regardless of error state
  const { actions, names } = useAnimations(animations || [], group);
  const [fitted, setFitted] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { gl, size, viewport } = useThree();

  // Note: This component only runs on desktop since mobile uses GIF fallback
  // No mobile detection needed here - this is desktop-only code

  // Reset states when scene changes (for navigation/reload scenarios)
  useEffect(() => {
    if (scene) {
      setFitted(false);
      setHasEntered(false);
      setIdleTime(0);
      frameSkip.current = 0;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Scene loaded - preparing for deterministic setup');
      }
    }
  }, [scene]);

  // Notify when model is loaded and ready (non-blocking)
  useEffect(() => {
    if (scene && !modelReady) {
      // Double-check that the scene actually has renderable geometry
      let hasGeometry = false;
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry) {
          hasGeometry = true;
        }
      });
      
      if (hasGeometry) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Model loaded with geometry');
        }
        setModelReady(true);
        setIsModelLoaded(true);
        onModelLoaded?.();
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Scene loaded but no geometry found');
        }
      }
    }
  }, [scene, modelReady, onModelLoaded]);

  // No fallback timeout needed - page should load regardless of 3D model

  // Optimize model based on device capabilities
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Optimize materials for low-end devices
          if (capabilities.isLowEnd) {
            if (child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              if (material.map) {
                // Reduce texture resolution on low-end devices
                material.map.minFilter = THREE.LinearFilter;
                material.map.magFilter = THREE.LinearFilter;
                material.map.generateMipmaps = false;
              }
              // Disable expensive material features
              material.roughness = 0.7;
              material.metalness = 0.1;
            }
          }

          // Enable shadows only if performance allows
          if (performanceSettings.shadows) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        }
      });
    }
  }, [scene, capabilities, performanceSettings]);

  // Optimized animation selection
  const selectedAnimation = useMemo(() => {
    if (capabilities.isLowEnd) {
      // Use simpler animation or no animation for low-end devices
      return names.find(n => /idle/i.test(n)) || null;
    }
    return names.find(n => /(fly|idle)/i.test(n)) || names[0];
  }, [names, capabilities]);

  useEffect(() => {
    if (selectedAnimation && actions[selectedAnimation]) {
      const action = actions[selectedAnimation];
      action.reset().fadeIn(0.5).play();
      // Increase animation speed significantly
      action.timeScale = 2.0; // 2x speed for much faster animation
    }
    return () => {
      if (selectedAnimation && actions[selectedAnimation]) {
        actions[selectedAnimation].fadeOut(0.3);
      }
    };
  }, [actions, selectedAnimation]);

  // Throttled frame updates for low-end devices
  const frameSkip = useRef(0);
  const shouldUpdateFrame = useCallback(() => {
    // Always update frames for maximum animation speed
    return true;
  }, []);

  // Immediate setup when model is ready - no frame delays
  useEffect(() => {
    if (scene && modelReady && group.current && !fitted) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Immediate Charizard setup for desktop...');
      }
      
      // ABSOLUTELY FIXED VALUES - NO CALCULATIONS
      const SCALE = 2.8; // Increased for better zoom level
      const START_POSITION = { x: 4.75, y: -1.5, z: -60 };
      
      // Apply immediately - no delays, no conditions
      group.current.scale.setScalar(SCALE);
      group.current.position.set(START_POSITION.x, START_POSITION.y, START_POSITION.z);
      group.current.rotation.set(0, -0.2, 0);
      
      setFitted(true);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Immediate setup complete - Scale: ${SCALE}, Start: [${START_POSITION.x}, ${START_POSITION.y}, ${START_POSITION.z}]`);
      }
    }
  }, [scene, modelReady, fitted]);

  useFrame((state) => {
    if (!group.current || !shouldUpdateFrame() || !scene || !modelReady) return;


    // Entrance animation with fixed constants
    if (fitted && !hasEntered) {
      // Use exact same constants as setup
      const TARGET = { x: 3.25, y: -2.5, z: 0 };
      const TARGET_ROT = 0;
      
      // Fast, consistent lerp
      const lerp = 0.06;
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, TARGET.x, lerp);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, TARGET.y, lerp);
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, TARGET.z, lerp);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, TARGET_ROT, lerp);

      // Simple distance check
      const dist = group.current.position.distanceTo(new THREE.Vector3(TARGET.x, TARGET.y, TARGET.z));
      if (dist < 0.1) {
        // Snap to exact position
        group.current.position.set(TARGET.x, TARGET.y, TARGET.z);
        group.current.rotation.y = TARGET_ROT;
        setHasEntered(true);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Entrance complete - Fixed at: [${TARGET.x}, ${TARGET.y}, ${TARGET.z}]`);
        }
      }
    }

    // Idle animations after entrance (optimized for performance)
    if (hasEntered) {
      // Reduce mouse interaction sensitivity on low-end devices
      const mouseThreshold = capabilities.isLowEnd ? 0.05 : 0.02;
      const mouseInfluence = Math.abs(state.pointer.x) + Math.abs(state.pointer.y);

      if (mouseInfluence > mouseThreshold) {
        setIdleTime(0);
        const rotationSpeed = capabilities.isLowEnd ? 0.06 : 0.10; // Increased rotation speed
        group.current.rotation.y = THREE.MathUtils.lerp(
          group.current.rotation.y,
          0.3 + (state.pointer.x * 0.3), // Increased rotation range
          rotationSpeed
        );
      } else {
        setIdleTime(prev => prev + state.clock.getDelta());
        if (idleTime > 2) { // Reduced idle time before auto-rotation
          // Gentle oscillation instead of continuous rotation
          const oscillationSpeed = capabilities.isLowEnd ? 0.5 : 0.8;
          const oscillationAmount = 0.3; // How far it oscillates from center
          const targetRotation = Math.sin(state.clock.elapsedTime * oscillationSpeed) * oscillationAmount;
          group.current.rotation.y = THREE.MathUtils.lerp(
            group.current.rotation.y,
            targetRotation,
            0.02
          );
        }
      }

      // Gentle floating with exact base position
      const floatAmplitude = capabilities.isLowEnd ? 0.04 : 0.08; // Reduced amplitude
      const floatSpeed = 1.2; // Fixed speed
      
      // Use exact same Y as target position
      const BASE_Y = -2.5;
      
      group.current.position.y = BASE_Y + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
    }
  });

  // Remove the safety check interval to prevent re-fitting and zoom inconsistency
  // The model should maintain its scale once properly fitted

  // Don't render anything if there's no scene
  if (!scene) {
    return null;
  }

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

// Fallback Component for Mobile Devices - Shows Charizard GIF instead of 3D model
function CharizardFallback() {
  // No longer need setModelLoaded - page loads independently
  return (
    <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-16 -translate-y-40 md:translate-y-0">
      <div className="w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]">
        {/* Charizard Flying GIF for mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <img
            src="/videos/Charizard_Flying.gif"
            alt="Charizard Flying"
            className="w-full h-full object-contain transform scale-160"
            style={{
              filter: 'brightness(1.1) contrast(1.1) saturate(1.2)'
            }}
            loading="eager"
            onLoad={() => {
              if (process.env.NODE_ENV === 'development') {
                console.log('Charizard GIF loaded successfully');
              }
              // Don't call setModelLoaded - let page load independently
            }}
            onError={() => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Failed to load Charizard GIF');
              }
              // Don't call setModelLoaded - let page load independently
            }}
          />
        </motion.div>


      </div>
    </div>
  );
}

export default function Hero() {
  const heroData = getHeroData();
  const { capabilities, isClient } = useDeviceCapabilities();
  const loadingStrategy = usePerformanceAwareModelLoading();
  const { shouldLoadModel, isModelVisible, heroRef, isIntersecting } = useIntersectionModelLoading({
    threshold: 0.1,
    rootMargin: '50px 0px',
    delay: loadingStrategy === 'immediate' ? 500 : 1000,
    enabled: loadingStrategy !== 'disabled'
  });
  
  // Preload model assets
  useModelPreloading();
  
  const [performanceSettings, setPerformanceSettings] = useState({
    shadows: false, // Default to false for SSR
    antialias: false,
    pixelRatio: 1,
    enableEffects: false
  });
  const [hasCanvasError, setHasCanvasError] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);



  // Update performance settings once client is ready
  useEffect(() => {
    if (isClient) {
      setPerformanceSettings({
        shadows: !capabilities.isLowEnd,
        antialias: !capabilities.isLowEnd,
        pixelRatio: capabilities.isLowEnd ? 1 : Math.min(capabilities.devicePixelRatio || 1, 2),
        enableEffects: !capabilities.isLowEnd
      });
    }
  }, [isClient, capabilities.isLowEnd]);

  // Show GIF fallback for mobile devices - only after client is ready and capabilities are determined
  if (isClient && capabilities.isMobile) {
    return (
      <section className="relative w-full h-screen overflow-hidden">
        {/* Subtle Text Background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <ScrollVelocity
            texts={["EXPERIENCE", "COFFEE", "CREATIVITY", "DEVELOPMENT"]}
            velocity={30}
            className="font-bold text-4xl md:text-6xl"
            scrollerStyle={{ color: 'var(--color-text)', opacity: 0.2 }}
            parallaxClassName="py-16"
            scrollerClassName="tracking-wider"
            numCopies={4}
          />
        </div>

        <CharizardFallback />
        <div className="relative z-10 h-full flex items-center pb-16 sm:pb-14">
          {/* Container with exact same width as navbar: max-w-7xl */}
          <div className="max-w-7xl w-full mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT SIDE - Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="flex flex-col justify-center h-full lg:col-span-7 order-2 lg:order-1 max-w-2xl mx-auto lg:mx-0"
              >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 text-center lg:text-left">
                  <span className="block">{heroData.badge}</span>
                  <span className="block text-gradient-fire">{heroData.name}</span>
                </h1>
                <div className="mb-4 sm:mb-6 h-7 sm:h-8 md:h-9 text-base sm:text-lg md:text-xl lg:text-2xl text-center lg:text-left" style={{ color: 'var(--color-text-secondary)' }}>
                  <TypewriterRoles />
                </div>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-6 font-light max-w-xl mx-auto lg:mx-0 text-justify" style={{ color: 'var(--color-text-secondary)' }}>
                  {heroData.description}
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                  {/* Secondary CTA - Neubrutalism with website colors */}
                  <a
                    href={heroData.cta.secondary.href}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-center border-4 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderColor: 'var(--color-accent)',
                      color: 'var(--color-text)',
                      boxShadow: '6px 6px 0px 0px var(--shadow-neubrutalism)'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism-hover)';
                      e.currentTarget.style.transform = 'translate(3px, 3px)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--shadow-neubrutalism)';
                      e.currentTarget.style.transform = 'translate(0px, 0px)';
                    }}
                  >
                    {heroData.cta.secondary.text}
                  </a>

                  {/* Primary CTA - Neubrutalism with website colors */}
                  <a
                    href={heroData.cta.primary.href}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold text-center border-4 transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      borderColor: 'var(--color-text)',
                      color: 'var(--color-button-text)',
                      boxShadow: '6px 6px 0px 0px var(--shadow-neubrutalism)'
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism-hover)';
                      e.currentTarget.style.transform = 'translate(3px, 3px)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--shadow-neubrutalism)';
                      e.currentTarget.style.transform = 'translate(0px, 0px)';
                    }}
                  >
                    {heroData.cta.primary.text}
                  </a>
                </div>
              </motion.div>

              {/* RIGHT SIDE - Fallback Visual */}
              <div className="relative h-64 sm:h-80 lg:h-full lg:col-span-5 flex items-center justify-center pointer-events-none order-1 lg:order-2">
                {/* Fallback renders here */}
              </div>
            </div>
          </div>
        </div>

        {/* Internship Announcement Strip - Static for Desktop, Animated for Mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="banner-container"
        >
          {/* Desktop & Tablet - Static Text */}
          <div className="hidden md:flex text-center py-2 px-4 text-sm font-medium tracking-wide min-h-[36px] items-center justify-center">
            {heroData.announcement.text}
          </div>

          {/* Mobile - Animated Scrolling Text (Left to Right) */}
          <div className="md:hidden banner-scroll-container py-2.5 min-h-[40px] flex items-center overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap"
              initial={{ transform: 'translateX(100%)' }}
              animate={{ transform: 'translateX(-100%)' }}
              transition={{
                duration: 35,
                ease: "linear",
                repeat: Infinity,
                delay: 1.5 // Start after page loads
              }}
              style={{
                minWidth: 'max-content',
              }}
            >
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 px-8 py-1">
                  <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                    {heroData.announcement.text}
                  </span>
                  {i < 4 && <span className="mx-6 text-xs opacity-60">•</span>}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
      {/* Subtle Text Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.15 }}>
        <ScrollVelocity
          texts={["EXPERIENCE", "INNOVATION", "LEADERSHIP", "DEVELOPMENT"]}
          velocity={30}
          className="font-bold text-4xl md:text-6xl"
          scrollerStyle={{ color: 'var(--color-text)', opacity: 0.2 }}
          parallaxClassName="py-16"
          scrollerClassName="tracking-wider"
          numCopies={4}
        />
      </div>

      {/* Optimized 3D Canvas with Performance Monitoring */}
      <div className="absolute inset-0 pointer-events-none">
        {!hasCanvasError ? (
          <ErrorBoundary
            onError={(error) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Canvas ErrorBoundary caught error:', error);
              }
              setHasCanvasError(true);
            }}
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/70">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-orange-500 rounded"></div>
                  </div>
                  <p className="text-sm">3D Rendering Error</p>
                </div>
              </div>
            }
          >
            <Canvas
              shadows={performanceSettings.shadows}
              gl={{
                antialias: performanceSettings.antialias,
                alpha: true,
                powerPreference: "high-performance",
                failIfMajorPerformanceCaveat: false
              }}
              dpr={[1, performanceSettings.pixelRatio]}
              className="!bg-transparent w-full h-full"
              style={{ pointerEvents: 'none', touchAction: 'none' }}
              onWheel={(e) => e.preventDefault()}
              onScroll={(e) => e.preventDefault()}
              frameloop="always" // Always animate for maximum speed
              onCreated={({ gl }) => {
                // Handle WebGL context loss
                const canvas = gl.domElement;
                canvas.addEventListener('webglcontextlost', (e) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn('WebGL context lost, switching to fallback');
                  }
                  e.preventDefault();
                  setHasCanvasError(true);
                });
              }}
            >
              <AdaptiveDpr pixelated />
              <PerformanceController onPerformanceChange={setPerformanceSettings} />

              <PerspectiveCamera 
                makeDefault 
                position={[0, 0, 12]} 
                fov={45} 
                near={0.1} 
                far={1000}
              />

              {/* Adaptive Lighting */}
              <ambientLight intensity={capabilities.isLowEnd ? 0.8 : 0.6} />
              {!capabilities.isLowEnd && (
                <>
                  <directionalLight
                    position={[10, 10, 5]}
                    castShadow={performanceSettings.shadows}
                    intensity={1}
                    shadow-mapSize-width={capabilities.isLowEnd ? 512 : 1024}
                    shadow-mapSize-height={capabilities.isLowEnd ? 512 : 1024}
                  />
                  <spotLight
                    position={[5, 5, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.3}
                    color="#ff6b35"
                  />
                </>
              )}

               {shouldLoadModel && isModelVisible && (
                 <CharizardModel
                   capabilities={capabilities}
                   performanceSettings={performanceSettings}
                   onError={() => setHasCanvasError(true)}
                   onModelLoaded={() => {
                     setModelLoaded(true);
                   }}
                 />
               )}

              {!capabilities.isLowEnd && (
                <ContactShadows
                  position={[3, -3, 0]}
                  opacity={0.1}
                  blur={2}
                  scale={6}
                  far={10}
                />
              )}

              <Environment preset={capabilities.isLowEnd ? "apartment" : "sunset"} />

              {performanceSettings.enableEffects && (
                <EffectComposer>
                  <Bloom
                    intensity={capabilities.isLowEnd ? 0.1 : 0.2}
                    mipmapBlur
                    luminanceThreshold={0.9}
                    radius={0.3}
                  />
                </EffectComposer>
              )}

              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                enableDamping={false}
              />
            </Canvas>
          </ErrorBoundary>
        ) : (
          /* Canvas error fallback - no loader needed here */
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 right-8 md:right-16 lg:right-24 -translate-y-1/2 text-center text-white/50">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded opacity-50"></div>
              </div>
              <p className="text-xs md:text-sm font-medium opacity-70">3D Error</p>
            </div>
          </div>
        )}        {/* Ambient glow behind model - restore original positioning */}
        <div className="absolute top-1/2 right-1/2 translate-x-1/4 -translate-y-1/2 w-96 h-96 opacity-30 [mask-image:radial-gradient(circle,black,transparent_70%)] bg-[radial-gradient(circle,rgba(255,140,40,0.4),transparent_60%)]" />
      </div>

      <div className="relative z-10 h-full flex items-center pb-12 sm:pb-10">
        {/* Container with exact same width as navbar: max-w-7xl */}
        <div className="max-w-7xl w-full mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT SIDE - Content - restore original */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex flex-col justify-center h-full max-w-xl order-2 lg:order-1"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 text-center lg:text-left" style={{ color: 'var(--color-text)' }}>
                <span className="block">{heroData.badge}</span>
                <span className="block text-gradient-fire">{heroData.name}</span>
              </h1>
              <div className="mb-4 sm:mb-6 h-8 sm:h-9 text-lg sm:text-xl md:text-2xl text-center lg:text-left" style={{ color: 'var(--color-text-muted)' }}>
                <TypewriterRoles />
              </div>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 font-light max-w-lg mx-auto lg:mx-0 text-justify" style={{ color: 'var(--color-text-muted)' }}>
                {heroData.description}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                {/* Secondary CTA - Using website's surface color for neubrutalism */}
                <a
                  href={heroData.cta.secondary.href}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-medium text-center border-4 transition-all duration-300 neubrutalism-button"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)',
                    boxShadow: '6px 6px 0px 0px var(--shadow-neubrutalism)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism-hover)';
                    e.currentTarget.style.transform = 'translate(3px, 3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--shadow-neubrutalism)';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                  }}
                >
                  {heroData.cta.secondary.text}
                </a>

                {/* Primary CTA - Using website's accent color for neubrutalism */}
                <a
                  href={heroData.cta.primary.href}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm font-semibold text-center border-4 transition-all duration-300 neubrutalism-button"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    borderColor: 'var(--color-text)',
                    color: 'var(--color-button-text)',
                    boxShadow: '6px 6px 0px 0px var(--shadow-neubrutalism)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '3px 3px 0px 0px var(--shadow-neubrutalism-hover)';
                    e.currentTarget.style.transform = 'translate(3px, 3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '6px 6px 0px 0px var(--shadow-neubrutalism)';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                  }}
                >
                  {heroData.cta.primary.text}
                </a>
              </div>

            </motion.div>

            {/* RIGHT SIDE - Space for 3D Model (Canvas renders seamlessly behind) */}
            <div className="relative h-64 sm:h-80 lg:h-full flex items-center justify-center pointer-events-none order-1 lg:order-2">
              {/* Canvas renders absolutely positioned behind this space */}

               {/* Pixel Charizard 3D Model Loading Indicator - Desktop Only */}
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ 
                   opacity: isClient && loadingStrategy !== 'disabled' && shouldLoadModel && !modelLoaded ? 1 : 0,
                   scale: isClient && loadingStrategy !== 'disabled' && shouldLoadModel && !modelLoaded ? 1 : 0.8
                 }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
                 className="absolute inset-0 flex items-center justify-center z-20"
                 style={{ 
                   pointerEvents: isClient && loadingStrategy !== 'disabled' && shouldLoadModel && !modelLoaded ? 'auto' : 'none'
                 }}
               >
                  <div className="flex flex-col items-center">
                    {/* Pixel Charizard SVG Animation - Desktop Only */}
                    <div className="mb-4">
                      <svg
                        viewBox="0 0 24 24"
                        width={64}
                        height={64}
                        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="loading charizard"
                      >
                        <style>{`
                          .frame { opacity: 0; animation: cycle 0.8s steps(1) infinite; }
                          .f0 { animation-delay: 0s; }
                          .f1 { animation-delay: -0.2s; }
                          .f2 { animation-delay: -0.4s; }
                          .f3 { animation-delay: -0.6s; }
                          @keyframes cycle {
                            0% { opacity: 1; }
                            24.99% { opacity: 1; }
                            25% { opacity: 0; }
                            100% { opacity: 0; }
                          }
                          .tail { transform-origin: 100% 100%; animation: tail 0.4s ease-in-out infinite; }
                          @keyframes tail {
                            0% { transform: rotate(0deg); }
                            50% { transform: rotate(-10deg) translateX(1px); }
                            100% { transform: rotate(0deg); }
                          }
                          .glow { animation: glow 2s ease-in-out infinite alternate; }
                          @keyframes glow {
                            0% { filter: drop-shadow(0 0 4px rgba(255, 154, 60, 0.6)); }
                            100% { filter: drop-shadow(0 0 12px rgba(255, 154, 60, 0.9)); }
                          }
                        `}</style>

                        <g className="glow">
                          {/* Frame 0 */}
                          <g className="frame f0" transform="scale(6)">
                            <rect x="0" y="1" width="3" height="3" fill="#ff9a3c" stroke="#000" strokeWidth="0.06" />
                            <rect x="1" y="2" width="1" height="2" fill="#f9e36b" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.2" y="1.25" width="0.4" height="0.4" fill="#fff" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.32" y="1.45" width="0.16" height="0.16" fill="#000" />
                            <rect x="0.2" y="3.6" width="0.8" height="0.46" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.05" y="3.6" width="0.8" height="0.46" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <g className="tail">
                              <rect x="3.0" y="1.9" width="1" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                              <rect x="4.05" y="1.6" width="0.4" height="0.4" fill="#d32b00" stroke="#000" strokeWidth="0.02" />
                              <rect x="4.18" y="1.35" width="0.25" height="0.25" fill="#ffcf6e" stroke="#000" strokeWidth="0.01" />
                            </g>
                          </g>

                          {/* Frame 1 */}
                          <g className="frame f1" transform="scale(6)">
                            <rect x="0" y="1" width="3" height="3" fill="#ff9a3c" stroke="#000" strokeWidth="0.06" />
                            <rect x="1" y="2" width="1" height="2" fill="#f9e36b" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.15" y="1.2" width="0.42" height="0.42" fill="#fff" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.28" y="1.38" width="0.16" height="0.16" fill="#000" />
                            <rect x="0.05" y="3.5" width="0.8" height="0.46" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.15" y="3.15" width="0.8" height="0.55" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <g className="tail">
                              <rect x="3.0" y="1.85" width="1" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                              <rect x="4.06" y="1.55" width="0.36" height="0.36" fill="#c12a00" stroke="#000" strokeWidth="0.02" />
                              <rect x="4.22" y="1.28" width="0.22" height="0.22" fill="#ffd27f" stroke="#000" strokeWidth="0.01" />
                            </g>
                          </g>

                          {/* Frame 2 */}
                          <g className="frame f2" transform="scale(6)">
                            <rect x="0" y="1" width="3" height="3" fill="#ff9a3c" stroke="#000" strokeWidth="0.06" />
                            <rect x="1" y="2" width="1" height="2" fill="#f9e36b" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.3" y="1.22" width="0.38" height="0.38" fill="#fff" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.4" y="1.4" width="0.16" height="0.16" fill="#000" />
                            <rect x="0.3" y="3.25" width="0.8" height="0.52" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <rect x="1.95" y="3.6" width="0.8" height="0.44" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <g className="tail">
                              <rect x="3.0" y="1.82" width="1" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                              <rect x="4.02" y="1.55" width="0.4" height="0.36" fill="#d73300" stroke="#000" strokeWidth="0.02" />
                              <rect x="4.18" y="1.28" width="0.2" height="0.2" fill="#ffd88a" stroke="#000" strokeWidth="0.01" />
                            </g>
                          </g>

                          {/* Frame 3 */}
                          <g className="frame f3" transform="scale(6)">
                            <rect x="0" y="1" width="3" height="3" fill="#ff9a3c" stroke="#000" strokeWidth="0.06" />
                            <rect x="1" y="2" width="1" height="2" fill="#f9e36b" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.2" y="1.12" width="0.44" height="0.44" fill="#fff" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.34" y="1.32" width="0.16" height="0.16" fill="#000" />
                            <rect x="0.05" y="3.1" width="0.8" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <rect x="2.2" y="3.4" width="0.8" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                            <g className="tail">
                              <rect x="3.0" y="1.78" width="1" height="0.5" fill="#ff9a3c" stroke="#000" strokeWidth="0.03" />
                              <rect x="4.07" y="1.58" width="0.4" height="0.36" fill="#d73300" stroke="#000" strokeWidth="0.02" />
                              <rect x="4.18" y="1.28" width="0.24" height="0.24" fill="#ffd88a" stroke="#000" strokeWidth="0.01" />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>

                    {/* Innovative Loading Text - Properly aligned with SVG */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-2"
                    >
                      <motion.p 
                        className="text-sm font-bold tracking-wider text-center"
                        style={{ 
                          color: 'var(--color-accent)',
                          fontFamily: 'monospace',
                          textShadow: '0 0 8px rgba(255, 154, 60, 0.5)'
                        }}
                        animate={{
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        MATERIALIZING CHARIZARD
                      </motion.p>
                      
                      <motion.div 
                        className="flex justify-center space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.4, 1, 0.4]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>

                      <motion.p 
                        className="text-xs opacity-70 tracking-wide text-center"
                        style={{ 
                          color: 'var(--color-text-muted)',
                          fontFamily: 'monospace'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ duration: 1, delay: 0.6 }}
                      >
                        Rendering 3D Experience...
                      </motion.p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
          </div>
        </div>
      </div>

      {/* Internship Announcement Strip - Static for Desktop, Animated for Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="banner-container"
      >
        {/* Desktop & Tablet - Static Text */}
        <div className="hidden md:flex text-center py-2 px-4 text-sm font-medium tracking-wide min-h-[36px] items-center justify-center">
          {heroData.announcement.text}
        </div>

        {/* Mobile - Animated Scrolling Text (Left to Right) */}
        <div className="md:hidden banner-scroll-container py-2.5 min-h-[40px] flex items-center overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            initial={{ transform: 'translateX(100%)' }}
            animate={{ transform: 'translateX(-100%)' }}
            transition={{
              duration: 35,
              ease: "linear",
              repeat: Infinity,
              delay: 1.5 // Start after page loads
            }}
            style={{
              minWidth: 'max-content',
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 px-8 py-1">
                <span className="text-xs font-medium tracking-wide whitespace-nowrap">
                  {heroData.announcement.text}
                </span>
                {i < 4 && <span className="mx-6 text-xs opacity-60">•</span>}
              </div>
            ))}
          </motion.div>
        </div>
        
      </motion.div>
    </section>
  );
}
