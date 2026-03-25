import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const FALLBACK_CATEGORIES = ['All', 'Villas', 'Dining', 'Activities', 'Resort'];

const FALLBACK_IMAGES = [
  { id: 1, category: 'Villas', src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop', alt: 'Oceanfront Villa Exterior' },
  { id: 2, category: 'Resort', src: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop', alt: 'Main Pool Area' },
  { id: 3, category: 'Dining', src: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop', alt: 'Beachfront Dining' },
  { id: 4, category: 'Activities', src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop', alt: 'Scuba Diving' },
  { id: 5, category: 'Villas', src: 'https://images.unsplash.com/photo-1582719478250-c89400bb1536?q=80&w=2070&auto=format&fit=crop', alt: 'Villa Interior' },
  { id: 6, category: 'Resort', src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop', alt: 'Resort Aerial View' },
  { id: 7, category: 'Dining', src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop', alt: 'Fine Dining Restaurant' },
  { id: 8, category: 'Activities', src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop', alt: 'Paddleboarding' },
  { id: 9, category: 'Villas', src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop', alt: 'Villa Bedroom' },
  { id: 10, category: 'Resort', src: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop', alt: 'Garden Path' },
  { id: 11, category: 'Dining', src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop', alt: 'Cocktails at Sunset' },
  { id: 12, category: 'Activities', src: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop', alt: 'Island Hopping Boat' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [images, setImages] = useState<any[]>(FALLBACK_IMAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, imgRes] = await Promise.all([
          supabase.from('gallery_categories').select('*'),
          supabase.from('gallery_images').select('*')
        ]);

        if (catRes.data && catRes.data.length > 0) {
          setCategories(['All', ...catRes.data.map(c => c.name)]);
        }
        
        if (imgRes.data && imgRes.data.length > 0) {
          setImages(imgRes.data.map(img => ({
            id: img.id,
            category: img.category || img.category_name || 'Resort',
            src: img.image_url || img.src || img.url,
            alt: img.alt_text || img.title || img.name || 'Gallery Image'
          })));
        }
      } catch (err) {
        console.error('Error fetching gallery data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => {
        const cat = img.category?.toLowerCase();
        const activeCat = activeCategory.toLowerCase();
        
        // Handle specific mappings
        if (activeCategory === 'Villas') return cat === 'rooms_villas' || cat === 'villas';
        if (activeCategory === 'Resort') return cat === 'aerial_beach' || cat === 'resort';
        
        // Default case-insensitive match
        return cat === activeCat;
      });

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-deep-sea">
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl mb-4 tracking-wide">
            A Glimpse of Paradise
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            Explore the beauty of Uyayi Sa Baybay
          </p>
        </div>
      </section>

      {/* Section 2: Filterable Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-colors border",
                activeCategory === category 
                  ? "bg-deep-sea text-white border-deep-sea" 
                  : "bg-transparent text-text-secondary border-shell hover:border-deep-sea hover:text-deep-sea"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            No images found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div 
                key={image.id} 
                className="relative aspect-square overflow-hidden rounded-sm cursor-pointer group"
                onClick={() => setSelectedImage(image.src)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium tracking-wider uppercase text-sm">{image.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-12">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="Enlarged view" 
            className="max-w-full max-h-full object-contain rounded-sm"
          />
        </div>
      )}
    </div>
  );
}

