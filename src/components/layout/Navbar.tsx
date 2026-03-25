import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Stay', path: '/stay' },
  { name: 'Dining', path: '/dining' },
  { name: 'Activities', path: '/activities' },
  { name: 'Events', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Check if current page has a hero section that requires transparent nav initially
  const isTransparentInitial = ['/', '/about', '/stay', '/dining', '/activities', '/events', '/gallery', '/faq'].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-12 py-4 flex items-center justify-between',
    {
      'bg-white/90 backdrop-blur-md shadow-sm text-text-primary': isScrolled || !isTransparentInitial,
      'bg-transparent text-white': !isScrolled && isTransparentInitial,
    }
  );

  return (
    <>
      <nav className={navClasses}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-50">
          <span className="font-editorial text-2xl tracking-wide font-medium">
            Uyayi Sa Baybay
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                'text-sm font-medium tracking-wide uppercase transition-colors hover:text-coral relative group',
                location.pathname === link.path ? 'text-coral' : ''
              )}
            >
              {link.name}
              <span className={cn(
                "absolute -bottom-1 left-0 w-full h-0.5 bg-coral transform origin-left transition-transform duration-300",
                location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              )} />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/account" className="p-2 hover:text-coral transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link
            to="/stay"
            className="bg-coral hover:bg-coral-light text-white px-6 py-2.5 rounded-sm text-sm font-semibold uppercase tracking-wide transition-colors"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-sand flex flex-col pt-24 px-6 pb-6 md:hidden"
          >
            <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-2xl font-editorial tracking-wide',
                    location.pathname === link.path ? 'text-coral' : 'text-text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-shell flex flex-col gap-4">
              <Link
                to="/account"
                className="flex items-center gap-2 text-text-primary font-medium"
              >
                <User className="w-5 h-5" />
                Sign In / Account
              </Link>
              <Link
                to="/stay"
                className="bg-coral text-white text-center py-4 rounded-sm font-semibold uppercase tracking-wide"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
