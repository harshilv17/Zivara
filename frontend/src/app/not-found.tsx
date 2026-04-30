import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#5a7c65]/5 to-white">
      <div className="text-center px-4">
        <h1 className="text-8xl font-serif font-bold text-[#5a7c65] mb-4">404</h1>
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#5a7c65] text-white rounded-lg font-medium hover:bg-[#4a6652] transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-[#5a7c65] text-[#5a7c65] rounded-lg font-medium hover:bg-[#5a7c65]/5 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
