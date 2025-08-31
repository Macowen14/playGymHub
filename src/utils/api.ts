export type Plan = {
  _id?: string;
  category: 'gaming' | 'gym' | 'movies' | 'sports' | string;
  plan: string;
  amount: number;
  durationHours: number | null;
  durationDays: number | null;
  description: string;
}

export type Subscription = {
  _id: string;
  userId: string;
  category: string;
  plan: string;
  amount: number;
  status: 'pending' | 'active' | 'expired' | 'failed' | 'cancelled';
  startDate: string | null;
  endDate: string;
  receiptNumber: string | null;
  paidAmount: number | null;
  phoneNumber: string | null;
  mpesaCheckoutId: string | null;
  mpesaTransactionDate: string | null;
  failedReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PaymentResponse = {
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

// Get API URL with fallback and validation
function getApiUrl(): string {
  const apiUrl =  'https://gamehub-i770.onrender.com';
  console.log('Using API URL:', apiUrl);
  return apiUrl;
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    console.log('Making request to:', input);
    console.log('Request headers:', init.headers);
    
    const response = await fetch(input, { 
      ...init, 
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': '*',
        ...init.headers,
      }
    });
    
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  } finally {
    clearTimeout(id);
  }
}

async function parseJsonSafe<T>(res: Response): Promise<T> {
  const text = await res.text();
  console.log('Raw response text:', text);
  
  if (!text) {
    throw new Error('Empty response from server');
  }
  
  try {
    const parsed = JSON.parse(text) as T;
    console.log('Parsed JSON:', parsed);
    return parsed;
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Response text that failed to parse:', text);
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
}

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const API_URL = getApiUrl();
    const endpoint = `${API_URL}/api/subscriptions/plans`;
    
    console.log('=== FETCHING PLANS ===');
    console.log('Full URL:', endpoint);
    console.log('Timestamp:', new Date().toISOString());
    
    // Test basic connectivity first
    console.log('Testing API connectivity...');
    
    const res = await fetchWithTimeout(endpoint, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Disable cache completely
      cache: 'no-store'
    }, 30000); // Increased timeout to 30 seconds
    
    console.log('Response status:', res.status, res.statusText);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      
      try {
        const errorText = await res.text();
        console.log('Error response body:', errorText);
        
        // Try to parse error as JSON
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If not JSON, use the text directly
          errorMessage = errorText || errorMessage;
        }
      } catch (readError) {
        console.error('Could not read error response:', readError);
      }
      
      throw new Error(errorMessage);
    }
    
    const plans = await parseJsonSafe<Plan[]>(res);
    
    console.log('Plans fetched successfully:', {
      count: plans.length,
      plans: plans
    });
    
    // Validate the response structure
    if (!Array.isArray(plans)) {
      console.error('Expected array but got:', typeof plans, plans);
      throw new Error('Invalid response format: expected array of plans');
    }
    
    // Validate each plan has required fields
    const validPlans = plans.filter((plan, index) => {
      const isValid = plan && typeof plan.plan === 'string' && typeof plan.amount === 'number';
      if (!isValid) {
        console.warn(`Invalid plan at index ${index}:`, plan);
      }
      return isValid;
    });
    
    if (validPlans.length !== plans.length) {
      console.warn(`Filtered out ${plans.length - validPlans.length} invalid plans`);
    }
    
    return validPlans;
    
  } catch (err: unknown) {
    console.error('=== FETCH PLANS ERROR ===');
    console.error('Error details:', err);
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
    
    const error = err as { message?: string; name?: string } | undefined;
    
    let friendlyMessage = 'Failed to load subscription plans';
    
    if (error?.name === 'AbortError') {
      friendlyMessage = 'Request timed out - the server is taking too long to respond';
    } else if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      friendlyMessage = 'Network error - please check your internet connection';
    } else if (error?.message) {
      friendlyMessage = error.message;
    }
    
    console.error('Throwing friendly error:', friendlyMessage);
    throw new Error(friendlyMessage);
  }
}

export async function initiatePayment(planName: string, category: string, phone: string): Promise<PaymentResponse> {
  try {
    const API_URL = getApiUrl();
    const token = localStorage.getItem('authToken');
    
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
}

export async function checkPaymentStatus(subscriptionId: string): Promise<{ status: string, receiptNumber: string | null }> {
  try {
    const API_URL = getApiUrl();
    const token = localStorage.getItem('authToken');
    
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
}

// Debug function to test API connectivity
export async function testApiConnection(): Promise<{ 
  success: boolean; 
  message: string; 
  details?: {
    status?: number;
    headers?: Record<string, string>;
    error?: unknown;
  }
}> {
  try {
    const API_URL = getApiUrl();
    console.log('Testing API connection to:', API_URL);
    
    // Test basic connectivity
    const response = await fetch(API_URL, { 
      method: 'GET',
      mode: 'cors',
      credentials: 'omit'
    });
    
    return {
      success: true,
      message: `API is reachable (Status: ${response.status})`,
      details: {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      }
    };
  } catch (error) {
    console.error('API connection test failed:', error);
    return {
      success: false,
      message: `API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        error
      }
    };
  }
}