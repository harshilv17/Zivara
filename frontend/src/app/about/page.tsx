import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="About Zivara"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-6xl font-serif">Our Story</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-serif mb-8">Born from a little madness</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Zivara was created with a simple belief: that every woman deserves a bag that feels as good as it looks. We design thoughtfully, craft meticulously, and pour our hearts into every stitch.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our bags are made from premium vegan leather, because style shouldn't come at the cost of our planet or its creatures. Each piece is designed in-house and manufactured to meet our exacting standards of beauty and durability.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you're rushing to work, heading out for brunch, or exploring a new city, Zivara is with you — holding your world together, one beautiful bag at a time.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#f9f9f9]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-16">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { title: 'Craftsmanship', desc: 'Every bag is handcrafted with attention to detail.' },
              { title: 'Sustainability', desc: '100% vegan leather, cruelty-free and planet-friendly.' },
              { title: 'Functionality', desc: 'Designed for real life, with you in mind.' },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-xl mb-4">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
