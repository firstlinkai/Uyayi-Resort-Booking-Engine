import { Clock, Users, ArrowRight, Coffee, Utensils, Wine, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DiningOption {
  id: string;
  name: string;
  cuisine: string;
  hours: string;
  capacity: string;
  description: string;
  image_url: string;
}

const DINING_EXPERIENCES = [
  {
    title: 'In-Room Dining',
    description: 'Enjoy our culinary offerings from the comfort and privacy of your villa or suite.',
    note: 'Available 24 hours',
    icon: Coffee,
  },
  {
    title: 'Private Beach Dinner',
    description: 'A romantic, customized menu served at a secluded spot on our pristine beach.',
    note: 'By reservation only',
    icon: Wine,
  },
  {
    title: 'Chef\'s Table Experience',
    description: 'An exclusive, interactive dining journey hosted personally by our Executive Chef.',
    note: 'Limited to 8 guests',
    icon: Utensils,
  },
  {
    title: 'Sunday Kamayan Brunch',
    description: 'A traditional Filipino feast served on banana leaves, meant to be eaten with your hands.',
    note: 'Sundays, 11 AM - 2 PM',
    icon: Sun,
  }
];

export default function Dining() {
  const [restaurants, setRestaurants] = useState<DiningOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDiningOptions() {
      try {
        const { data, error } = await supabase
          .from('dining_options')
          .select('*')
          .order('name'); // Assuming you want them ordered, or you can remove this

        if (error) {
          console.error('Error fetching dining options:', error);
          return;
        }

        if (data) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDiningOptions();
  }, []);

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
          alt="Dining at golden hour" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            A Culinary Journey Through Palawan
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            Where fresh catch meets Filipino soul
          </p>
        </div>
      </section>

      {/* Section 2: Our Restaurants */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            <p>No dining options available at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {restaurants.map((restaurant, index) => (
              <div 
                key={restaurant.id || restaurant.name} 
                className={cn(
                  "flex flex-col lg:flex-row gap-12 items-center",
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                )}
              >
                <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] overflow-hidden rounded-sm shadow-lg">
                  <img 
                    src={restaurant.cover_image || restaurant.image_url || {
                      'Baybayin Grill': 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop',
                      'Sipat Café': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2070&auto=format&fit=crop',
                      'The Tide Bar': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop',
                      'Pick-a-Chai Cafe': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop'
                    }[(restaurant as any).name || restaurant.name] || 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop'} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-2">{restaurant.name}</h2>
                  <p className="text-coral font-medium uppercase tracking-wider text-sm mb-6">{restaurant.cuisine}</p>
                  
                  <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm text-text-secondary border-y border-shell py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-coral" />
                      <span>{restaurant.opening_hours || restaurant.hours || '6:00 AM - 10:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-coral" />
                      <span>{restaurant.seating_capacity || restaurant.capacity || 'Contact for seating'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-deep-sea hover:bg-deep-sea/90 text-white px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors text-center">
                      Reserve Table
                    </button>
                    <button className="border border-deep-sea text-deep-sea hover:bg-mist px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors text-center">
                      View Menu
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Culinary Gallery */}
      <section className="py-24 bg-mist px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-12 text-center">A Feast for the Senses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative h-64 md:h-80 group overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2069&auto=format&fit=crop" alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-editorial italic text-2xl">Grilled Lobster</p>
              </div>
            </div>
            <div className="relative h-64 md:h-80 group overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-editorial italic text-2xl">Local Ingredients</p>
              </div>
            </div>
            <div className="relative h-64 md:h-80 group overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1977&auto=format&fit=crop" alt="Food" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white font-editorial italic text-2xl">Chef in Action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Dining Options Overview */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Curated Experiences</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Beyond our restaurants, we offer unique dining moments tailored to your desires.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DINING_EXPERIENCES.map((exp) => (
            <div key={exp.title} className="bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center border border-shell">
              <div className="w-16 h-16 bg-mist rounded-full flex items-center justify-center mb-6">
                <exp.icon className="w-8 h-8 text-coral" />
              </div>
              <h3 className="text-xl font-bold text-deep-sea mb-4">{exp.title}</h3>
              <p className="text-text-secondary mb-6 flex-grow">{exp.description}</p>
              <p className="text-sm font-medium text-deep-sea mb-6">{exp.note}</p>
              <button className="text-coral font-semibold uppercase tracking-wider text-sm hover:text-coral-light transition-colors flex items-center gap-1">
                Enquire <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Reservation CTA */}
      <section className="bg-shell py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-editorial italic text-4xl md:text-5xl text-deep-sea mb-8">Ready to dine with us?</h2>
          <button className="bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors">
            Make a Dining Reservation
          </button>
        </div>
      </section>
    </div>
  );
}

