import { Check, Users, MapPin, Calendar, Download, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FALLBACK_EVENT_TYPES = [
  {
    title: 'Weddings',
    description: 'Exchange vows with the Sulu Sea as your backdrop. From intimate barefoot ceremonies on the beach to grand celebrations in our pavilion, our dedicated wedding specialists ensure every detail is flawless.',
    features: ['Dedicated Wedding Planner', 'Customizable Menus', 'Bridal Suite Included', 'Floral & Decor Services'],
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Corporate Retreats',
    description: 'Inspire your team in a setting that blends productivity with paradise. We offer state-of-the-art meeting facilities, team-building activities, and curated dining experiences.',
    features: ['High-Speed Wi-Fi', 'AV Equipment Setup', 'Team Building Activities', 'Coffee Breaks & Catering'],
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop',
  },
  {
    title: 'Private Celebrations',
    description: 'Whether it\'s a milestone birthday, an anniversary, or a family reunion, we create bespoke events tailored to your vision, ensuring memories that will last a lifetime.',
    features: ['Private Dining Venues', 'Custom Entertainment', 'Themed Decor', 'Photography Services'],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop',
  }
];

const FALLBACK_VENUES = [
  {
    name: 'The Grand Pavilion',
    type: 'Indoor',
    capacity: '200 Guests',
    bestFor: 'Receptions, Galas, Conferences',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop'
  },
  {
    name: 'Sunset Beachfront',
    type: 'Outdoor',
    capacity: '150 Guests',
    bestFor: 'Wedding Ceremonies, Beach Parties',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop'
  },
  {
    name: 'The Garden Terrace',
    type: 'Outdoor',
    capacity: '80 Guests',
    bestFor: 'Intimate Dinners, Cocktail Receptions',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1974&auto=format&fit=crop'
  }
];

export default function Events() {
  const [eventTypes, setEventTypes] = useState<any[]>(FALLBACK_EVENT_TYPES);
  const [venues, setVenues] = useState<any[]>(FALLBACK_VENUES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, venuesRes] = await Promise.all([
          supabase.from('event_types').select('*'),
          supabase.from('venues').select('*')
        ]);

        if (eventsRes.data && eventsRes.data.length > 0) {
          setEventTypes(eventsRes.data.map(e => ({
            ...e,
            features: e.features || []
          })));
        }
        
        if (venuesRes.data && venuesRes.data.length > 0) {
          setVenues(venuesRes.data.map(v => ({
            ...v,
            bestFor: v.best_for || v.bestFor
          })));
        }
      } catch (err) {
        console.error('Error fetching events data:', err);
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
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop" 
          alt="Wedding setup" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Celebrate in Paradise
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            Weddings, retreats, and gatherings crafted to perfection
          </p>
        </div>
      </section>

      {/* Section 2: Event Types */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="space-y-24">
            {eventTypes.map((event, index) => (
              <div 
                key={event.title || event.name} 
                className={cn(
                  "flex flex-col lg:flex-row gap-12 items-center",
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                )}
              >
                <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] overflow-hidden rounded-sm shadow-lg">
                  <img 
                    src={event.image || event.image_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop'} 
                    alt={event.title || event.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-6">{event.title || event.name}</h2>
                  <p className="text-text-secondary text-lg leading-relaxed mb-8">
                    {event.description}
                  </p>
                  
                  {event.features && event.features.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {event.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-2 text-text-secondary">
                          <Check className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-deep-sea hover:bg-deep-sea/90 text-white px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors text-center">
                      Request Proposal
                    </button>
                    <button className="border border-deep-sea text-deep-sea hover:bg-mist px-8 py-3 rounded-sm font-semibold uppercase tracking-wider text-sm transition-colors text-center flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Brochure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Venues */}
      <section className="py-24 bg-mist px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Our Venues</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Discover the perfect setting for your next event, from grand indoor spaces to breathtaking outdoor locations.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {venues.map((venue) => (
                <div key={venue.name} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-shell">
                  <div className="h-64 overflow-hidden">
                    <img src={venue.image || venue.image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2098&auto=format&fit=crop'} alt={venue.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-deep-sea mb-4">{venue.name}</h3>
                    <div className="flex flex-col gap-2 text-sm text-text-secondary mb-6">
                      <div className="flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4 text-coral" />
                        <span>{venue.type}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-coral" />
                        <span>Up to {venue.capacity}</span>
                      </div>
                    </div>
                    {venue.bestFor && (
                      <p className="text-sm font-medium text-deep-sea uppercase tracking-wider border-t border-shell pt-4">
                        Best for: {venue.bestFor}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 5: Inquiry Form */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-lg border border-shell">
          <div className="text-center mb-10">
            <h2 className="font-editorial italic text-4xl text-deep-sea mb-4">Start Planning</h2>
            <p className="text-text-secondary">Fill out the form below and our events team will get back to you within 24 hours.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Full Name</label>
                <input type="text" id="name" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Email Address</label>
                <input type="email" id="email" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="jane@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="eventType" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Event Type</label>
                <select id="eventType" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30 appearance-none">
                  <option value="">Select an event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Retreat</option>
                  <option value="celebration">Private Celebration</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="guests" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Estimated Guests</label>
                <input type="number" id="guests" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="e.g. 50" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Preferred Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input type="date" id="date" className="w-full border border-shell rounded-sm pl-12 pr-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Tell us about your event</label>
              <textarea id="message" rows={4} className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30 resize-none" placeholder="Share your vision with us..."></textarea>
            </div>

            <button type="submit" className="w-full bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" /> Send Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

