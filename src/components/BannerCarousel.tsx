import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { Dish } from '../types';
import { DISHES } from '../data';

interface BannerCarouselProps {
  onSelectDish: (dish: Dish) => void;
}

export default function BannerCarousel({ onSelectDish }: BannerCarouselProps) {
  // Grab a few featured dishes (Carne de sol, Cozidão, Peixe Frito, Mocotó)
  const featuredDishes = DISHES.filter(d => d.isFeatured);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDishes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredDishes.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredDishes.length) % featuredDishes.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredDishes.length);
  };

  if (!featuredDishes.length) return null;
  const currentDish = featuredDishes[currentIndex];

  return (
    <div id="hero-carousel-container" className="relative h-[220px] md:h-[340px] w-full overflow-hidden rounded-2xl bg-neutral-900 shadow-lg">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 h-full w-full cursor-pointer"
          onClick={() => onSelectDish(currentDish)}
        >
          {/* Main Dish Image */}
          <img
            src={currentDish.image}
            alt={currentDish.name}
            className="h-full w-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />

          {/* Text Content Overlay */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 md:p-8">
            <div className="max-w-xl space-y-1.5 md:space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B24C2A] px-3 py-0.5 text-[9px] md:text-xs font-black tracking-wider text-[#2D2D2D] uppercase">
                <Compass className="h-3 w-3 md:h-3.5 md:w-3.5 animate-spin-slow" />
                Especialidade da Casa
              </span>
              <h2 className="text-xl md:text-3xl font-serif italic text-white leading-tight">
                {currentDish.name}
              </h2>
              <p className="line-clamp-2 text-xs md:text-sm text-[#F2EDE4]/80 font-sans">
                {currentDish.description}
              </p>
              <div className="flex items-center gap-3 pt-1 md:pt-2">
                <span className="text-lg md:text-2xl font-black text-white font-mono">
                  R$ {currentDish.price.toFixed(2).replace('.', ',')}
                </span>
                <span className="rounded-full bg-[#B24C2A] text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white px-4 py-1 text-[11px] md:text-xs font-black uppercase tracking-wider transition">
                  Pedir Agora
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        id="btn-carousel-prev"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#2D2D2D]/60 text-white backdrop-blur-xs transition hover:bg-[#B24C2A]"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        id="btn-carousel-next"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[#2D2D2D]/60 text-white backdrop-blur-xs transition hover:bg-[#B24C2A]"
        aria-label="Próximo"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicator Bullets */}
      <div id="carousel-indicators" className="absolute bottom-3 right-4 flex gap-1.5">
        {featuredDishes.map((_, i) => (
          <button
            key={i}
            id={`indicator-dot-${i}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
            className={`h-1.5 transition-all rounded-full ${
              i === currentIndex ? 'bg-[#B24C2A] w-5' : 'bg-white/40 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
