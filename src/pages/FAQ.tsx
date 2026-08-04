import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const FALLBACK_FAQS = [
  {
    category: 'Reservations & Policies',
    questions: [
      {
        q: 'What is the check-in and check-out time?',
        a: 'Check-in time is at 3:00 PM, and check-out time is at 12:00 NN. Early check-in and late check-out are subject to availability and may incur additional charges.'
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made 14 days or more prior to arrival will receive a full refund. Cancellations made within 14 days of arrival will be charged 50% of the total booking amount. No-shows will be charged the full amount.'
      },
      {
        q: 'Are pets allowed at the resort?',
        a: 'While we love animals, we currently do not allow pets on the resort premises to ensure the comfort and safety of all our guests and the local wildlife.'
      }
    ]
  },
  {
    category: 'Getting Here',
    questions: [
      {
        q: 'How do I get to Uyayi Sa Baybay from the airport?',
        a: 'We offer complimentary roundtrip airport transfers from Lio Airport (ENI) for all guests. The scenic drive takes approximately 45 minutes. Please provide your flight details at least 48 hours before arrival.'
      },
      {
        q: 'Can I arrange my own transportation?',
        a: 'Yes, you may arrange your own transportation. However, we highly recommend using our transfer service as some parts of the road leading to the resort can be challenging for standard vehicles.'
      }
    ]
  },
  {
    category: 'Resort Amenities & Services',
    questions: [
      {
        q: 'Is Wi-Fi available throughout the resort?',
        a: 'Yes, complimentary high-speed Wi-Fi is available in all villas, suites, and public areas, including the restaurants and main pool.'
      },
      {
        q: 'Do you have a spa?',
        a: 'Yes, the Hilot Spa offers a range of traditional Filipino massages and holistic treatments. We recommend booking your treatments in advance.'
      },
      {
        q: 'Are there activities for children?',
        a: 'Yes, we offer a Kids\' Club with supervised activities, a dedicated children\'s pool, and family-friendly excursions. Babysitting services are also available upon request.'
      }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>('0-0');
  const [faqs, setFaqs] = useState<any[]>(FALLBACK_FAQS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const { data, error } = await supabase.from('faqs').select('*');
        
        if (data && data.length > 0) {
          // Group FAQs by category
          const groupedFaqs = data.reduce((acc: any, curr: any) => {
            const category = curr.category || 'General';
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push({
              q: curr.question || curr.q,
              a: curr.answer || curr.a
            });
            return acc;
          }, {});

          const formattedFaqs = Object.keys(groupedFaqs).map(category => ({
            category,
            questions: groupedFaqs[category]
          }));

          setFaqs(formattedFaqs);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFaqs();
  }, []);

  const toggleAccordion = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-sand min-h-screen">
      {/* Section 1: Page Hero */}
      <section className="relative h-[40vh] flex items-center justify-center bg-deep-sea">
        <div className="relative z-20 text-center text-white px-6 mt-16">
          <h1 className="font-editorial italic text-5xl md:text-6xl mb-4 tracking-wide">
            Frequently Asked Questions
          </h1>
          <p className="font-sans font-light text-lg md:text-xl tracking-wider uppercase opacity-90">
            Everything you need to know before your stay
          </p>
        </div>
      </section>

      {/* Section 2: FAQ Accordion */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {faqs.map((section, sectionIndex) => (
              <div key={section.category}>
                <h2 className="text-2xl font-bold text-deep-sea mb-8 border-b border-shell pb-4">{section.category}</h2>
                <div className="space-y-4">
                  {section.questions.map((faq: any, qIndex: number) => {
                    const index = `${sectionIndex}-${qIndex}`;
                    const isOpen = openIndex === index;
                    
                    return (
                      <div 
                        key={index} 
                        className="bg-white border border-shell rounded-sm overflow-hidden transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                        >
                          <span className="font-semibold text-deep-sea pr-8">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-coral shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-coral shrink-0" />
                          )}
                        </button>
                        
                        <div 
                          className={cn(
                            "px-6 overflow-hidden transition-all duration-300 ease-in-out",
                            isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          <p className="text-text-secondary leading-relaxed">{faq.a}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-24 text-center bg-mist p-12 rounded-sm border border-shell">
          <h3 className="text-2xl font-bold text-deep-sea mb-4">Still have questions?</h3>
          <p className="text-text-secondary mb-8">If you couldn't find the answer you were looking for, our team is here to help.</p>
          <a href="/contact" className="inline-block bg-coral hover:bg-coral-light text-white px-8 py-4 rounded-sm font-semibold uppercase tracking-wider transition-colors">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}

