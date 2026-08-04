import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-coral" />
        </div>
        <h1 className="font-editorial text-3xl text-deep-sea mb-4">Booking Confirmed!</h1>
        <p className="text-text-secondary mb-8">
          Thank you for choosing Uyayi Resort. We've received your payment and your reservation is now confirmed. 
          A confirmation email has been sent to your inbox.
        </p>
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-coral hover:bg-coral-light text-white py-3 rounded-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Return Home
          </Link>
          <Link 
            to="/stay" 
            className="flex items-center justify-center gap-2 text-text-muted hover:text-coral transition-colors font-medium text-sm"
          >
            Explore more accommodations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
