'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  speed?: number;
  className?: string;
}

export function ParallaxSection({ 
  children, 
  backgroundImage, 
  backgroundColor = '#f8f8f5',
  speed = 0.5,
  className = ''
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.scrollY;
      const sectionTop = rect.top + scrolled;
      const parallaxOffset = (scrolled - sectionTop) * speed;
      setOffsetY(parallaxOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div 
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 w-full h-[120%]"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            y: offsetY,
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Floating elements that move based on mouse position
interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}

export function FloatingElement({ children, intensity = 20, className = '' }: FloatingElementProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * intensity;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity;
      setPosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <motion.div
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic button that attracts toward cursor
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = '', onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}

// Reveal on scroll with different animation styles
interface RevealOnScrollProps {
  children: React.ReactNode;
  animation?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'flip';
  delay?: number;
  duration?: number;
  className?: string;
}

export function RevealOnScroll({ 
  children, 
  animation = 'fadeUp', 
  delay = 0, 
  duration = 0.6,
  className = '' 
}: RevealOnScrollProps) {
  const animations = {
    fadeUp: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
    fadeDown: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
    fadeLeft: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    fadeRight: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
    flip: { hidden: { opacity: 0, rotateX: 90 }, visible: { opacity: 1, rotateX: 0 } },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={animations[animation]}
      transition={{ duration, delay, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  );
}

// Animated counter
interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  target, 
  duration = 2, 
  prefix = '', 
  suffix = '',
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(target * easeOutQuart));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// Staggered text reveal
interface TextRevealProps {
  text: string;
  className?: string;
  staggerDelay?: number;
}

export function TextReveal({ text, className = '', staggerDelay = 0.03 }: TextRevealProps) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5, 
              delay: i * staggerDelay,
              ease: "easeOut" as const
            }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Cursor follower effect
export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [data-cursor-hover]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#5a7c65] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ 
          x: position.x - 6, 
          y: position.y - 6,
          scale: isHovering ? 0.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      {/* Cursor ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-[#5a7c65] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{ 
          x: position.x - 20, 
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      />
    </>
  );
}

// Tilt card effect
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}

export function TiltCard({ children, className = '', maxTilt = 15, glare = true }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const rotateX = (y - 0.5) * -maxTilt;
    const rotateY = (x - 0.5) * maxTilt;
    
    setTransform({ rotateX, rotateY });
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      animate={{ 
        rotateX: transform.rotateX, 
        rotateY: transform.rotateY 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
      {glare && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
        />
      )}
    </motion.div>
  );
}

// Infinite scroll marquee
interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({ 
  children, 
  speed = 20, 
  direction = 'left', 
  pauseOnHover = true,
  className = '' 
}: MarqueeProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className={`flex gap-8 ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        animate={{ 
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
