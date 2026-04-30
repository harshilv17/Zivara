'use client';

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  direction?: 'up' | 'down';
}

// Parallax scrolling section component
export function ParallaxSection({ 
  children, 
  offset = 50, 
  className = '',
  direction = 'up' 
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'up' ? [offset, -offset] : [-offset, offset]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax image with zoom effect
export function ParallaxImage({
  src,
  alt,
  className = ''
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

// Fade in on scroll
export function FadeInOnScroll({ 
  children, 
  className = '',
  delay = 0
}: { 
  children: ReactNode; 
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3']
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <motion.div 
      ref={ref} 
      style={{ opacity, y }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale in on scroll
export function ScaleInOnScroll({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ scale, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

// Horizontal scroll container
export function HorizontalScrollSection({ 
  children,
  className = ''
}: { 
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="flex gap-6">
        {children}
      </motion.div>
    </div>
  );
}

// Text reveal on scroll
export function TextRevealScroll({ 
  text, 
  className = '' 
}: { 
  text: string; 
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.3']
  });

  const words = text.split(' ');

  return (
    <div ref={ref} className={`flex flex-wrap gap-x-2 ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + (1 / words.length);
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </div>
  );
}

function Word({ 
  children, 
  progress, 
  range 
}: { 
  children: string; 
  progress: MotionValue<number>; 
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [20, 0]);

  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

// Sticky scroll section
export function StickyScrollSection({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sticky top-24 ${className}`}>
      {children}
    </div>
  );
}
