export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif mb-4">Get in Touch</h1>
          <p className="text-gray-500">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#5a7c65] rounded-sm"
              placeholder="Your Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#5a7c65] rounded-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-[#5a7c65] rounded-sm resize-none"
              placeholder="How can we help?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#5a7c65] text-white py-4 font-medium hover:bg-[#4a6652] transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Or email us directly at <a href="mailto:hello@wearzivara.com" className="text-[#5a7c65] underline">hello@wearzivara.com</a></p>
          <p className="mt-2">Call us: +91 87922 08575</p>
        </div>
      </div>
    </div>
  );
}
