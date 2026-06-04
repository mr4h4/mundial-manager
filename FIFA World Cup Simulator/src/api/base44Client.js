/**
 * Mock Base44 Client for Local Development
 * Provides stub functions to allow the app to run locally without Base44 backend
 */

const STORAGE_KEY = 'local_user';
const TOKEN_KEY = 'local_token';

// Mock user data for local development
const mockUser = {
  id: 'local-user-1',
  email: 'test@example.com',
  name: 'Local User',
  role: 'user'
};

export const base44 = {
  auth: {
    /**
     * Get current authenticated user
     * In local development, always returns mock user
     */
    me: async () => {
      const userData = localStorage.getItem(STORAGE_KEY);
      
      // In local development, always return user (auto-authenticated)
      if (userData) {
        return JSON.parse(userData);
      }
      
      // Auto-authenticate with mock user on first load
      localStorage.setItem(TOKEN_KEY, 'mock-token-' + Date.now());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
      
      return mockUser;
    },

    /**
     * Login with email and password
     * Stores mock token and user data
     */
    loginViaEmailPassword: async (email, password) => {
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock successful login
      const token = 'mock-token-' + Date.now();
      const user = { ...mockUser, email };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return { access_token: token, user };
    },

    /**
     * Register new user
     * Stores user data and returns confirmation
     */
    register: async ({ email, password }) => {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const token = 'mock-token-' + Date.now();
      const user = { ...mockUser, email };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return { success: true, message: 'User registered successfully' };
    },

    /**
     * Verify OTP
     * Mock verification - always succeeds
     */
    verifyOtp: async ({ email, otpCode }) => {
      if (!otpCode) {
        throw new Error('OTP code is required');
      }

      const token = 'mock-token-' + Date.now();
      return { access_token: token, verified: true };
    },

    /**
     * Resend OTP
     * Mock function - returns success
     */
    resendOtp: async (email) => {
      return { success: true, message: 'OTP sent to ' + email };
    },

    /**
     * Reset password request
     * Mock function - returns success
     */
    resetPasswordRequest: async (email) => {
      return { success: true, message: 'Reset email sent to ' + email };
    },

    /**
     * Reset password with token
     * Mock function - always succeeds
     */
    resetPassword: async ({ resetToken, newPassword }) => {
      if (!resetToken || !newPassword) {
        throw new Error('Reset token and new password are required');
      }

      const token = 'mock-token-' + Date.now();
      localStorage.setItem(TOKEN_KEY, token);
      
      return { success: true, message: 'Password reset successfully' };
    },

    /**
     * Set authentication token
     */
    setToken: (token) => {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }
    },

    /**
     * Logout
     * Clears stored data and optionally redirects
     */
    logout: (redirectUrl) => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(STORAGE_KEY);
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    /**
     * Redirect to login page
     */
    redirectToLogin: (fromUrl) => {
      const loginUrl = '/login';
      if (fromUrl) {
        window.location.href = loginUrl + '?from=' + encodeURIComponent(fromUrl);
      } else {
        window.location.href = loginUrl;
      }
    },

    /**
     * Login with provider (Google, etc.)
     * Mock function - redirects to home or provided URL
     */
    loginWithProvider: (provider, redirectUrl) => {
      console.log(`Mock login with ${provider}`);
      const token = 'mock-token-' + Date.now();
      const user = { ...mockUser, provider };
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    }
  }
};

export default base44;
