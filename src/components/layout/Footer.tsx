import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-deep-sea text-white pt-20 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1 - Brand */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <img src="/uyayi-logo.jpeg" alt="Uyayi Sa Baybay Logo" className="h-20 w-auto object-contain rounded-lg bg-white p-1" />
            <p className="font-editorial italic text-mist/80 text-lg mt-2">Home by the Shore</p>
          </div>
          <address className="not-italic text-mist/70 text-sm leading-relaxed">
            123 Beachfront Road<br />
            El Nido, Palawan 5313<br />
            Philippines
          </address>
          <div className="flex flex-col gap-2 text-sm text-mist/70">
            <a href="tel:+639123456789" className="hover:text-coral transition-colors">+63 912 345 6789</a>
            <a href="mailto:hello@uyayisababybay.com" className="hover:text-coral transition-colors">hello@uyayisababybay.com</a>
          </div>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-mist/70 hover:text-coral transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-mist/70 hover:text-coral transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-mist/70 hover:text-coral transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-mist/70 hover:text-coral transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Column 2 - Explore */}
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-sm mb-6 text-mist">Explore</h3>
          <ul className="flex flex-col gap-4 text-mist/70 text-sm">
            <li><Link to="/about" className="hover:text-coral transition-colors">About Us</Link></li>
            <li><Link to="/gallery" className="hover:text-coral transition-colors">Gallery</Link></li>
            <li><Link to="/activities" className="hover:text-coral transition-colors">Activities</Link></li>
          </ul>
        </div>

        {/* Column 3 - Stay */}
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-sm mb-6 text-mist">Stay</h3>
          <ul className="flex flex-col gap-4 text-mist/70 text-sm">
            <li><Link to="/stay" className="hover:text-coral transition-colors">All Rooms</Link></li>
            <li><Link to="/stay?type=villa" className="hover:text-coral transition-colors">Villas</Link></li>
            <li><Link to="/stay?type=suite" className="hover:text-coral transition-colors">Suites</Link></li>
            <li><Link to="/faq" className="hover:text-coral transition-colors">Booking Policy</Link></li>
            <li><span className="opacity-50 cursor-not-allowed">Gift Vouchers</span></li>
          </ul>
        </div>

        {/* Column 4 - Support */}
        <div>
          <h3 className="font-semibold uppercase tracking-wider text-sm mb-6 text-mist">Support</h3>
          <ul className="flex flex-col gap-4 text-mist/70 text-sm">
            <li><Link to="/contact" className="hover:text-coral transition-colors">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-coral transition-colors">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-coral transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-coral transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/sitemap" className="hover:text-coral transition-colors">Sitemap</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-mist/50">
        <p>&copy; 2026 Uyayi Sa Baybay. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>TripAdvisor â­â­â­â­â­</span>
          <span>Google 4.9/5</span>
        </div>
        <p>Designed with <span className="text-coral">â¤</span> in Palawan</p>
      </div>
    </footer>
  );
}
