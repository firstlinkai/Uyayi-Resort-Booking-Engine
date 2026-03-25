import { Leaf, Droplets, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const FALLBACK_TEAM = [
  {
    name: 'Maria Santos',
    role: 'General Manager',
    bio: 'With over 20 years in luxury hospitality, Maria ensures every guest experiences the true warmth of Filipino hospitality.',
    photo_url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/team/teamg1.jpeg'
  },
  {
    name: 'Chef Antonio Reyes',
    role: 'Executive Chef',
    bio: 'Chef Antonio brings his passion for local ingredients and international techniques to create unforgettable culinary journeys.',
    photo_url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/team/teamb1.jpeg'
  },
  {
    name: 'Elena Cruz',
    role: 'Head Concierge',
    bio: 'A Palawan native, Elena knows every hidden lagoon and secret beach, curating the perfect adventures for our guests.',
    photo_url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/team/teamg2.jpeg'
  },
  {
    name: 'Miguel Rivera',
    role: 'Sustainability Coordinator',
    bio: 'Miguel leads our environmental initiatives, ensuring our resort remains a leader in sustainable luxury.',
    photo_url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/team/teamb2.jpeg'
  },
  {
    name: 'Sofia Lim',
    role: 'Guest Experience Manager',
    bio: 'Sofia ensures every detail of your stay reflects our commitment to excellence and authentic Filipino care.',
    photo_url: 'https://tukezchosvgcplqjswns.supabase.co/storage/v1/object/public/team/teamg3.jpeg'
  }
];

export default function About() {
  const [team, setTeam] = useState<any[]>(FALLBACK_TEAM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase.from('team_members').select('*');
        if (data && data.length > 0) {
          setTeam(data);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[65vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080&auto=format&fit=crop" 
          alt="Resort Aerial" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl lg:text-7xl mb-4 tracking-wide">
            Our Story
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            A sanctuary born from the love of Palawan
          </p>
        </div>
      </section>

      {/* Section 2: The Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-6">A Harmonious Blend of Luxury and Nature</h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              Uyayi Sa Baybay, which translates to "Lullaby by the Shore," was conceived with a singular vision: to create a luxurious retreat that honors and preserves the pristine beauty of El Nido, Palawan.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Our architecture draws inspiration from traditional Filipino design, utilizing sustainable local materials to ensure our villas blend seamlessly into the lush tropical landscape. Every element of the resort has been thoughtfully designed to provide an unparalleled guest experience while minimizing our environmental footprint.
            </p>
          </div>
          <div className="w-full lg:w-1/2 h-[500px] rounded-sm overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074&auto=format&fit=crop" 
              alt="Villa Interior" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Sustainability */}
      <section className="py-24 bg-mist px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Our Commitment to the Earth</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Sustainability is not just a buzzword for us; it is the foundation of our operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Leaf className="w-8 h-8 text-coral" />
              </div>
              <h3 className="text-xl font-bold text-deep-sea mb-4">Renewable Energy</h3>
              <p className="text-text-secondary">A significant portion of our energy is generated through our on-site solar farm, reducing our reliance on the local grid.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Droplets className="w-8 h-8 text-coral" />
              </div>
              <h3 className="text-xl font-bold text-deep-sea mb-4">Water Conservation</h3>
              <p className="text-text-secondary">We utilize an advanced rainwater harvesting system and a state-of-the-art desalination plant to ensure responsible water usage.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Users className="w-8 h-8 text-coral" />
              </div>
              <h3 className="text-xl font-bold text-deep-sea mb-4">Community Support</h3>
              <p className="text-text-secondary">We actively support the local community by sourcing ingredients from nearby farmers and providing employment opportunities for residents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: The Team */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-sea mb-4">Meet the Team</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">The passionate individuals dedicated to making your stay unforgettable.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-sm overflow-hidden shadow-sm border border-shell text-center pb-8">
                <div className="h-80 overflow-hidden mb-6">
                  <img src={member.photo_url || member.image || member.image_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop'} alt={member.name} className="w-full h-full object-cover object-[center_5%] hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="px-6">
                  <h3 className="text-2xl font-bold text-deep-sea mb-1">{member.name}</h3>
                  <p className="text-coral font-medium uppercase tracking-wider text-sm mb-4">{member.title || member.role}</p>
                  <p className="text-text-secondary">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

