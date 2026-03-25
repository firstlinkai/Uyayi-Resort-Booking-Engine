import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, Users, Home as HomeIcon, Star, Instagram, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [dining, setDining] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, activitiesRes, diningRes] = await Promise.all([
          supabase.from('rooms').select('*').order('display_order', { ascending: true }).limit(3),
          supabase.from('activities').select('*').eq('is_featured', true).limit(4),
          supabase.from('dining_options').select('*').limit(3)
        ]);

        if (roomsRes.data) setRooms(roomsRes.data);
        if (activitiesRes.data) setExperiences(activitiesRes.data);
        if (diningRes.data) setDining(diningRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="bg-sand">
      {/* Section 1: Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(27,58,75,0.25) 0%, rgba(27,58,75,0.45) 100%)' }}
        />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-tropical-island-at-sunset-and-clear-blue-water-4334-large.mp4" type="video/mp4" />
        </video>
        
        <div className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-editorial italic text-5xl md:text-7xl lg:text-8xl mb-6 tracking-wide leading-tight">
              Where Palawan's Shore<br />Becomes Your Home
            </h1>
            <p className="font-sans font-light text-lg md:text-xl mb-12 tracking-wider uppercase opacity-90">
              Discover barefoot luxury at the edge of the Sulu Sea
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/about" className="bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto text-sm">
                Explore the Resort
              </Link>
              <Link to="/stay" className="border border-white hover:bg-white/10 text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto text-sm">
                Book Your Stay
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 opacity-70" />
        </motion.div>
      </section>
      
      {/* Section 2: Quick Booking Bar */}
      <div className="relative z-30 max-w-6xl mx-auto px-6 -mt-16 hidden md:block">
        <div className="bg-white shadow-xl rounded-sm p-4 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-mist rounded-sm cursor-pointer transition-colors border-r border-shell">
            <Calendar className="w-5 h-5 text-coral" />
            <div className="flex flex-col">
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Check-in</span>
              <span className="text-text-primary font-medium">Add date</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-mist rounded-sm cursor-pointer transition-colors border-r border-shell">
            <Calendar className="w-5 h-5 text-coral" />
            <div className="flex flex-col">
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Check-out</span>
              <span className="text-text-primary font-medium">Add date</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-mist rounded-sm cursor-pointer transition-colors border-r border-shell">
            <Users className="w-5 h-5 text-coral" />
            <div className="flex flex-col">
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Guests</span>
              <span className="text-text-primary font-medium">{guests} Guests</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 hover:bg-mist rounded-sm cursor-pointer transition-colors">
            <HomeIcon className="w-5 h-5 text-coral" />
            <div className="flex flex-col">
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Room Type</span>
              <span className="text-text-primary font-medium">All Rooms</span>
            </div>
          </div>
          <button className="bg-deep-sea hover:bg-deep-sea/90 text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors text-sm whitespace-nowrap">
            Check Availability
          </button>
        </div>
      </div>

      {/* Mobile Quick Booking */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
        <button className="w-full bg-coral text-white py-4 rounded-sm font-semibold uppercase tracking-wider text-sm">
          Start Booking
        </button>
      </div>

      {/* Section 3: Property Introduction */}
      <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop" 
              alt="Resort aerial view" 
              className="w-full h-[600px] object-cover rounded-sm shadow-lg"
            />
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-shell -z-10 rounded-sm hidden md:block" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-sea mb-8 leading-tight">
              A Sanctuary Shaped by Sea and Sky
            </h2>
            <div className="space-y-6 text-text-secondary text-lg leading-relaxed mb-12">
              <p>
                Nestled on the pristine shores of Palawan, Uyayi Sa Baybay translates to "Home by the Shore." Here, the rhythm of the waves dictates the pace of the day, and barefoot luxury is not just a concept, but a way of life.
              </p>
              <p>
                Our resort was born from a deep respect for the island's natural beauty and a desire to share authentic Filipino hospitality—what we call <em>malasakit</em>. Every villa, every meal, and every interaction is crafted to make you feel deeply cared for.
              </p>
              <p>
                Leave your shoes at the door, disconnect from the noise, and reconnect with what truly matters.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-shell pt-8">
              <div>
                <div className="text-4xl font-bold text-deep-sea mb-2">14</div>
                <div className="font-editorial italic text-text-secondary text-lg">Villas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deep-sea mb-2">3</div>
                <div className="font-editorial italic text-text-secondary text-lg">Restaurants</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deep-sea mb-2">2018</div>
                <div className="font-editorial italic text-text-secondary text-lg">Established</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-deep-sea mb-2 flex items-center">5<Star className="w-6 h-6 ml-1 fill-coral text-coral" /></div>
                <div className="font-editorial italic text-text-secondary text-lg">Rated</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Room Highlights */}
      <section className="py-24 bg-mist px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Find Your Perfect Haven</h2>
              <p className="text-text-secondary text-lg">Designed for privacy, comfort, and uninterrupted views.</p>
            </div>
            <Link to="/stay" className="hidden md:flex items-center gap-2 text-coral font-semibold uppercase tracking-wider text-sm hover:text-coral-light transition-colors">
              View All Accommodations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
              </div>
            ) : rooms.length > 0 ? (
              rooms.map((room) => (
                <div key={room.id} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={room.thumbnail_url || room.image || {
                        'Beachfront Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Beachfront%20Villa.jpeg',
                        'Ocean Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Ocean%20Suite.jpeg',
                        'Garden Deluxe Room': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Garden%20Deluxe%20Room.jpeg',
                        'Family Villa': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Family%20Villa.jpeg',
                        'Pool Suite': 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/rooms/Pool%20Suite.jpeg'
                      }[(room as any).name || room.name] || 'https://images.unsplash.com/photo-1582719478250-c89ca4dc85b?q=80&w=2070&auto=format&fit=crop'} 
                      alt={room.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider text-deep-sea rounded-sm">
                      {room.view || 'Ocean View'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-deep-sea mb-2">{room.name}</h3>
                    <p className="text-text-secondary mb-6 line-clamp-2">{room.description}</p>
                    <div className="flex items-center justify-between border-t border-shell pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-muted uppercase tracking-wider">From</span>
                        <span className="font-semibold text-deep-sea">₱{(room.base_price_php || room.price)?.toLocaleString()} <span className="text-sm font-normal text-text-secondary">/ night</span></span>
                      </div>
                      <Link to={`/stay/${room.id}`} className="text-coral font-semibold uppercase tracking-wider text-sm hover:text-coral-light transition-colors">
                        View Room
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-text-secondary">
                <p>No rooms available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/stay" className="inline-block border border-deep-sea text-deep-sea px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm">
              View All Accommodations
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Signature Experiences */}
      <section className="bg-deep-sea py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Signature Experiences</h2>
            <p className="text-mist/80 text-lg max-w-2xl mx-auto">Curated moments that capture the essence of Palawan, designed to create memories that last a lifetime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
              </div>
            ) : experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={exp.id || index} className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors z-10" />
                  <img 
                    src={exp.thumbnail_url || exp.image || exp.image_url || {
                      'Island Hopping Tour': 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=2070&auto=format&fit=crop',
                      'Scuba Diving': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
                      'Stand-Up Paddleboarding': 'https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=2070&auto=format&fit=crop',
                      'Kayaking': 'https://images.unsplash.com/photo-1500353391642-d81befe4867c?q=80&w=1974&auto=format&fit=crop',
                      'Sunset Cruise': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2072&auto=format&fit=crop',
                      'Snorkeling': 'https://images.unsplash.com/photo-1544551763-46bc013bb70d5?q=80&w=2070&auto=format&fit=crop'
                    }[(exp as any).name || exp.name] || 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1974&auto=format&fit=crop'} 
                    alt={exp.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
                    <h3 className="font-editorial text-3xl mb-2">{exp.name}</h3>
                    <p className="text-mist/90 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 line-clamp-2">{exp.description}</p>
                    <Link to="/activities" className="text-coral-light font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-mist/80">
                <p>No experiences available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 6: Dining Teaser */}
      <section>
        <div className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" 
            alt="Restaurant ambiance" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center text-white px-6">
            <h2 className="font-editorial italic text-5xl md:text-6xl mb-4">Where Every Meal is a Memory</h2>
            <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto opacity-90">Celebrating the rich culinary heritage of the Philippines with global refinement.</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-30 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
              </div>
            ) : dining.length > 0 ? (
              dining.map((d, index) => (
                <div key={d.id || index} className={`bg-white p-8 rounded-sm shadow-xl text-center flex flex-col h-full ${index === 1 ? 'mt-0 md:mt-12' : ''}`}>
                  <h3 className="text-2xl font-bold text-deep-sea mb-2">{d.name}</h3>
                  <p className="text-coral font-medium text-sm uppercase tracking-wider mb-4">{d.cuisine}</p>
                  <p className="text-text-secondary mb-8 flex-grow line-clamp-3">{d.description}</p>
                  <Link to="/dining" className="border border-deep-sea text-deep-sea hover:bg-deep-sea hover:text-white px-6 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors">
                    Reserve a Table
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-white">
                <p>No dining options available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 7: Guest Testimonials */}
      <section className="py-24 bg-shell px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-16">What Our Guests Say</h2>
          
          <div className="relative">
            {/* Simple static testimonial for now, would be a carousel in full implementation */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-coral text-coral" />
                ))}
              </div>
              <blockquote className="font-editorial italic text-2xl md:text-4xl text-deep-sea leading-relaxed mb-8">
                "An absolute dream. From the moment we arrived, we were treated like family. The villa was stunning, the food incredible, but it was the genuine warmth of the staff that we'll remember forever."
              </blockquote>
              <div className="flex flex-col items-center">
                <span className="font-bold text-deep-sea text-lg">Maria & James</span>
                <span className="text-text-secondary">London, UK â€¢ October 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: Newsletter Signup */}
      <section className="py-24 bg-sand px-6 border-t border-shell">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Stay in the Story</h2>
          <p className="text-text-secondary text-lg mb-8">Be the first to hear about exclusive offers, events, and island secrets.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 bg-white border border-shell rounded-sm focus:outline-none focus:border-coral transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

