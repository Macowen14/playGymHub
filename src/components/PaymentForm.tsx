import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { initiatePayment, checkPaymentStatus } from '../utils/api';
import { AlertCircle, CheckCircle, Clock, Smartphone } from 'lucide-react';

export default function PaymentForm() {
  const [searchParams] = useSearchParams();
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ 
    type: 'idle' | 'success' | 'error' | 'processing', 
    message: string,
    details?: {
      status?: string;
      receiptNumber?: string | null;
      subscription?: {
        id: string;
        category: string;
        plan: string;
        amount: number;
        endDate: string;
        status: string;
      };
    }
  }>({ type: 'idle', message: '' });
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  const planName = searchParams.get('plan');
  const category = searchParams.get('category');
  const amount = searchParams.get('amount');

  // Validate required parameters
  const hasRequiredParams = planName && category && amount;

  useEffect(() => {
    if (!hasRequiredParams) {
      setStatus({ 
        type: 'error', 
        message: 'Missing required payment information. Please select a plan first.' 
      });
    }
  }, [hasRequiredParams]);

  useEffect(() => {
    // Payment status polling
    if (subscriptionId && status.type === 'processing') {
      const maxPolls = 36; // 36 * 5 seconds = 3 minutes max
      
      if (pollCount >= maxPolls) {
        setStatus({ 
          type: 'error', 
          message: 'Payment verification timed out. Please check your M-Pesa messages or try again.' 
        });
        setIsProcessing(false);
        return;
      }

      const interval = setInterval(async () => {
        try {
          console.log(`Polling payment status (attempt ${pollCount + 1}/${maxPolls})`);
          const statusResult = await checkPaymentStatus(subscriptionId);
          
          if (statusResult.status === 'active') {
            setStatus({ 
              type: 'success', 
              message: `Payment confirmed successfully! ${statusResult.receiptNumber ? `Receipt: ${statusResult.receiptNumber}` : ''}`,
              details: statusResult
            });
            setIsProcessing(false);
            clearInterval(interval);
          } else if (statusResult.status === 'failed') {
            setStatus({ 
              type: 'error', 
              message: 'Payment failed or was cancelled. Please try again.',
              details: statusResult
            });
            setIsProcessing(false);
            clearInterval(interval);
          }
          
          setPollCount(prev => prev + 1);
        } catch (error) {
          console.error('Error checking payment status:', error);
          setPollCount(prev => prev + 1);
          // Don't stop polling on temporary errors, but limit retries
        }
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [subscriptionId, status.type, pollCount]);

  const formatPhoneNumber = (phone: string): string => {
    // Remove any spaces, dashes, or special characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned; // Already in international format
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1); // Convert from 07XX to 2547XX
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned; // Add country code
    }
    
    return cleaned;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const formatted = formatPhoneNumber(phone);
    // Kenyan phone numbers are 12 digits with 254 prefix
    return /^254[71]\d{8}$/.test(formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    
    // Clear any previous phone validation errors
    if (status.type === 'error' && status.message.toLowerCase().includes('phone')) {
      setStatus({ type: 'idle', message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasRequiredParams) {
      setStatus({ type: 'error', message: 'Missing plan information. Please go back and select a plan.' });
      return;
    }

    if (!phone.trim()) {
      setStatus({ type: 'error', message: 'Phone number is required' });
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setStatus({ 
        type: 'error', 
        message: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678)' 
      });
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);
    
    setIsProcessing(true);
    setPollCount(0);
    setStatus({ type: 'processing', message: 'Initiating payment...' });

    try {
      console.log('Initiating payment with:', { planName, category, phone: formattedPhone });
      
      const result = await initiatePayment(planName!, category!, formattedPhone);
      
      if (result.success) {
        setSubscriptionId(result.data.subscription.id);
        setStatus({ 
          type: 'processing', 
          message: 'STK Push sent to your phone! Please check your device and enter your M-Pesa PIN. Waiting for confirmation...',
          details: result.data
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: result.message || 'Payment initiation failed' 
        });
        setIsProcessing(false);
      }
    } catch (error: unknown) {
      console.error('Payment initiation error:', error);
      const err = error as { message?: string } | undefined;
      setStatus({ 
        type: 'error', 
        message: err?.message || 'Payment initiation failed. Please try again.' 
      });
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusStyles = () => {
    switch (status.type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return '';
    }
  };

  if (!hasRequiredParams) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-card">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Invalid Payment Link</h2>
          <p className="text-muted-foreground mb-4">
            The payment link is missing required information. Please go back and select a subscription plan.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-card">
      <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
      
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-1">
          <p><strong>Plan:</strong> {planName}</p>
          <p><strong>Category:</strong> <span className="capitalize">{category}</span></p>
          <p><strong>Amount:</strong> <span className="text-lg font-bold text-green-600">KES {Number(amount).toLocaleString()}</span></p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            M-Pesa Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Smartphone className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="0712345678 or 254712345678"
              className="w-full pl-10 pr-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              disabled={isProcessing}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your M-Pesa registered phone number (Safaricom or Airtel)
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing || !phone.trim() || !validatePhoneNumber(phone)}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {isProcessing ? (
            <span className="inline-flex items-center space-x-2">
              <Clock className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </span>
          ) : (
            `Pay KES ${Number(amount).toLocaleString()}`
          )}
        </button>
      </form>

      {status.type !== 'idle' && (
        <div className={`mt-4 p-4 rounded-md border ${getStatusStyles()}`}>
          <div className="flex items-start space-x-3">
            {getStatusIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">{status.message}</p>
              
              {status.type === 'processing' && subscriptionId && (
                <div className="mt-2">
                  <p className="text-xs opacity-75">
                    Checking payment status... ({pollCount}/36)
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                      style={{ width: `${(pollCount / 36) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {status.details && process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer opacity-75">Debug Info</summary>
                  <pre className="text-xs mt-1 p-2 bg-black/10 rounded overflow-auto">
                    {JSON.stringify(status.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">How to complete payment:</h4>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click the "Pay" button to initiate payment</li>
          <li>Check your phone for an STK Push notification</li>
          <li>Enter your M-Pesa PIN when prompted</li>
          <li>Wait for automatic confirmation</li>
        </ol>
        
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> If you don't receive the STK Push, check that your phone has network coverage and try again. The payment will timeout after 3 minutes.
          </p>
        </div>
      </div>

      {status.type === 'success' && (
        <div className="mt-4">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}