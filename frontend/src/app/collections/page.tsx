import Link from 'next/link';
import Image from 'next/image';

export default function CollectionsPage() {
  const collections = [
    { name: 'Totes', image: '/images/tote.png', slug: 'totes' },
    { name: 'Slings', image: '/images/sling.png', slug: 'slings' },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Collections</h1>
          <p className="text-gray-500">Explore our signature collections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((col) => (
            <Link key={col.slug} href={`/shop?category=${col.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-[#f5f5f0] rounded-sm">
              <Image
                src={col.image}
                alt={col.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <h2 className="text-white text-3xl font-serif">{col.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
