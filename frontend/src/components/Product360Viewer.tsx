'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RotateCcw, Hand, Maximize2 } from 'lucide-react';

interface Product360ViewerProps {
  images: string[];
  productName: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export function Product360Viewer({ 
  images, 
  productName, 
  autoRotate = false,
  rotationSpeed = 100 
}: Product360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [startX, setStartX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length;

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalFrames);
    }, rotationSpeed);

    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, totalFrames, rotationSpeed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const sensitivity = 5; // pixels per frame
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        if (newIndex < 0) return totalFrames - 1;
        if (newIndex >= totalFrames) return 0;
        return newIndex;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentIndex((prev) => {
        const newIndex = prev + direction;
        if (newIndex < 0) return totalFrames - 1;
        if (newIndex >= totalFrames) return 0;
        return newIndex;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`relative select-none ${
          isFullscreen 
            ? 'fixed inset-0 z-50 bg-black/95 flex items-center justify-center' 
            : 'w-full aspect-square'
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Container */}
        <div
          className={`relative ${isFullscreen ? 'w-[80vh] h-[80vh]' : 'w-full h-full'} cursor-grab active:cursor-grabbing`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f8f5] via-white to-[#f0f0eb] rounded-2xl" />
          
          {/* Product Images */}
          {images.map((src, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={false}
              animate={{ 
                opacity: index === currentIndex ? 1 : 0,
                scale: index === currentIndex ? 1 : 0.95
              }}
              transition={{ duration: 0.1 }}
            >
              <Image
                src={src}
                alt={`${productName} - View ${index + 1}`}
                fill
                className="object-contain p-8"
                priority={index === 0}
                draggable={false}
              />
            </motion.div>
          ))}

          {/* Drag indicator */}
          <motion.div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              animate={{ x: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            >
              <Hand className="w-4 h-4 text-[#5a7c65]" />
            </motion.div>
            <span className="text-xs text-gray-600 font-medium">Drag to rotate</span>
          </motion.div>

          {/* 360 badge */}
          <motion.div 
            className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#5a7c65] text-white px-3 py-1.5 rounded-full text-xs font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw className="w-3 h-3" />
            </motion.div>
            <span>360°</span>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-16 left-4 right-4">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#5a7c65] to-[#d4a373]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / totalFrames) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-full transition-colors ${
              isAutoRotating ? 'bg-[#5a7c65] text-white' : 'bg-white/90 text-gray-700'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </motion.button>
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 bg-white/90 text-gray-700 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Close button for fullscreen */}
        {isFullscreen && (
          <motion.button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 p-3 bg-white text-gray-900 rounded-full shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
          >
            ✕
          </motion.button>
        )}
      </motion.div>

      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleFullscreen}
        />
      )}
    </>
  );
}

// Simplified version for when you only have one image - creates a fake 360 effect with CSS
export function Product360Placeholder({ image, productName }: { image: string; productName: string }) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setRotation((prev) => prev + deltaX * 0.5);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      className="relative w-full aspect-square cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f8f5] via-white to-[#f0f0eb] rounded-2xl overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          style={{ 
            transform: `perspective(1000px) rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          <Image
            src={image}
            alt={productName}
            fill
            className="object-contain p-8"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Drag indicator */}
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          animate={{ x: [0, 10, 0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          <Hand className="w-4 h-4 text-[#5a7c65]" />
        </motion.div>
        <span className="text-xs text-gray-600 font-medium">Drag to rotate</span>
      </motion.div>

      {/* 360 badge */}
      <motion.div 
        className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#5a7c65] text-white px-3 py-1.5 rounded-full text-xs font-medium"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <RotateCcw className="w-3 h-3" />
        </motion.div>
        <span>360°</span>
      </motion.div>
    </motion.div>
  );
}
