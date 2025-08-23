"use client";

import { useTheme } from '../../../contexts/ThemeContext';
import Aurora from './Aurora';
import EnhancedAurora from './EnhancedAurora';

interface ThemedAuroraProps {
  amplitude?: number;
  speed?: number;
  intensity?: 'low' | 'medium' | 'high';
}

export default function ThemedAurora({ 
  amplitude = 1.0, 
  speed = 0.5,
  intensity = 'medium'
}: ThemedAuroraProps) {
  const { theme } = useTheme();
  
  // Determine if we're in light or dark mode
  const isDark = theme === 'dark';
  
  // Define intensity-based configurations
  const intensityConfig = {
    low: {
      dark: { blend: 0.3, amplitude: 0.8 },
      light: { blend: 1.0, amplitude: 1.5 }
    },
    medium: {
      dark: { blend: 0.5, amplitude: 1.0 },
      light: { blend: 1.2, amplitude: 1.8 }
    },
    high: {
      dark: { blend: 0.7, amplitude: 1.2 },
      light: { blend: 1.5, amplitude: 2.2 }
    }
  };
  
  const config = intensityConfig[intensity][isDark ? 'dark' : 'light'];
  
  // Theme-specific color configurations
  const themeColors = {
    dark: {
      // Original Charizard fire colors for dark mode
      colorStops: ["#ff8c42", "#e67429", "#ffa726"]
    },
    light: {
      // Your requested colors with enhanced visibility
      colorStops: ["#fda668", "#ffe9d0", "#ac7a59"]
    }
  };
  
  const colors = themeColors[isDark ? 'dark' : 'light'];
  
  return (
    <EnhancedAurora
      colorStops={colors.colorStops}
      blend={config.blend}
      amplitude={config.amplitude * amplitude}
      speed={speed}
      darkMode={isDark}
    />
  );
}
