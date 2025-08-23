"use client";

import dynamic from 'next/dynamic';
import { useTheme } from '../../../contexts/ThemeContext';

// Dynamically import Dither to avoid SSR issues
const Dither = dynamic(() => import('./Dither'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-transparent to-gray-100/20" />
});

interface DitherClientProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  darkColor?: [number, number, number];
  lightColor?: [number, number, number];
}

export default function DitherClient({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor,
  darkColor = [0.8, 0.4, 0.2],
  lightColor = [0.6, 0.3, 0.1],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}: DitherClientProps) {
  const { theme } = useTheme();
  
  // Use theme-specific colors if waveColor is not provided
  const finalWaveColor = waveColor || (theme === 'dark' ? darkColor : lightColor);

  return (
    <Dither
      waveSpeed={waveSpeed}
      waveFrequency={waveFrequency}
      waveAmplitude={waveAmplitude}
      waveColor={finalWaveColor}
      colorNum={colorNum}
      pixelSize={pixelSize}
      disableAnimation={disableAnimation}
      enableMouseInteraction={enableMouseInteraction}
      mouseRadius={mouseRadius}
    />
  );
}
