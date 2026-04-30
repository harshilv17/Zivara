'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { RevealOnScroll } from './ui/AdvancedEffects';

interface Video {
  id: number;
  src: string;
  poster?: string;
  title: string;
  description: string;
}

const videos: Video[] = [
  {
    id: 1,
    src: '/videos/lifestyle-1.mp4',
    poster: '/images/hero.png',
    title: 'The Art of Everyday Style',
    description: 'Discover how Zivara bags complement your daily adventures.',
  },
  {
    id: 2,
    src: '/videos/lifestyle-2.mp4',
    poster: '/images/tote.png',
    title: 'Crafted with Care',
    description: 'A glimpse into our meticulous craftsmanship process.',
  },
];

export function ProductVideoSection() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <RevealOnScroll animation="fadeUp" className="text-center mb-16">
          <span className="text-[#5a7c65] text-sm tracking-widest font-medium uppercase">
            Watch & Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-gray-900">
            See Zivara in Action
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            Experience our bags through immersive lifestyle videos
          </p>
        </RevealOnScroll>

        {/* Main Video Player */}
        <RevealOnScroll animation="scale">
          <div className="relative aspect-video max-w-5xl mx-auto rounded-2xl overflow-hidden bg-black group">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster={videos[activeVideo].poster}
              muted={isMuted}
              loop
              playsInline
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videos[activeVideo].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Video Info */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={activeVideo}
            >
              <h3 className="text-2xl md:text-3xl font-serif mb-2">
                {videos[activeVideo].title}
              </h3>
              <p className="text-white/80 text-sm md:text-base">
                {videos[activeVideo].description}
              </p>
            </motion.div>

            {/* Play/Pause Button */}
            <motion.button
              onClick={handlePlayPause}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white/30 transition-all group-hover:bg-white/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </motion.button>

            {/* Volume Control */}
            <motion.button
              onClick={handleMuteToggle}
              className="absolute bottom-8 right-8 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </RevealOnScroll>

        {/* Video Thumbnails */}
        <div className="flex justify-center gap-4 mt-8">
          {videos.map((video, idx) => (
            <motion.button
              key={video.id}
              onClick={() => {
                setActiveVideo(idx);
                setIsPlaying(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
              className={`relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeVideo === idx 
                  ? 'border-[#5a7c65] ring-2 ring-[#5a7c65]/20' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={video.poster}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {activeVideo === idx && (
                <motion.div
                  className="absolute inset-0 bg-[#5a7c65]/20"
                  layoutId="activeVideo"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// Compact video card for product pages
export function ProductVideoCard({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="text-sm font-medium">{title}</p>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          animate={{ scale: isPlaying ? 0 : 1, opacity: isPlaying ? 0 : 1 }}
        >
          <Play className="w-5 h-5 ml-0.5" />
        </motion.div>
      </div>
    </motion.div>
  );
}
