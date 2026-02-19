"use client";

import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, ContactShadows, useGLTF, useAnimations, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
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
      const SCALE = 2; // Fits within viewport below navbar
      const START_POSITION = { x: 0, y: 0, z: -60 }; // Centered
      
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
      // Use exact same constants as setup - CENTERED, shifted down 5%
      const TARGET = { x: 0, y: -1.3, z: 0 };
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
      const BASE_Y = -1.3;
      
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
function CharizardFallback({ className = '' }: { className?: string }) {
  return (
    <motion.img
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      src="/videos/Charizard_Flying.gif"
      alt="Charizard Flying"
      className={`w-full h-full object-contain ${className}`}
      style={{ filter: 'brightness(1.1) contrast(1.1) saturate(1.2)' }}
      loading="eager"
      onLoad={() => { if (process.env.NODE_ENV === 'development') console.log('Charizard GIF loaded'); }}
      onError={() => { if (process.env.NODE_ENV === 'development') console.error('Failed to load Charizard GIF'); }}
    />
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
  const [canvasContainerReady, setCanvasContainerReady] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Defer Canvas mount until container is in the DOM to avoid R3F addEventListener(null) and insertBefore reconciliation errors
  useEffect(() => {
    if (!canvasContainerRef.current || hasCanvasError) return;
    const id = requestAnimationFrame(() => setCanvasContainerReady(true));
    return () => cancelAnimationFrame(id);
  }, [hasCanvasError]);



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
      <section className="relative w-full min-h-[100svh] overflow-hidden">
        <div className="relative z-10 min-h-[100svh] flex items-center pt-16 pb-8 sm:pt-20 sm:pb-10">
          <div className="max-w-7xl w-full mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-12 items-center">
              {/* Content - improved mobile hierarchy and spacing */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col justify-center h-full lg:col-span-7 order-2 lg:order-1 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 sm:mb-5" style={{ fontFamily: 'var(--font-sora), system-ui, sans-serif' }}>
                  <span className="block text-gradient-fire">{heroData.name}</span>
                </h1>
                <p className="text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 font-light max-w-lg mx-auto lg:mx-0" style={{ color: 'var(--color-text-secondary)' }}>
                  {heroData.tagline}
                </p>
                {/* Location - bordered like desktop */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8 justify-center lg:justify-start px-4 py-1.5 border border-current rounded-sm w-fit mx-auto lg:mx-0" style={{ color: 'var(--color-text-secondary)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-xs sm:text-sm font-medium">{heroData.location}</span>
                </div>
                <div className="flex flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                  {/* Secondary CTA - clean, no neubrutalism */}
                  <a
                    href={heroData.cta.secondary.href}
                    className="px-4 py-3 text-sm font-medium text-center rounded-xl sm:px-5 sm:py-3 border transition-all duration-200 hover:opacity-90 active:opacity-95"
                    style={{
                      backgroundColor: 'var(--color-surface-elevated)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {heroData.cta.secondary.text}
                  </a>

                  {/* Primary CTA - clean, no neubrutalism */}
                  <a
                    href={heroData.cta.primary.href}
                    className="px-4 py-3 text-sm font-semibold text-center rounded-xl sm:px-5 sm:py-3 border transition-all duration-200 hover:opacity-90 active:opacity-95"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      borderColor: 'var(--color-accent)',
                      color: 'var(--color-button-text)'
                    }}
                  >
                    {heroData.cta.primary.text}
                  </a>
                </div>
              </motion.div>

              {/* RIGHT SIDE - Fallback Visual: row height = GIF height so text sits right below (GIF stays high, not pulled down) */}
              <div className="relative h-auto lg:h-full lg:col-span-5 flex items-center justify-center pointer-events-none order-1 lg:order-2">
                <div className="w-full max-w-[380px] sm:max-w-[440px] lg:h-full flex items-center justify-center">
                  <CharizardFallback className="scale-[1.2] sm:scale-[1.25]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Strip */}
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

          {/* Mobile - Animated Scrolling Text (seamless marquee) */}
          <div className="md:hidden banner-scroll-container py-2.5 min-h-[40px] flex items-center overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap"
              initial={{ x: 0 }}
              animate={{ x: '-50%' }}
              transition={{
                duration: 28,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
                delay: 1
              }}
              style={{ willChange: 'transform', width: 'max-content' }}
            >
              {[...Array(2)].map((_, copyIndex) => (
                <div key={copyIndex} className="flex flex-shrink-0 items-center px-8 py-1">
                  <span className="text-xs font-medium tracking-wide whitespace-nowrap">{heroData.announcement.text}</span>
                  <span className="mx-6 text-xs opacity-60">•</span>
                  <span className="text-xs font-medium tracking-wide whitespace-nowrap">{heroData.announcement.text}</span>
                  <span className="mx-6 text-xs opacity-60">•</span>
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


      {/* Optimized 3D Canvas with Performance Monitoring — mount only after container is in DOM to avoid R3F ref/null errors */}
      <div ref={canvasContainerRef} className="absolute inset-0 pointer-events-none">
        {!hasCanvasError && canvasContainerReady ? (
          <ErrorBoundary
            key="hero-canvas-boundary"
            onError={(error) => {
              if (process.env.NODE_ENV === 'development') {
                console.error('Canvas ErrorBoundary caught error:', error);
              }
              setHasCanvasError(true);
            }}
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/70">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-transparent)' }}>
                    <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--color-accent)' }}></div>
                  </div>
                  <p className="text-sm">3D Rendering Error</p>
                </div>
              </div>
            }
          >
            <Canvas key="hero-canvas"
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
        ) : hasCanvasError ? (
          <div key="hero-canvas-fallback" className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white/50">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-red-500/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-red-500 rounded opacity-50"></div>
              </div>
              <p className="text-xs md:text-sm font-medium opacity-70">3D Error</p>
            </div>
          </div>
        ) : null}
        {/* Ambient glow behind model - centered */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-30 [mask-image:radial-gradient(circle,black,transparent_70%)] bg-[radial-gradient(circle,rgba(255,140,40,0.4),transparent_60%)]" />
      </div>

      {/* Text content - positioned higher so less gap below 3D model (desktop) */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 'clamp(80px, 18vh, 140px)' }}>
        {/* Container */}
        <div className="max-w-7xl w-full mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center max-w-3xl"
            >
              {/* Name - HUGE (desktop: original sizes) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-bold leading-none tracking-tight mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-sora), system-ui, sans-serif' }}>
                {heroData.name}
              </h1>
              
              {/* Tagline */}
              <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-2 font-light max-w-xl px-4" style={{ color: 'var(--color-text-muted)' }}>
                {heroData.tagline}
              </p>
              
              {/* Location - bordered box */}
              <div className="flex items-center gap-1.5 mb-4 px-4 py-1.5 border border-current rounded-sm" style={{ color: 'var(--color-text-muted)' }}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ color: 'var(--color-accent)' }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-xs sm:text-sm font-medium">{heroData.location}</span>
              </div>
              
              {/* CTAs - compact, responsive */}
              <div className="flex flex-row gap-2 sm:gap-3 justify-center">
                <a
                  href={heroData.cta.secondary.href}
                  className="px-3 py-1.5 text-xs font-medium text-center sm:px-4 sm:py-2 md:px-5 md:py-2 border-2 transition-all duration-300 neubrutalism-button"
                  style={{
                    backgroundColor: 'var(--color-surface-elevated)',
                    borderColor: 'var(--color-accent)',
                    color: 'var(--color-text)',
                    boxShadow: '2px 2px 0px 0px var(--shadow-neubrutalism)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0px 0px 0px 0px var(--shadow-neubrutalism-hover)';
                    e.currentTarget.style.transform = 'translate(2px, 2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--shadow-neubrutalism)';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                  }}
                >
                  {heroData.cta.secondary.text}
                </a>

                <a
                  href={heroData.cta.primary.href}
                  className="px-3 py-1.5 text-xs font-semibold text-center sm:px-4 sm:py-2 md:px-5 md:py-2 border-2 transition-all duration-300 neubrutalism-button"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    borderColor: 'var(--color-text)',
                    color: 'var(--color-button-text)',
                    boxShadow: '2px 2px 0px 0px var(--shadow-neubrutalism)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0px 0px 0px 0px var(--shadow-neubrutalism-hover)';
                    e.currentTarget.style.transform = 'translate(2px, 2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '2px 2px 0px 0px var(--shadow-neubrutalism)';
                    e.currentTarget.style.transform = 'translate(0px, 0px)';
                  }}
                >
                  {heroData.cta.primary.text}
                </a>
              </div>
            </motion.div>
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
        <div className="hidden md:flex text-center py-2 px-4 text-sm font-medium tracking-wide items-center justify-center">
          {heroData.announcement.text}
        </div>

        {/* Mobile - Animated Scrolling Text (marquee: duplicate content, animate -50% for seamless loop) */}
        <div className="md:hidden banner-scroll-container py-2 flex items-center overflow-hidden relative">
          <motion.div
            className="flex whitespace-nowrap"
            initial={{ x: 0 }}
            animate={{ x: '-50%' }}
            transition={{
              duration: 28,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
            style={{
              willChange: 'transform',
              width: 'max-content'
            }}
          >
            {[...Array(2)].map((_, copyIndex) => (
              <div key={copyIndex} className="flex flex-shrink-0 items-center">
                <span className="text-xs font-medium tracking-wide whitespace-nowrap px-6">
                  {heroData.announcement.text}
                </span>
                <span className="mx-4 text-xs opacity-60">•</span>
                <span className="text-xs font-medium tracking-wide whitespace-nowrap px-6">
                  {heroData.announcement.text}
                </span>
                <span className="mx-4 text-xs opacity-60">•</span>
              </div>
            ))}
          </motion.div>
        </div>
        
      </motion.div>
    </section>
  );
}
