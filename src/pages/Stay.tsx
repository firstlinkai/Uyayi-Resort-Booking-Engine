import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize, BedDouble, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Room {
  id: string;
  name: string;
  view: string;
  size: number;
  guests: number;
  bed: string;
  price: number;
  image: string;
  description: string;
  type?: string;
}

export default function Stay() {
  const [filterType, setFilterType] = useState('All');
  const [filterView, setFilterView] = useState('All');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('base_price_php', { ascending: false });

        if (error) {
          console.error('Error fetching rooms:', error);
          return;
        }

        if (data) {
          setRooms(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchType = filterType === 'All' || (room.type && room.type.includes(filterType)) || room.name.includes(filterType);
    const matchView = filterView === 'All' || room.view === filterView;
    return matchType && matchView;
  });

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop" 
          alt="Villa at sunset" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Your Private Corner of Paradise
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            Choose from our curated collection of villas, suites, and rooms
          </p>
        </div>
      </section>

      {/* Section 2: Room Filter Bar */}
      <div className="sticky top-[72px] z-40 bg-white border-b border-shell shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">Type:</span>
              <select 
                className="bg-transparent text-deep-sea font-medium focus:outline-none cursor-pointer"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option>All</option>
                <option>Villa</option>
                <option>Suite</option>
                <option>Deluxe</option>
                <option>Standard</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">View:</span>
              <select 
                className="bg-transparent text-deep-sea font-medium focus:outline-none cursor-pointer"
                value={filterView}
                onChange={(e) => setFilterView(e.target.value)}
              >
                <option>All</option>
                <option>Ocean View</option>
                <option>Garden View</option>
                <option>Beachfront</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-text-secondary">
            Showing {filteredRooms.length} rooms
          </div>
        </div>
      </div>

      {/* Section 3: Room Varieties — Card Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center text-text-secondary py-12">
            <p>No rooms match your criteria. Please try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={room.thumbnail_url || room.image || {
                      'Beachfront Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Beachfront%20Villa.jpeg',
                      'Ocean Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Ocean%20Suite.jpeg',
                      'Garden Deluxe Room': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Garden%20Deluxe%20Room.jpeg',
                      'Family Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Family%20Villa.jpeg',
                      'Pool Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Pool%20Suite.jpeg'
                    }[(room as any).name] || 'https://images.unsplash.com/photo-1582719478250-c89ca4dc85b?q=80&w=2070&auto=format&fit=crop'} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-deep-sea rounded-sm">
                    {room.view}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-deep-sea mb-4">{room.name}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-4 h-4 text-coral" />
                      <span>{room.size_sqm || room.size} sqm</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-coral" />
                      <span>Up to {room.max_guests || room.guests}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-coral" />
                      <span>{room.bed_configuration || room.bed}</span>
                    </div>
                  </div>
                  
                  <p className="text-text-secondary mb-8 line-clamp-2 flex-grow">
                    {room.description}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-shell pt-4 mb-6">
                    <div className="flex flex-col">
                      <span className="text-xs text-text-muted uppercase tracking-wider">From</span>
                      <span className="font-semibold text-deep-sea text-lg">₱{(room.base_price_php || room.price)?.toLocaleString()} <span className="text-sm font-normal text-text-secondary">/ night</span></span>
                    </div>
                    <Link to={`/stay/${room.id}`} className="text-coral font-semibold uppercase tracking-wider text-sm hover:text-coral-light transition-colors flex items-center gap-1">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <button className="w-full bg-deep-sea hover:bg-deep-sea/90 text-white py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 6: Book Now CTA Banner */}
      <section className="bg-coral py-20 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-editorial italic text-4xl md:text-5xl mb-4">Ready to make this your home for a while?</h2>
          <p className="font-sans text-lg md:text-xl mb-8 opacity-90">Book directly for our best available rates.</p>
          <button className="bg-white text-coral hover:bg-mist px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors">
            Check Availability
          </button>
        </div>
      </section>
    </div>
  );
}

