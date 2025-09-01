// useApi.ts
import { useAuth } from '@clerk/clerk-react';
import { fetchWithTimeout, getApiUrl, parseJsonSafe } from './api';

type PaymentResponse = {
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: string;
      category: string;
      plan: string;
      amount: number;
      endDate: string;
      status: string;
    };
    mpesa: unknown;
  };
}


export const useApi = () => {
  const { getToken } = useAuth();
  
  const initiatePayment = async (planName: string, category: string, phone: string): Promise<PaymentResponse> => {
    try {
      const API_URL = getApiUrl();
      const token = await getToken(); // Get token from Clerk
      
      console.log('=== INITIATING PAYMENT ===');
      console.log('Plan:', planName, 'Category:', category, 'Phone:', phone);
      console.log('Auth token present:', !!token);
      
      const res = await fetchWithTimeout(`${API_URL}/api/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ plan: planName, category, phone })
      });
      
      if (!res.ok) {
        const errorData = await parseJsonSafe<{ error: string; message?: string }>(res);
        const errorMessage = errorData.error || errorData.message || `Payment failed (${res.status})`;
        throw new Error(errorMessage);
      }
      
      return await parseJsonSafe<PaymentResponse>(res);
    } catch (err: unknown) {
      console.error('Payment initiation error:', err);
      const error = err as { message?: string; name?: string } | undefined;
      const friendlyMessage = error?.name === 'AbortError'
        ? 'Payment request timed out'
        : (error?.message || 'Unknown error during payment');
      throw new Error(friendlyMessage);
    }
  };

  const checkPaymentStatus = async (subscriptionId: string): Promise<{ status: string, receiptNumber: string | null }> => {
    try {
      const API_URL = getApiUrl();
      const token = await getToken(); // Get token from Clerk
      
      console.log('Checking payment status for subscription:', subscriptionId);
      
      const res = await fetchWithTimeout(`${API_URL}/api/subscriptions/${subscriptionId}/status`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      
      if (!res.ok) {
        throw new Error(`Status check failed (${res.status})`);
      }
      
      const data = await parseJsonSafe<{ success: boolean, data: { status: string, receiptNumber: string | null } }>(res);
      return data.data;
    } catch (err: unknown) {
      console.error('Payment status check error:', err);
      const error = err as { message?: string; name?: string } | undefined;
      const friendlyMessage = error?.name === 'AbortError'
        ? 'Status check timed out'
        : (error?.message || 'Unknown error during status check');
      throw new Error(friendlyMessage);
    }
  };
  
  return { initiatePayment, checkPaymentStatus };
};