// src/store/authStore.ts
import { create } from 'zustand';
import { User } from '../types'; // Import your User type

// IMPORTANT: Replace with your actual backend URL for login.
// For local development, change this to your local PHP server URL (e.g., 'http://localhost:8000/api/admin_login.php').
// For production, ensure this is a secure HTTPS URL!
const ADMIN_LOGIN_API_URL = 'https://localhost/api/admin_login.php'; // <--- VERIFY/CHANGE THIS URL!
// Example for Google login endpoint, adjust as per your backend
const GOOGLE_LOGIN_API_URL = 'http://localhost:8000/api/google_login.php'; // <--- VERIFY/CHANGE THIS URL!

// Define the credentials expected by the login function
interface AdminCredentials {
    username: string; // This will be mapped to 'identifier' for the backend
    password: string;
}

// Define the state structure for your authentication store
interface AuthState {
    isAuthenticated: boolean;
    isAdmin: boolean; // Flag to indicate if the logged-in user is an admin
    token: string | null;
    user: User | null; // User details
    isLoading: boolean; // Renamed from 'loading' for consistency with original AdminLogin.tsx
    error: string | null;

    login: (credentials: AdminCredentials) => Promise<boolean>;
    loginWithGoogle: (idToken: string) => Promise<boolean>; // New action for Google login
    logout: () => void;
    initializeAuth: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isAdmin: false,
    token: null,
    user: null,
    isLoading: false, // Renamed from 'loading'
    error: null,

    clearError: () => set({ error: null }),

    // --- Standard Username/Password Login ---
    login: async (credentials: AdminCredentials) => {
        set({ isLoading: true, error: null }); // Set loading, clear previous errors

        try {
            // Prepare the payload to match your backend's expected 'identifier' field
            const payload = {
                identifier: credentials.username,
                password: credentials.password
            };

            console.log('Sending standard login request to:', ADMIN_LOGIN_API_URL, 'with payload:', payload);

            const response = await fetch(ADMIN_LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Crucial for PHP's file_get_contents('php://input')
                },
                body: JSON.stringify(payload), // Send the prepared payload as JSON
            });

            // --- DEBUGGING CONSOLE LOGS ---
            console.log('AuthStore: Raw response object:', response);
            console.log('AuthStore: Response status:', response.status);
            console.log('AuthStore: Response ok (200-299 status):', response.ok);
            // --- END DEBUGGING CONSOLE LOGS ---

            let responseData: any;
            let rawResponseText = '';

            try {
                rawResponseText = await response.text();
                responseData = JSON.parse(rawResponseText);
                console.log('AuthStore: Parsed JSON data:', responseData);

            } catch (jsonOrTextError: any) {
                console.error('AuthStore: Error processing response body (not valid JSON or cannot read text):', jsonOrTextError);
                console.error('AuthStore: Raw response text (for debugging):', rawResponseText);
                set({
                    isLoading: false,
                    error: `Received non-JSON or unreadable response from server. Raw: ${rawResponseText?.substring(0, 100) || 'No response body'}...`
                });
                return false;
            }

            // Now, proceed with checking the response status and success flag from parsed JSON
            if (response.ok && responseData.success) {
                const { token, user } = responseData;

                // Determine admin status based on the user's role
                const isAdminUser = user.role === 'superadmin' || user.role === 'admin'; // Adjust roles as needed

                set({
                    token: token,
                    user: user,
                    isAuthenticated: true,
                    isAdmin: isAdminUser,
                    isLoading: false,
                    error: null,
                });
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));

                console.log('AuthStore: Standard login successful!', user);
                return true;
            } else {
                const errorMessage = responseData.message || 'Login failed with an unknown error. Please check credentials.';
                set({
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                    user: null,
                    token: null,
                    error: errorMessage
                });
                console.error('AuthStore: Standard login failed. Message:', errorMessage);
                return false;
            }
        } catch (err: any) {
            console.error('AuthStore: Login API call failed (network/unhandled error):', err);
            const errorMessage = err.message || 'An unexpected network error occurred. Please check your internet connection or server status.';
            set({
                isLoading: false,
                isAuthenticated: false,
                isAdmin: false,
                user: null,
                token: null,
                error: errorMessage
            });
            return false;
        }
    },

    // --- Google OAuth Login ---
    loginWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null });

        try {
            console.log('Sending Google login request to:', GOOGLE_LOGIN_API_URL, 'with ID Token:', idToken.substring(0, 20) + '...'); // Log a snippet of the token

            const response = await fetch(GOOGLE_LOGIN_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }), // Send the Google ID token
            });

            console.log('AuthStore: Google login raw response object:', response);
            console.log('AuthStore: Google login response status:', response.status);

            let responseData: any;
            let rawResponseText = '';

            try {
                rawResponseText = await response.text();
                responseData = JSON.parse(rawResponseText);
                console.log('AuthStore: Google login parsed JSON data:', responseData);
            } catch (jsonOrTextError: any) {
                console.error('AuthStore: Error processing Google login response body (not valid JSON or cannot read text):', jsonOrTextError);
                console.error('AuthStore: Raw Google login response text (for debugging):', rawResponseText);
                set({
                    isLoading: false,
                    error: `Received non-JSON or unreadable response from Google login server. Raw: ${rawResponseText?.substring(0, 100) || 'No response body'}...`
                });
                return false;
            }

            if (response.ok && responseData.success) {
                const { token, user } = responseData;
                const isAdminUser = user.role === 'superadmin' || user.role === 'admin';

                set({
                    token: token,
                    user: user,
                    isAuthenticated: true,
                    isAdmin: isAdminUser,
                    isLoading: false,
                    error: null,
                });
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
                console.log('AuthStore: Google login successful!', user);
                return true;
            } else {
                const errorMessage = responseData.message || 'Google login failed with an unknown error. Please try again.';
                set({
                    isLoading: false,
                    isAuthenticated: false,
                    isAdmin: false,
                    user: null,
                    token: null,
                    error: errorMessage
                });
                console.error('AuthStore: Google login failed. Message:', errorMessage);
                return false;
            }
        } catch (err: any) {
            console.error('AuthStore: Google login API call failed (network/unhandled error):', err);
            const errorMessage = err.message || 'An unexpected network error occurred during Google login.';
            set({
                isLoading: false,
                isAuthenticated: false,
                isAdmin: false,
                user: null,
                token: null,
                error: errorMessage
            });
            return false;
        }
    },

    // --- Logout ---
    logout: () => {
        set({
            isAuthenticated: false,
            isAdmin: false,
            token: null,
            user: null,
            isLoading: false,
            error: null,
        });
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        console.log('AuthStore: User logged out. Local storage cleared.');
    },

    // --- Initialize Auth on App Load ---
    initializeAuth: () => {
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');

        if (storedToken && storedUser) {
            try {
                const user: User = JSON.parse(storedUser);
                const isAdminUser = user.role === 'superadmin' || user.role === 'admin';

                set({
                    isAuthenticated: true,
                    isAdmin: isAdminUser,
                    token: storedToken,
                    user: user,
                    isLoading: false,
                    error: null,
                });
                console.log('AuthStore: Initialized from localStorage. User:', user.username);
            } catch (e) {
                console.error("AuthStore: Failed to parse stored user data from localStorage:", e);
                set({ isAuthenticated: false, isAdmin: false, token: null, user: null, isLoading: false, error: null });
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        } else {
            console.log('AuthStore: No existing auth data in localStorage.');
            set({ isAuthenticated: false, isAdmin: false, token: null, user: null, isLoading: false, error: null });
        }
    },
}));