import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function BookingCancelled() {
  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-16 h-16 text-coral" />
        </div>
        <h1 className="font-editorial text-3xl text-deep-sea mb-4">Payment Cancelled</h1>
        <p className="text-text-secondary mb-8">
          The payment process was cancelled. No charges were made to your card. 
          If you experienced any issues, please feel free to contact us.
        </p>
        <div className="space-y-4">
          <Link 
            to="/stay" 
            className="block w-full bg-coral hover:bg-coral-light text-white py-3 rounded-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Back to Accommodations
          </Link>
          <Link 
            to="/contact" 
            className="flex items-center justify-center gap-2 text-text-muted hover:text-coral transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
