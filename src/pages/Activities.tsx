import { ArrowRight, Clock, Users, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const FALLBACK_CATEGORIES = [
  {
    name: 'Water Sports',
    count: 8,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
    link: '#water-sports'
  },
  {
    name: 'Beach Activities',
    count: 5,
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop',
    link: '#beach-activities'
  },
  {
    name: 'Land & Nature',
    count: 6,
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop',
    link: '#land-nature'
  },
  {
    name: 'Cultural Experiences',
    count: 4,
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=2070&auto=format&fit=crop',
    link: '#cultural'
  }
];

const FALLBACK_FEATURED = [
  {
    name: 'Private Island Hopping',
    description: 'Charter a traditional outrigger boat and explore hidden lagoons, secret beaches, and pristine snorkeling spots at your own pace. Includes a private guide and a gourmet picnic lunch.',
    price: 4500,
    duration: '4-6 hours',
    guests: '2-6 guests',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop'
  },
  {
    name: 'Sunset Cruise',
    description: 'Sail along the coastline as the sky turns brilliant shades of coral and gold. Enjoy champagne and canapés while watching the sun dip below the Sulu Sea horizon.',
    price: 2500,
    duration: '2 hours',
    guests: '2-8 guests',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'Guided Scuba Diving',
    description: 'Discover vibrant coral reefs and diverse marine life with our PADI-certified instructors. Suitable for both beginners and experienced divers.',
    price: 3500,
    duration: '3 hours',
    guests: '1-4 guests',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'
  }
];

const FALLBACK_WATER_SPORTS = [
  { name: 'Snorkeling', duration: '2 hrs', price: 800, description: 'Explore the house reef just steps from the beach.', image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Kayaking', duration: '1 hr', price: 500, description: 'Paddle along the calm coastal waters.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Stand-Up Paddle', duration: '1 hr', price: 600, description: 'Test your balance on our premium SUP boards.', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Jet Ski', duration: '30 mins', price: 2500, description: 'High-speed thrills across the open water.', image: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?q=80&w=1974&auto=format&fit=crop' },
];

export default function Activities() {
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES);
  const [featuredActivities, setFeaturedActivities] = useState<any[]>(FALLBACK_FEATURED);
  const [waterSports, setWaterSports] = useState<any[]>(FALLBACK_WATER_SPORTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, actRes] = await Promise.all([
          supabase.from('activity_categories').select('*'),
          supabase.from('activities').select('*')
        ]);

        if (catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
        
        if (actRes.data && actRes.data.length > 0) {
          const featured = actRes.data.filter(a => a.is_featured);
          if (featured.length > 0) setFeaturedActivities(featured);
          
          const water = actRes.data.filter(a => a.category === 'Water Sports' || a.category === 'water_sports' || a.category?.toLowerCase().includes('water'));
          if (water.length > 0) setWaterSports(water);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop" 
          alt="Diving" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Adventures Await at Every Tide
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            From the depths of coral reefs to the peak of limestone cliffs
          </p>
        </div>
      </section>

      {/* Section 2: Available Activities Overview */}
      <section className="py-24 bg-mist px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category) => (
                <a 
                  key={category.id || category.name} 
                  href={category.link || `#${category.name?.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative h-64 md:h-80 overflow-hidden rounded-sm block"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />
                  <img 
                    src={category.image_url || category.image || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop'} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                    <h3 className="font-editorial text-3xl text-white mb-2">{category.name}</h3>
                    <div className="flex items-center justify-between text-white/90">
                      <span className="text-sm uppercase tracking-wider">{category.count || category.activity_count || 'Explore'} Activities</span>
                      <span className="text-coral-light font-semibold uppercase tracking-wider text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                        Explore <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3: Featured Activities */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Signature Adventures</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Our most sought-after experiences, highly recommended for first-time visitors.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="space-y-24">
            {featuredActivities.map((activity, index) => (
              <div 
                key={activity.id || activity.name} 
                className={cn(
                  "flex flex-col lg:flex-row gap-12 items-center",
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                )}
              >
                <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] overflow-hidden rounded-sm shadow-lg">
                  <img 
                    src={activity.thumbnail_url || activity.image || activity.image_url || {
                      'Island Hopping Tour': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2070&auto=format&fit=crop',
                      'Scuba Diving': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
                      'Stand-Up Paddleboarding': 'https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=2070&auto=format&fit=crop',
                      'Kayaking': 'https://images.unsplash.com/photo-1500353391642-d81befe4867c?q=80&w=1974&auto=format&fit=crop',
                      'Sunset Cruise': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2072&auto=format&fit=crop',
                      'Snorkeling': 'https://images.unsplash.com/photo-1544551763-46bc013bb70d5?q=80&w=2070&auto=format&fit=crop'
                    }[activity.name] || 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop'} 
                    alt={activity.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-deep-sea mb-6">{activity.name}</h3>
                  <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    {activity.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 mb-8 text-sm text-text-secondary border-y border-shell py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-coral" />
                      <span>{activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-coral" />
                      <span>{activity.guests || 'Varies'}</span>
                    </div>
                    <div className="flex flex-col ml-auto text-right">
                      <span className="text-xs text-text-muted uppercase tracking-wider">From</span>
                      <span className="font-semibold text-deep-sea text-lg">₱{(activity.price_per_person_php || activity.price)?.toLocaleString()} <span className="text-sm font-normal text-text-secondary">/ person</span></span>
                    </div>
                  </div>
                  
                  <button className="bg-deep-sea hover:bg-deep-sea/90 text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors w-full sm:w-auto self-start">
                    Book This Activity
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 4: Experience The Fun — Video Section */}
      <section className="py-24 bg-deep-sea text-white text-center px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-editorial italic text-4xl md:text-5xl mb-12">One Island. Endless Adventures.</h2>
          <div className="relative aspect-video bg-black rounded-sm overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=2070&auto=format&fit=crop" 
              alt="Video thumbnail" 
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-coral rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Water Sports */}
      <section id="water-sports" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-12">Water Sports</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {waterSports.map((item) => (
              <div key={item.id || item.name} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-shell flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img src={item.thumbnail_url || item.image || item.image_url || {
                    'Island Hopping Tour': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2070&auto=format&fit=crop',
                    'Scuba Diving': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
                    'Stand-Up Paddleboarding': 'https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=2070&auto=format&fit=crop',
                    'Kayaking': 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?q=80&w=2070&auto=format&fit=crop',
                    'Sunset Cruise': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2072&auto=format&fit=crop',
                    'Snorkeling': 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1974&auto=format&fit=crop'
                  }[item.name] || 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=1974&auto=format&fit=crop'} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-deep-sea mb-2">{item.name}</h3>
                  <div className="flex justify-between text-sm text-text-secondary mb-4">
                    <span>{item.duration_minutes ? `${item.duration_minutes} mins` : item.duration}</span>
                    <span className="font-semibold text-deep-sea">₱{(item.price_per_person_php || item.price)?.toLocaleString()}</span>
                  </div>
                  <p className="text-text-secondary text-sm mb-6 flex-grow">{item.description || item.desc}</p>
                  <button className="w-full border border-deep-sea text-deep-sea hover:bg-mist py-2 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors">
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 7: Activity Booking CTA Banner */}
      <section className="bg-coral py-20 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-editorial italic text-4xl md:text-5xl mb-8">Ready to dive in? Our activity concierge is here to help.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-coral hover:bg-mist px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto">
              Book an Activity
            </button>
            <button className="border border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto">
              Contact Concierge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

