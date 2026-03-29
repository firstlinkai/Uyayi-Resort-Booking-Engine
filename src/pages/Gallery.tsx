import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Gallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using the 55 local images uploaded by the user, skipping image 25 as requested
    const localPhotos = Array.from({ length: 55 }, (_, i) => ({
      id: i + 1,
      src: `/Media/Images/uyayi website assets/usb_web (${i + 1}).jpg`,
      alt: `Uyayi Sa Baybay Gallery - Image ${i + 1}`
    })).filter(img => img.id !== 25);
    
    setImages(localPhotos);
    setLoading(false);
  }, []);

  const handlePrevious = useCallback((e?: MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, [selectedImageIndex, images.length]);

  const handleNext = useCallback((e?: MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, [selectedImageIndex, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, handlePrevious, handleNext]);

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-deep-sea">
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl mb-4 tracking-wide">
            Unfiltered Palawan
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            A visual journey through the simple, sun-drenched days at Uyayi Sa Baybay.
          </p>
        </div>
      </section>

      {/* Section 2: Photo Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No images found in the gallery.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div 
                key={image.id || index} 
                className="relative aspect-square overflow-hidden rounded-sm cursor-pointer group"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enhanced Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button 
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[60]"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation - Left */}
          <button 
            onClick={handlePrevious}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-[60] p-2 bg-black/20 rounded-full hover:bg-black/40"
          >
            <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
          </button>

          {/* Main Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={images[selectedImageIndex].src} 
              alt={images[selectedImageIndex].alt} 
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl transition-all duration-300 select-none"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70 font-sans tracking-widest text-sm uppercase">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Navigation - Right */}
          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-[60] p-2 bg-black/20 rounded-full hover:bg-black/40"
          >
            <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
          </button>
        </div>
      )}
    </div>
  );
}

