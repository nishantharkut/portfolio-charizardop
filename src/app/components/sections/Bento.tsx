"use client";

import MagicBento from "../ui/MagicBento";

export default function Bento() {
  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 px-6 sm:px-8 lg:px-12 flex justify-center">
      <div className="max-w-7xl w-full relative">
      <MagicBento
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        enableTilt={false}
        enableMagnetism={false}
        clickEffect={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="255, 179, 71"
      />
      </div>
    </section>
  );
}