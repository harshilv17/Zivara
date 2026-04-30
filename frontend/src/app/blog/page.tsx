'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from '@/components/ui/AdvancedEffects';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
}

// Mock blog posts (would come from API in production)
const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'choosing-the-perfect-tote',
    title: 'How to Choose the Perfect Tote for Your Lifestyle',
    excerpt: 'From work commutes to weekend getaways, find the tote that matches your daily adventures.',
    coverImage: '/images/tote.png',
    author: 'Zivara Team',
    publishedAt: '2026-01-10',
    readTime: 5,
    category: 'Style Guide',
  },
  {
    id: 2,
    slug: 'sustainable-fashion-choices',
    title: 'Why Vegan Leather is the Future of Fashion',
    excerpt: 'Discover how sustainable materials are revolutionizing the fashion industry without compromising on style.',
    coverImage: '/images/sling.png',
    author: 'Zivara Team',
    publishedAt: '2026-01-05',
    readTime: 7,
    category: 'Sustainability',
  },
  {
    id: 3,
    slug: 'bag-care-essentials',
    title: 'Essential Tips for Caring for Your Zivara Bag',
    excerpt: 'Keep your favorite bag looking brand new with these simple maintenance tips.',
    coverImage: '/images/hero.png',
    author: 'Zivara Team',
    publishedAt: '2025-12-28',
    readTime: 4,
    category: 'Care Guide',
  },
  {
    id: 4,
    slug: 'spring-2026-trends',
    title: 'Spring 2026 Bag Trends You Need to Know',
    excerpt: 'From bold colors to minimalist designs, here are the trends that will define the season.',
    coverImage: '/images/tote.png',
    author: 'Zivara Team',
    publishedAt: '2025-12-20',
    readTime: 6,
    category: 'Trends',
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-[#f8f8f5]">
        <div className="container mx-auto px-4 text-center">
          <motion.span
            className="text-[#5a7c65] text-sm tracking-widest uppercase font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Zivara Journal
          </motion.span>
          <motion.h1
            className="text-4xl md:text-5xl font-serif mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Stories & Style
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover styling tips, behind-the-scenes stories, and the latest trends
          </motion.p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <RevealOnScroll animation="fadeUp">
            <Link href={`/blog/${featuredPost.slug}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#f8f8f5] rounded-3xl overflow-hidden group">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <span className="text-[#5a7c65] text-sm font-medium uppercase tracking-wider">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif mt-4 mb-4 group-hover:text-[#5a7c65] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-500 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} min read
                    </span>
                  </div>
                  <motion.span
                    className="inline-flex items-center gap-2 mt-6 text-[#5a7c65] font-medium"
                    whileHover={{ x: 5 }}
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* Other Posts */}
      <section className="py-16 bg-[#f8f8f5]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-serif mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post, idx) => (
              <RevealOnScroll key={post.id} animation="fadeUp" delay={idx * 0.1}>
                <Link href={`/blog/${post.slug}`}>
                  <motion.article
                    className="bg-white rounded-2xl overflow-hidden group"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#5a7c65] text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-serif mb-2 group-hover:text-[#5a7c65] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span>{post.readTime} min read</span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h2 className="text-2xl font-serif mb-4">Stay Updated</h2>
          <p className="text-gray-500 mb-6">
            Subscribe to our newsletter for the latest articles and exclusive content.
          </p>
          <form className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5a7c65]/20 focus:border-[#5a7c65]"
            />
            <button className="px-6 py-3 bg-[#5a7c65] text-white rounded-full font-medium hover:bg-[#4a6652] transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
