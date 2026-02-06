'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cuisines = [
    { id: 'creole', name: 'Creole', icon: '🍲', count: 124, color: 'from-burgundy to-burgundy-deep' },
    { id: 'cajun', name: 'Cajun', icon: '🦐', count: 89, color: 'from-forest to-forest-dark' },
    { id: 'soul', name: 'Soul Food', icon: '🍗', count: 67, color: 'from-brown to-brown-dark' },
    { id: 'seafood', name: 'Gulf Seafood', icon: '🦪', count: 156, color: 'from-blue to-blue-dark' },
    { id: 'poboys', name: 'Po-Boys', icon: '🥖', count: 203, color: 'from-tan to-tan-dark' },
    { id: 'fine', name: 'Fine Dining', icon: '✨', count: 45, color: 'from-black to-gray' },
  ];

  const featuredRestaurants = [
    { name: "Commander's Palace", cuisine: 'Haute Creole', neighborhood: 'Garden District', rating: 4.9 },
    { name: "Dooky Chase's", cuisine: 'Soul Food & Creole', neighborhood: 'Tremé', rating: 4.8 },
    { name: 'Cochon', cuisine: 'Contemporary Cajun', neighborhood: 'Warehouse District', rating: 4.7 },
    { name: "Galatoire's", cuisine: 'Classic Creole French', neighborhood: 'French Quarter', rating: 4.8 },
    { name: "Willie Mae's Scotch House", cuisine: 'Fried Chicken', neighborhood: 'Tremé', rating: 4.9 },
  ];

  return (
    <main className="min-h-screen bg-cream" suppressHydrationWarning>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        !mounted ? 'bg-gradient-to-b from-black/95 to-transparent' : scrolled ? 'bg-black/98 backdrop-blur-lg' : 'bg-gradient-to-b from-black/95 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center font-playfair font-bold text-burgundy-deep text-xl">
              N
            </div>
            <div className="font-bebas text-2xl tracking-widest text-cream">
              NEW ORLEANS<span className="text-gold">CHEF</span>
            </div>
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            <Link href="/restaurants/commanders-palace" className="text-cream hover:text-gold transition-colors">Restaurants</Link>
            <Link href="/events/evt-1" className="text-cream hover:text-gold transition-colors">Events</Link>

            {/* Features Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-cream hover:text-gold transition-colors flex items-center gap-1"
              >
                Features
                <svg
                  className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 border border-gold/30 rounded-lg shadow-xl overflow-hidden z-50">
                  <Link
                    href="/survey"
                    className="flex items-center gap-3 px-4 py-3 text-cream hover:bg-gold/10 hover:text-gold transition-colors border-b border-gold/10"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="text-xl">🍽️</span>
                    <div>
                      <div className="font-medium">Taste Survey</div>
                      <div className="text-xs text-cream/60">Find your flavor profile</div>
                    </div>
                  </Link>
                  <Link
                    href="/rides"
                    className="flex items-center gap-3 px-4 py-3 text-cream hover:bg-gold/10 hover:text-gold transition-colors border-b border-gold/10"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="text-xl">🚗</span>
                    <div>
                      <div className="font-medium">Compare Rides</div>
                      <div className="text-xs text-cream/60">Uber, Lyft & more</div>
                    </div>
                  </Link>
                  <Link
                    href="/chat"
                    className="flex items-center gap-3 px-4 py-3 text-cream hover:bg-gold/10 hover:text-gold transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="text-xl">💬</span>
                    <div>
                      <div className="font-medium">Event Chats</div>
                      <div className="text-xs text-cream/60">Connect with foodies</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/survey"
              className="bg-burgundy text-cream px-6 py-2 border border-gold hover:bg-gold hover:text-burgundy-deep transition-all"
            >
              Take Survey
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-burgundy-deep to-black opacity-90" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block text-gold text-sm tracking-[0.3em] uppercase mb-6 px-6 py-2 border border-gold"
          >
            The Crescent City's Culinary Guide
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl text-cream mb-6"
          >
            Discover the <em className="italic text-gold">Soul</em> of<br />New Orleans Cuisine
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-cream-dark text-xl max-w-2xl mx-auto mb-10 font-light"
          >
            From legendary Creole kitchens to hidden neighborhood gems, explore the tastes that make NOLA the culinary capital of the South.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/restaurants" 
              className="bg-gold text-burgundy-deep px-10 py-4 text-lg border-2 border-gold hover:bg-transparent hover:text-gold transition-all"
            >
              Explore Restaurants
            </Link>
            <Link 
              href="/experiences" 
              className="bg-transparent text-cream px-10 py-4 text-lg border border-cream hover:bg-cream hover:text-burgundy-deep transition-all"
            >
              Book an Experience
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gold text-xs tracking-[0.2em] uppercase flex flex-col items-center gap-2"
        >
          Scroll
          <div className="w-px h-10 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* Cuisines Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-burgundy text-sm tracking-[0.3em] uppercase block mb-4">Culinary Traditions</span>
            <h2 className="font-playfair text-5xl md:text-6xl text-burgundy-deep">
              Taste the <em className="italic text-gold">Traditions</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cuisines.map((cuisine, index) => (
              <motion.div
                key={cuisine.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  href={`/restaurants?cuisine=${cuisine.id}`}
                  className="group block relative h-96 overflow-hidden border border-cream-dark hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${cuisine.color} group-hover:opacity-90 transition-opacity`} />
                  
                  <div className="absolute top-6 right-6 bg-gold text-burgundy-deep px-3 py-1 text-xs font-bebas tracking-wider z-10">
                    {cuisine.count} SPOTS
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform translate-y-5 group-hover:translate-y-0 transition-transform">
                    <div className="text-5xl mb-3">{cuisine.icon}</div>
                    <h3 className="font-playfair text-3xl text-cream mb-2">{cuisine.name}</h3>
                    <p className="text-cream-dark text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Discover authentic {cuisine.name.toLowerCase()} cuisine
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-24 px-6 bg-burgundy-deep">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-light text-sm tracking-[0.3em] uppercase block mb-4">Where to Dine</span>
            <h2 className="font-playfair text-5xl md:text-6xl text-cream">
              Featured <em className="italic text-gold">Restaurants</em>
            </h2>
          </div>

          <div className="space-y-4">
            {featuredRestaurants.map((restaurant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/restaurants/${restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="flex items-center gap-8 p-6 bg-white/5 border border-gold/20 hover:border-gold hover:bg-gold/10 transition-all hover:translate-x-2"
                >
                  <span className="font-bebas text-3xl text-gold w-12">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-1">
                    <h3 className="font-playfair text-2xl text-cream mb-1">{restaurant.name}</h3>
                    <p className="text-gold-light text-sm tracking-wider uppercase">{restaurant.cuisine}</p>
                  </div>
                  <span className="hidden sm:block text-cream-dark text-right min-w-[140px]">{restaurant.neighborhood}</span>
                  <div className="flex items-center gap-2 text-gold font-bebas text-lg">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {restaurant.rating}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/restaurants" 
              className="inline-block bg-transparent text-cream px-10 py-4 border border-cream hover:bg-cream hover:text-burgundy-deep transition-all"
            >
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gold text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl text-burgundy-deep mb-4">
            Stay Hungry, Stay Updated
          </h2>
          <p className="text-brown text-lg mb-8">
            Get weekly picks from our editors, exclusive restaurant openings, and first access to culinary events.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 max-w-md px-6 py-3 border-2 border-burgundy-deep bg-transparent text-burgundy-deep placeholder-burgundy/60 focus:outline-none focus:border-burgundy"
            />
            <button
              type="button"
              className="bg-burgundy-deep text-cream px-8 py-3 border-2 border-burgundy-deep hover:bg-transparent hover:text-burgundy-deep transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center font-playfair font-bold text-burgundy-deep text-xl">
                  N
                </div>
                <div className="font-bebas text-2xl tracking-widest text-cream">
                  NEW ORLEANS<span className="text-gold">CHEF</span>
                </div>
              </Link>
              <p className="text-cream-dark text-sm">
                Your guide to the soul of New Orleans cuisine. From legendary institutions to hidden gems.
              </p>
            </div>

            <div>
              <h4 className="font-bebas text-lg tracking-wider text-gold mb-4">EXPLORE</h4>
              <div className="space-y-2">
                <Link href="/restaurants/commanders-palace" className="block text-cream-dark hover:text-gold transition-colors">Restaurants</Link>
                <Link href="/events/evt-1" className="block text-cream-dark hover:text-gold transition-colors">Events</Link>
                <Link href="/survey" className="block text-cream-dark hover:text-gold transition-colors">Taste Survey</Link>
                <Link href="/rides" className="block text-cream-dark hover:text-gold transition-colors">Compare Rides</Link>
                <Link href="/chat" className="block text-cream-dark hover:text-gold transition-colors">Event Chats</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bebas text-lg tracking-wider text-gold mb-4">FOR RESTAURANTS</h4>
              <div className="space-y-2">
                <a href="mailto:john@nthtrip.com" className="block text-cream-dark hover:text-gold transition-colors">Claim Your Listing</a>
                <a href="mailto:john@nthtrip.com" className="block text-cream-dark hover:text-gold transition-colors">Partner With Us</a>
              </div>
            </div>

            <div>
              <h4 className="font-bebas text-lg tracking-wider text-gold mb-4">COMPANY</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-cream-dark hover:text-gold transition-colors">About Us</Link>
                <a href="mailto:john@nthtrip.com" className="block text-cream-dark hover:text-gold transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gold/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-cream-dark text-sm">
            <p>© 2026 New Orleans Chef. All rights reserved.</p>
            <p>Powered by <a href="https://getnth.com" className="text-gold hover:underline">GetNth</a></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
