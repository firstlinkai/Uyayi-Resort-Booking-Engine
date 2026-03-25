import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Maximize, BedDouble, Check, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Room {
  id: string;
  name: string;
  type: string;
  view: string;
  size: number | string;
  guests: number | string;
  bed: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
}

export default function RoomDetail() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) return;
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (error) {
          console.error('Error fetching room:', error);
          return;
        }

        if (data) {
          setRoom(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-deep-sea mb-4">Room Not Found</h2>
          <p className="text-text-secondary mb-8">The room you are looking for does not exist.</p>
          <Link to="/stay" className="text-coral hover:text-coral-light font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Accommodations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen pt-20">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link to="/stay" className="text-text-secondary hover:text-coral font-medium uppercase tracking-wider text-sm flex items-center gap-2 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Accommodations
        </Link>
      </div>

      {/* Hero Image */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="w-full h-[50vh] md:h-[60vh] rounded-sm overflow-hidden shadow-lg">
          <img src={room.thumbnail_url || room.image || {
            'Beachfront Villa': 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
            'Ocean Suite': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
            'Garden Deluxe Room': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
            'Family Villa': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop',
            'Pool Suite': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop'
          }[(room as any).name || room.name] || 'https://images.unsplash.com/photo-1582719478250-c89ca4dc85b?q=80&w=2070&auto=format&fit=crop'} alt={room.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h1 className="font-editorial text-4xl md:text-5xl text-deep-sea mb-4">{room.name}</h1>
            <p className="text-text-secondary text-lg leading-relaxed">{room.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-shell">
            <div className="flex flex-col items-center text-center gap-2">
              <Maximize className="w-6 h-6 text-coral" />
              <span className="text-sm text-text-secondary">{(room as any).size_sqm || room.size} {typeof (room as any).size_sqm === 'number' || typeof room.size === 'number' ? 'sqm' : ''}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Users className="w-6 h-6 text-coral" />
              <span className="text-sm text-text-secondary">Up to {(room as any).max_guests || room.guests}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <BedDouble className="w-6 h-6 text-coral" />
              <span className="text-sm text-text-secondary">{(room as any).bed_configuration || room.bed}</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Wind className="w-6 h-6 text-coral" />
              <span className="text-sm text-text-secondary">{room.view}</span>
            </div>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-deep-sea mb-6">Room Amenities</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3 text-text-secondary">
                    <Check className="w-5 h-5 text-coral shrink-0" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-shell sticky top-32">
            <div className="mb-6 pb-6 border-b border-shell">
              <span className="text-sm text-text-muted uppercase tracking-wider block mb-1">Starting from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-deep-sea">₱{((room as any).base_price_php || room.price)?.toLocaleString()}</span>
                <span className="text-text-secondary">/ night</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-medium text-deep-sea uppercase tracking-wider">Check-in / Check-out</label>
                <div className="border border-shell rounded-sm px-4 py-3 text-text-secondary bg-sand/30 cursor-pointer">
                  Select dates
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-deep-sea uppercase tracking-wider">Guests</label>
                <select className="w-full border border-shell rounded-sm px-4 py-3 text-text-secondary bg-sand/30 focus:outline-none focus:border-coral appearance-none">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors">
              Book Now
            </button>
            <p className="text-xs text-center text-text-muted mt-4">Best rate guarantee when you book directly with us.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
