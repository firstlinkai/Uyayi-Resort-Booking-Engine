import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar as CalendarIcon, Users, Plus, Trash2, CheckCircle, Clock, X, Search, Filter, Phone, Mail, User, Info } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, isSameDay, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface Booking {
  id: string;
  booking_ref: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  num_adults: number;
  total_amount_php: number;
  status: string;
  payment_status: string;
  room_id: string;
  booked_via: string;
}

interface Room {
  id: string;
  name: string;
  base_price_php: number;
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'bookings' | 'walk-in'>('calendar');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  // Walk-in Form State
  const [walkIn, setWalkIn] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    nights: 1,
    paymentStatus: 'fully_paid'
  });

  // Auto-calculate nights
  useEffect(() => {
    if (walkIn.checkIn && walkIn.checkOut) {
      const start = new Date(walkIn.checkIn);
      const end = new Date(walkIn.checkOut);
      const diff = end.getTime() - start.getTime();
      const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setWalkIn(prev => ({ ...prev, nights }));
      }
    }
  }, [walkIn.checkIn, walkIn.checkOut]);

  useEffect(() => {
    fetchData();
  }, []);

  // Room inventory mapping (Adjust these numbers to match your resort's actual counts)
  const roomInventory: Record<string, number> = {
    'Beachfront Villa': 2,
    'Ocean Suite': 4,
    'Pool Suite': 2,
    'Garden Deluxe Room': 6,
    'Family Villa': 2
  };

  // Room color mapping
  const getRoomColor = (roomId: string) => {
    const roomColors: Record<string, string> = {
      'Beachfront Villa': '#FF7F50', // Coral
      'Ocean Suite': '#1B3A4B',     // Deep Sea
      'Pool Suite': '#4FB3E8',      // Sky Blue
      'Garden Deluxe Room': '#2D5A27', // Forest Green
      'Family Villa': '#8B4513'      // Saddle Brown
    };
    const roomName = rooms.find(r => r.id === roomId)?.name || '';
    return roomColors[roomName] || '#829399';
  };

  async function fetchData() {
    setLoading(true);
    const [bookingsRes, roomsRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('rooms').select('id, name, base_price_php')
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (roomsRes.data) setRooms(roomsRes.data);
    setLoading(false);
  }

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel and delete this booking?')) return;
    
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) alert('Error deleting booking: ' + error.message);
    else fetchData();
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const room = rooms.find(r => r.id === walkIn.roomId);
    if (!room) return;

    const totalPrice = room.base_price_php * walkIn.nights;
    const bookingRef = `USB-WALK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      const fetchResponse = await fetch(`${supabaseUrl}/functions/v1/admin-create-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          booking_ref: bookingRef,
          guest_first_name: walkIn.firstName,
          guest_last_name: walkIn.lastName,
          guest_email: walkIn.email,
          guest_phone: walkIn.phone,
          room_id: walkIn.roomId,
          room_name_snapshot: room.name,
          check_in: walkIn.checkIn,
          check_out: walkIn.checkOut,
          num_adults: walkIn.guests,
          num_children: 0,
          rate_per_night_php: room.base_price_php,
          subtotal_php: totalPrice,
          extras_total_php: 0,
          discount_amount_php: 0,
          vat_php: 0,
          service_charge_php: 0,
          total_amount_php: totalPrice,
          status: 'confirmed',
          payment_status: walkIn.paymentStatus,
          booked_via: 'walk_in'
        })
      });

      const result = await fetchResponse.json();

      if (!fetchResponse.ok) {
        throw new Error(result.error || result.message || 'Unknown error');
      }

      alert('Walk-in booking successful!');
      setActiveTab('bookings');
      fetchData();
    } catch (err: any) {
      alert('Error saving walk-in: ' + err.message);
    }
  };

  const selectedDateBookings = bookings.filter(b => {
    if (!selectedDate) return false;
    const start = new Date(b.check_in);
    const end = new Date(b.check_out);
    return selectedDate >= start && selectedDate < end;
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '123456') {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-deep-sea flex items-center justify-center px-6">
        <div className="bg-white p-10 rounded-sm shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-coral/10 text-coral rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-deep-sea">Resort Admin</h1>
            <p className="text-text-muted text-sm mt-2">Please sign in to access the dashboard.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Username</label>
              <input 
                required
                type="text"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full p-4 bg-mist/30 border border-shell rounded-sm focus:outline-none focus:border-coral transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
              <input 
                required
                type="password"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full p-4 bg-mist/30 border border-shell rounded-sm focus:outline-none focus:border-coral transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            {loginError && (
              <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-sm border border-red-100">
                Invalid credentials. Please try again.
              </p>
            )}
            
            <button 
              type="submit"
              className="w-full bg-deep-sea hover:bg-deep-sea/90 text-white py-4 rounded-sm font-bold uppercase tracking-widest transition-all shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-deep-sea flex items-center gap-3">
              Resort Management <span className="bg-coral/10 text-coral text-xs uppercase px-2 py-1 rounded">Admin</span>
            </h1>
            <p className="text-text-secondary">Overview of your property's bookings and occupancy.</p>
            <div className="mt-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
              âœ”ï¸Ž Database Connected: {bookings.length} Bookings Loaded
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('walk-in')}
            className="bg-coral hover:bg-coral-light text-white px-6 py-2.5 rounded-sm font-semibold flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" /> New Walk-in
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-shell mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === 'calendar' ? 'border-coral text-coral bg-white' : 'border-transparent text-text-muted hover:text-deep-sea'}`}
          >
            Occupancy Calendar
          </button>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === 'bookings' ? 'border-coral text-coral bg-white' : 'border-transparent text-text-muted hover:text-deep-sea'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('walk-in')}
            className={`px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all border-b-2 ${activeTab === 'walk-in' ? 'border-coral text-coral bg-white' : 'border-transparent text-text-muted hover:text-deep-sea'}`}
          >
            Frontdesk Form
          </button>
        </div>

        {activeTab === 'calendar' && (
          <div className="grid grid-cols-1 gap-8">
            <style>{`
              .booked-day {
                background-color: rgba(255, 127, 80, 0.15) !important;
                border: 2px solid rgba(255, 127, 80, 0.4) !important;
                font-weight: 900 !important;
                color: #1B3A4B !important;
                border-radius: 4px !important;
                position: relative;
              }
              .booked-day::after {
                content: '';
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 6px;
                height: 6px;
                background-color: #FF7F50;
                border-radius: 50%;
              }
              .rdp-day_selected {
                background-color: #FF7F50 !important;
                color: white !important;
              }
            `}</style>
            <div className="bg-white p-8 rounded-sm shadow-sm border border-shell">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-deep-sea flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-coral" /> Master Occupancy Calendar
                </h2>
                <div className="flex flex-wrap gap-4">
                  {rooms.slice(0, 5).map(r => (
                    <div key={r.id} className="flex items-center gap-2 text-xs font-semibold">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRoomColor(r.id) }}></div>
                      {r.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center scale-110 md:scale-125 py-12">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  numberOfMonths={2}
                  className="bg-white"
                  modifiers={{
                    booked: (date) => bookings.some(b => {
                      const dStr = format(date, 'yyyy-MM-dd');
                      const checkIn = b.check_in.split('T')[0];
                      const checkOut = b.check_out.split('T')[0];
                      return dStr >= checkIn && dStr < checkOut;
                    })
                  }}
                  modifiersClassNames={{
                    booked: 'booked-day'
                  }}
                />
              </div>
            </div>

            {/* Occupancy Stats Summary */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-shell">
              <h2 className="text-xl font-bold text-deep-sea mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-coral" /> Occupancy Summary for {selectedDate ? format(selectedDate, 'MMM d') : ''}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(roomInventory).map(([name, total]) => {
                  const occupied = selectedDateBookings.filter(b => rooms.find(r => r.id === b.room_id)?.name === name).length;
                  const percent = (occupied / total) * 100;
                  
                  return (
                    <div key={name} className="p-4 bg-mist/10 rounded-sm border border-shell">
                      <div className="text-[10px] font-bold uppercase text-text-muted mb-1">{name}</div>
                      <div className="flex items-end justify-between mb-2">
                        <div className="text-2xl font-bold text-deep-sea">{occupied} / {total}</div>
                        <div className="text-[10px] font-bold text-text-muted">BOOKED</div>
                      </div>
                      <div className="w-full bg-shell h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-500" 
                          style={{ 
                            width: `${percent}%`, 
                            backgroundColor: percent > 80 ? '#FF7F50' : '#1B3A4B' 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Summary */}
            <div className="bg-white p-8 rounded-sm shadow-sm border border-shell">
              <h2 className="text-xl font-bold text-deep-sea mb-6 flex items-center justify-between">
                <span>Bookings for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}</span>
                <span className="text-sm font-normal text-text-muted">{selectedDateBookings.length} Guests arriving/staying</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedDateBookings.length > 0 ? (
                  selectedDateBookings.map(b => (
                    <div key={b.id} className="p-5 bg-mist/20 rounded-sm border-l-4" style={{ borderLeftColor: getRoomColor(b.room_id) }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-deep-sea">{rooms.find(r => r.id === b.room_id)?.name || 'Room'}</div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-shell">
                          {b.booked_via}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-text-primary">{b.guest_first_name} {b.guest_last_name}</div>
                      <div className="text-xs text-text-secondary mt-1 italic">Stay: {format(new Date(b.check_in), 'MMM d')} - {format(new Date(b.check_out), 'MMM d')}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-mist/10 rounded-sm border-2 border-dashed border-shell">
                    <p className="text-text-muted">No one is staying in the resort on this specific date.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-sm shadow-sm border border-shell overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-mist/50 border-b border-shell">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Ref / Date</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Guest</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Room</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Stay</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-shell">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-mist/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-deep-sea">{booking.booking_ref}</div>
                        <div className="text-[10px] text-text-muted">{format(new Date(booking.check_in), 'MMM d')} - {format(new Date(booking.check_out), 'MMM d')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-deep-sea">{booking.guest_first_name} {booking.guest_last_name}</div>
                        <div className="text-xs text-text-muted">{booking.guest_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium">{rooms.find(r => r.id === booking.room_id)?.name || 'Loading...'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">{booking.num_adults} Adults</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-deep-sea">₱{booking.total_amount_php.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {booking.status}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full w-fit ${booking.payment_status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="py-20 text-center text-text-muted">No bookings found in the database.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'walk-in' && (
          <div className="bg-white rounded-sm shadow-sm border border-shell max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-bold text-deep-sea mb-8 flex items-center gap-2">
              <Plus className="w-6 h-6 text-coral" /> New Walk-in Booking
            </h2>
            <form onSubmit={handleWalkInSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">First Name</label>
                  <input required value={walkIn.firstName} onChange={e => setWalkIn({...walkIn, firstName: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Last Name</label>
                  <input required value={walkIn.lastName} onChange={e => setWalkIn({...walkIn, lastName: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Email</label>
                  <input required type="email" value={walkIn.email} onChange={e => setWalkIn({...walkIn, email: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Phone</label>
                  <input required value={walkIn.phone} onChange={e => setWalkIn({...walkIn, phone: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-muted">Room Selection</label>
                <select required value={walkIn.roomId} onChange={e => setWalkIn({...walkIn, roomId: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm">
                  <option value="">Select a Room</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} - ₱{r.base_price_php}/night</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Check-in</label>
                  <input required type="date" value={walkIn.checkIn} onChange={e => setWalkIn({...walkIn, checkIn: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Check-out</label>
                  <input required type="date" value={walkIn.checkOut} onChange={e => setWalkIn({...walkIn, checkOut: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Nights</label>
                  <input readOnly type="number" value={walkIn.nights} className="w-full p-3 bg-mist/40 border border-shell rounded-sm cursor-not-allowed" title="Calculated automatically from dates" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted">Payment Status</label>
                  <select value={walkIn.paymentStatus} onChange={e => setWalkIn({...walkIn, paymentStatus: e.target.value})} className="w-full p-3 bg-mist/20 border border-shell rounded-sm">
                    <option value="fully_paid">Paid (Cash/Gcash)</option>
                    <option value="unpaid">Pending Payment</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-deep-sea hover:bg-deep-sea/90 text-white py-4 rounded-sm font-bold uppercase tracking-widest transition-all shadow-lg mt-4">
                Create Walk-in Booking
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
