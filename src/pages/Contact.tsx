import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-deep-sea">
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl mb-4 tracking-wide">
            Get in Touch
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            We're here to help you plan your perfect escape
          </p>
        </div>
      </section>

      {/* Section 2: Contact Information & Form */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Side: Contact Details */}
          <div>
            <h2 className="text-3xl font-bold text-deep-sea mb-8">Contact Information</h2>
            <p className="text-text-secondary mb-12 leading-relaxed">
              Whether you have a question about our villas, dining options, or need assistance planning your itinerary, our team is ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-deep-sea mb-1">Address</h3>
                  <p className="text-text-secondary">Uyayi Sa Baybay Resort<br />El Nido, Palawan<br />Philippines 5313</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-deep-sea mb-1">Phone</h3>
                  <p className="text-text-secondary">+63 917 123 4567<br />+63 2 8123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-deep-sea mb-1">Email</h3>
                  <p className="text-text-secondary">reservations@uyayisabaybay.com<br />info@uyayisabaybay.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-mist rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-bold text-deep-sea mb-1">Front Desk Hours</h3>
                  <p className="text-text-secondary">24 Hours / 7 Days a Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-shell">
            <h2 className="text-2xl font-bold text-deep-sea mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Full Name</label>
                <input type="text" id="name" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="Jane Doe" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Email Address</label>
                <input type="email" id="email" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="jane@example.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Subject</label>
                <input type="text" id="subject" className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-deep-sea uppercase tracking-wider">Message</label>
                <textarea id="message" rows={5} className="w-full border border-shell rounded-sm px-4 py-3 focus:outline-none focus:border-coral transition-colors bg-sand/30 resize-none" placeholder="Your message here..."></textarea>
              </div>

              <button type="submit" className="w-full bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2">
                <Send className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}

