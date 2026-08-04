import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { 
  ArrowLeft, Maximize, Users, BedDouble, Wind, Check, 
  Minus, Plus, Calendar as CalendarIcon, ChevronDown 
} from 'lucide-react';
import 'react-day-picker/dist/style.css';

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 3)
  });
  const [isBooking, setIsBooking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [email, setEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

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
          // Set initial guest count to 1 or current
          setGuestCount(1);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  const handleBookNow = async () => {
    if (!room || !dateRange?.from || !dateRange?.to) {
      alert("Please select a valid date range");
      return;
    }

    setIsBooking(true);
    try {
      // 1. Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      const targetEmail = user?.email || email;

      if (!targetEmail) {
        setShowEmailInput(true);
        setIsBooking(false);
        return;
      }

      console.log('Initiating checkout for room:', room.id, 'with email:', targetEmail);
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          roomId: room.id,
          checkIn: format(dateRange.from, 'yyyy-MM-dd'),
          checkOut: format(dateRange.to, 'yyyy-MM-dd'),
          guestCount,
          userEmail: targetEmail
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      if (data?.url) {
        console.log('Redirecting to checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned from function');
        alert('Could not generate a checkout link. Please contact support.');
      }
    } catch (err: any) {
      console.error('Booking error detail:', err);
      // Try to get a more detailed error from the response if available
      let errorMsg = 'There was an error initiating your booking. Please try again.';
      if (err.context?.json) {
        const body = await err.context.json();
        if (body.error) errorMsg = body.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
      alert(`Booking Error: ${errorMsg}`);
    } finally {
      setIsBooking(false);
    }
  };

  const nights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;
  
  const totalPrice = room ? (room.base_price_php || room.price) * nights : 0;

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
          <img src={room.thumbnail_url || (room as any).image || {
            'Beachfront Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Beachfront%20Villa.jpeg',
            'Ocean Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Ocean%20Suite.jpeg',
            'Garden Deluxe Room': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Garden%20Deluxe%20Room.jpeg',
            'Family Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Family%20Villa.jpeg',
            'Pool Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Pool%20Suite.jpeg'
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
              <div className="space-y-2 relative">
                <label className="text-xs font-medium text-deep-sea uppercase tracking-wider">Check-in / Check-out</label>
                <div 
                  className="border border-shell rounded-sm px-4 py-3 text-text-secondary bg-sand/30 cursor-pointer flex justify-between items-center"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-4 h-4 text-coral" />
                    <span className="flex-1">
                      {dateRange?.from ? (
                        <>
                          {format(dateRange.from, 'MMM dd')} - {dateRange.to ? format(dateRange.to, 'MMM dd') : 'Select end date'}
                        </>
                      ) : (
                        'Select dates'
                      )}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${showCalendar ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {showCalendar && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 z-50 bg-white shadow-2xl border border-shell mt-2 p-6 rounded-xl origin-top animate-in fade-in zoom-in duration-200 w-[90vw] max-w-4xl lg:w-auto">
                    <div className="flex justify-between items-center mb-4 lg:hidden">
                      <h4 className="font-bold text-deep-sea">Select Dates</h4>
                      <button onClick={() => setShowCalendar(false)} className="text-coral underline text-sm">Close</button>
                    </div>
                    <DayPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range);
                      }}
                      numberOfMonths={window.innerWidth > 1024 ? 2 : 1}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                      modifiersStyles={{
                        selected: { backgroundColor: '#d97706', color: 'white' },
                        range_start: { backgroundColor: '#d97706', color: 'white', borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' },
                        range_end: { backgroundColor: '#d97706', color: 'white', borderTopRightRadius: '50%', borderBottomRightRadius: '50%' },
                        range_middle: { backgroundColor: '#fef3c7', color: '#d97706' }
                      }}
                    />
                    <div className="flex justify-end gap-4 mt-4 pt-4 border-t border-shell">
                      <button 
                        onClick={() => {
                          setDateRange(undefined);
                        }}
                        className="text-sm font-medium text-text-muted hover:text-deep-sea transition-colors"
                      >
                        Clear dates
                      </button>
                      <button 
                        onClick={() => setShowCalendar(false)}
                        className="bg-deep-sea text-white px-4 py-2 rounded-sm text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-deep-sea uppercase tracking-wider">Guests</label>
                <div className="flex items-center justify-between border border-shell rounded-sm px-4 py-3 bg-sand/30">
                  <span className="text-text-secondary">
                    {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-shell text-deep-sea hover:border-coral hover:text-coral transition-colors"
                      type="button"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setGuestCount(Math.min((room as any).max_guests || 4, guestCount + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-shell text-deep-sea hover:border-coral hover:text-coral transition-colors"
                      type="button"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {nights > 0 && (
              <div className="mb-6 space-y-2 py-4 border-t border-shell">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">₱{((room as any).base_price_php || room.price)?.toLocaleString()} x {nights} nights</span>
                  <span className="text-deep-sea font-medium">₱{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-shell/50">
                  <span className="text-deep-sea">Total</span>
                  <span className="text-coral">₱{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            {showEmailInput && (
              <div className="mb-6 p-4 bg-sand/50 border border-coral/20 rounded-sm animate-in slide-in-from-top-2">
                <label className="text-xs font-medium text-deep-sea uppercase tracking-wider block mb-2">Enter Email to Book</label>
                <input 
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border border-shell rounded-sm px-4 py-2 text-text-secondary bg-white focus:outline-none focus:border-coral mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-[10px] text-text-muted">We'll use this to send your booking confirmation.</p>
              </div>
            )}

            <button 
              onClick={handleBookNow}
              disabled={isBooking || !dateRange?.from || !dateRange?.to}
              className="w-full bg-coral hover:bg-coral-light disabled:bg-coral/50 text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              {isBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                showEmailInput ? 'Confirm & Book' : 'Book Now'
              )}
            </button>
            <p className="text-xs text-center text-text-muted mt-4">Best rate guarantee when you book directly with us.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
