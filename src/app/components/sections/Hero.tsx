"use client";

import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, ContactShadows, useGLTF, useAnimations, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import TypewriterRoles from '../ui/RotatingRoles';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { getHeroData } from '../../../data';
import * as THREE from 'three';

// Device and Browser Detection Hook
function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    isMobile: false,
    supportsWebGL2: false,
    memoryLimit: 4000, // Default to 4GB for SSR
    maxTextureSize: 1024
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
      maxTextureSize: Math.min(maxTextureSize, isLowEnd ? 512 : 2048)
    });
  }, []);

  return { capabilities, isClient };
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
          pixelRatio: Math.min(window.devicePixelRatio, 2),
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
  const { gl, size } = useThree();
  // No longer need setModelLoaded - page loads independently

  // Detect mobile viewport
  const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Notify when model is loaded and ready (non-blocking)
  useEffect(() => {
    if (scene && !modelReady) {
      setModelReady(true);
      setIsModelLoaded(true); // Set local loading state
      onModelLoaded?.(); // Notify parent component
      // Don't call setModelLoaded - let page load independently
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

  useFrame((state) => {
    if (!group.current || !shouldUpdateFrame()) return;
    
    // Auto-fit on first frame
    if (!fitted) {
      const box = new THREE.Box3().setFromObject(group.current);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      
      // Center the model
      group.current.position.sub(center);
      
      // Scale to reasonable size - restore original desktop sizing
      const targetHeight = isMobileViewport ? 3.5 : 5; // Keep original 4 for desktop
      const currentHeight = size.y;
      const s = targetHeight / currentHeight;
      group.current.scale.setScalar(s);
      

      //-------CHANGE HERE------------
      // Position the model with responsive positioning - restore perfect desktop position
      if (isMobileViewport) {
        // Mobile positioning - keep improved mobile position
        group.current.position.x = 0; // Center horizontally
        group.current.position.y = -0.8; // Higher position for mobile
        group.current.position.z = 0;
      } else {
        // Desktop positioning - restore original perfect position
        group.current.position.x = 3.25; // Original perfect positioning
        group.current.position.y = -3; // Original perfect positioning
        group.current.position.z = 0;
      }
      

      //-------CHANGE HERE------------
      // Start entrance animation from far away with responsive values
      group.current.position.z = -100;
      if (isMobileViewport) {
        group.current.position.x = 0; // Start from center for mobile
        group.current.position.y = 1.5; // Start higher for mobile
      } else {
        group.current.position.x = 5.5; // Restore original entrance position
        group.current.position.y = -3; // Restore original entrance position
      }
      group.current.rotation.y = -0.2;
      
      setFitted(true);
    }


    //-------CHANGE HERE------------
    // Entrance animation with responsive targets
    if (fitted && !hasEntered) {
      // Responsive target position - restore perfect desktop values
      const targetX = isMobileViewport ? 0 : 3.25; // Restore original perfect position
      const targetY = isMobileViewport ? -0.8 : -3; // Restore original perfect position
      const targetZ = 0;
      const targetRotY = 0;
      
      // Smooth movement to target with increased speed
      group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX, 0.06); // Doubled speed
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05); // Doubled speed
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, 0.04); // Doubled speed
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.06); // Doubled speed
      
      // Check if arrived
      const distance = Math.sqrt(
        Math.pow(group.current.position.x - targetX, 2) +
        Math.pow(group.current.position.y - targetY, 2) +
        Math.pow(group.current.position.z - targetZ, 2)
      );
      
      if (distance < 0.3) {
        setHasEntered(true);
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
      
      // Gentle floating with increased speed for more lively animation
      const floatAmplitude = capabilities.isLowEnd ? 0.05 : 0.15; // Slightly increased amplitude
      const floatSpeed = capabilities.isLowEnd ? 1.0 : 1.5; // Increased speed significantly
      const baseY = isMobileViewport ? -0.8 : -3; // Restore original desktop base Y
      group.current.position.y = baseY + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
      
    }
  });

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
    <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-16 -translate-y-24 md:translate-y-0">
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
              console.log('Charizard GIF loaded successfully');
              // Don't call setModelLoaded - let page load independently
            }}
            onError={() => {
              console.error('Failed to load Charizard GIF');
              // Don't call setModelLoaded - let page load independently
            }}
          />
        </motion.div>
        
        {/* Optional ambient glow behind GIF */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{ background: 'var(--color-accent-gradient)' }}
        />
      </div>
    </div>
  );
}

export default function Hero() {
  const heroData = getHeroData();
  const { capabilities, isClient } = useDeviceCapabilities();
  const [performanceSettings, setPerformanceSettings] = useState({
    shadows: false, // Default to false for SSR
    antialias: false,
    pixelRatio: 1,
    enableEffects: false
  });
  const [hasCanvasError, setHasCanvasError] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);

  // Update performance settings once client is ready
  useEffect(() => {
    if (isClient) {
      setPerformanceSettings({
        shadows: !capabilities.isLowEnd,
        antialias: !capabilities.isLowEnd,
        pixelRatio: capabilities.isLowEnd ? 1 : (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1),
        enableEffects: !capabilities.isLowEnd
      });
    }
  }, [isClient, capabilities]);

  // Show GIF fallback for mobile devices (width <= 768px) - only after client is ready
  if (isClient && (capabilities.isMobile || (typeof window !== 'undefined' && window.innerWidth <= 768))) {
    console.log('Showing mobile fallback, window width:', typeof window !== 'undefined' ? window.innerWidth : 'SSR');
    return (
      <section className="relative w-full h-screen overflow-hidden">
        <CharizardFallback />
        <div className="relative z-10 h-full flex items-center">
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
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 text-center lg:text-left">
                  <span className="block">{heroData.badge} <span className="text-gradient-fire">{heroData.name}</span></span>
                </h1>
                <div className="mb-4 sm:mb-6 h-7 sm:h-8 md:h-9 text-base sm:text-lg md:text-xl lg:text-2xl text-center lg:text-left" style={{ color: 'var(--color-text-secondary)' }}>
                  <TypewriterRoles />
                </div>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 font-light max-w-xl mx-auto lg:mx-0 text-center lg:text-left" style={{ color: 'var(--color-text-secondary)' }}>
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
          <div className="hidden md:flex text-center py-3 px-4 text-sm font-medium tracking-wide min-h-[48px] items-center justify-center">
            {heroData.announcement.text}
          </div>
          
          {/* Mobile - Animated Scrolling Text */}
          <div className="md:hidden banner-scroll-container py-2.5 min-h-[40px] flex items-center">
            <div className="flex animate-scroll whitespace-nowrap">
              <div className="flex-shrink-0 px-3 sm:px-4">
                <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
              </div>
              <div className="flex-shrink-0 px-3 sm:px-4">
                <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
              </div>
              <div className="flex-shrink-0 px-3 sm:px-4">
                <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Optimized 3D Canvas with Performance Monitoring */}
      <div className="absolute inset-0 pointer-events-none">
        {!hasCanvasError ? (
          <ErrorBoundary 
            onError={(error) => {
              console.error('Canvas ErrorBoundary caught error:', error);
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
                  console.warn('WebGL context lost, switching to fallback');
                  e.preventDefault();
                  setHasCanvasError(true);
                });
              }}
            >
          <AdaptiveDpr pixelated />
          <PerformanceController onPerformanceChange={setPerformanceSettings} />
          
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          
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
            
            <CharizardModel 
              capabilities={capabilities} 
              performanceSettings={performanceSettings} 
              onError={() => setHasCanvasError(true)}
              onModelLoaded={() => setIsModelLoading(false)}
            />
            
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
          /* Fallback when Canvas has errors - positioned on the right side where 3D model should be */
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 right-8 md:right-16 lg:right-24 -translate-y-1/2 text-center text-white/70">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-orange-500/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded animate-pulse"></div>
              </div>
              <p className="text-xs md:text-sm font-medium">3D Model Loading...</p>
            </div>
          </div>
        )}        {/* Ambient glow behind model - restore original positioning */}
        <div className="absolute top-1/2 right-1/2 translate-x-1/4 -translate-y-1/2 w-96 h-96 opacity-30 [mask-image:radial-gradient(circle,black,transparent_70%)] bg-[radial-gradient(circle,rgba(255,140,40,0.4),transparent_60%)]" />
      </div>

      <div className="relative z-10 h-full flex items-center">
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 text-center lg:text-left" style={{ color: 'var(--color-text)' }}>
                <span className="block">{heroData.badge} <span className="text-gradient-fire">{heroData.name}</span></span>
              </h1>
              <div className="mb-4 sm:mb-6 h-8 sm:h-9 text-lg sm:text-xl md:text-2xl text-center lg:text-left" style={{ color: 'var(--color-text-muted)' }}>
                <TypewriterRoles />
              </div>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8 font-light max-w-lg mx-auto lg:mx-0 text-center lg:text-left" style={{ color: 'var(--color-text-muted)' }}>
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
              
              {/* 3D Model Loading Indicator - Shows until model is loaded */}
              {isModelLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="text-center text-white/70">
                    <motion.div 
                      className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-orange-500/20 rounded-full flex items-center justify-center"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-500 rounded animate-pulse"></div>
                    </motion.div>
                    <p className="text-xs md:text-sm font-medium">Loading 3D Model...</p>
                  </div>
                </motion.div>
              )}
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
        <div className="hidden md:flex text-center py-3 px-4 text-sm font-medium tracking-wide min-h-[48px] items-center justify-center">
          {heroData.announcement.text}
        </div>
        
        {/* Mobile - Animated Scrolling Text */}
        <div className="md:hidden banner-scroll-container py-2.5 min-h-[40px] flex items-center">
          <div className="flex animate-scroll whitespace-nowrap">
            <div className="flex-shrink-0 px-3 sm:px-4">
              <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
            </div>
            <div className="flex-shrink-0 px-3 sm:px-4">
              <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
            </div>
            <div className="flex-shrink-0 px-3 sm:px-4">
              <span className="text-xs font-medium tracking-wide">{heroData.announcement.text}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
