// src/pages/AdminLogin.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; // Corrected path to your Zustand store
import Input from '../../components/ui/Input';     // Assuming these components exist
import Button from '../../components/ui/Button';   // Assuming these components exist

// Import GoogleOAuthProvider and GoogleLogin components
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Base64 encoded demo images (keep as is)
const base64Logo1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAPFBMVEX////b29vNzc3Hx8fDw8PAwMDh4eHe3t7c3t7S0tLU1NTk5OTm5ubl5eXQ0NDX19fY2NjZ2dn+/v7/rXjRAAAAS0lEQVR42u3BAQEAAAzCoPiTP1oOAPwWlqiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJjXABZmAAD01eGkAAAAAElFTkSuQmCC';
const base64Logo2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAPFBMVEX////a2trNzc3Hx8fDw8PAwMDh4eHe3t7c3t7U1NTk5OTm5ubl5eXQ0NDX19fY2NjZ2dnZ2dn+/v7/rXjRAAAAS0lEQVR42u3BAQEAAAzCoPiTP1oOAPwWlqiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJjXABZmAAD01eGkAAAAAElFTkSuQmCC';
const base64Logo3 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAPFBMVEX////b29vNzc3Hx8fDw8PAwMDh4eHe3t7c3t7S0tLU1NTk5OTm5ubl5eXQ0NDX19fY2NjZ2dn+/v7/rXjRAAAAS0lEQVR42u3BAQEAAAzCoPiTP1oOAPwWlqiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJjXABZmAAD01eGkAAAAAElFTkSuQmCC';
const base64Logo4 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAPFBMVEX////a2trNzc3Hx8fDw8PAwMDh4eHe3t7c3t7U1NTk5OTm5ubl5eXQ0NDX19fY2NjZ2dnZ2dn+/v7/rXjRAAAAS0lEQVR42u3BAQEAAAzCoPiTP1oOAPwWlqiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJjXABZmAAD01eGkAAAAAElFTkSuQmCC';
const base64Logo5 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAAPFBMVEX////b29vNzc3Hx8fDw8PAwMDh4eHe3t7c3t7S0tLU1NTk5OTm5ubl5eXQ0NDX19fY2NjZ2dn+/v7/rXjRAAAAS0lEQVR42u3BAQEAAAzCoPiTP1oOAPwWlqiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJjXABZmAAD01eGkAAAAAElFTkSuQmCC';

// Corrected import path for college logo
import collegeLogo from '../../assets/Header logo.png'; // Placeholder: **Replace this with your actual college logo!**

const clientLogos = [
    base64Logo1, base64Logo2, base64Logo3, base64Logo4, base64Logo5,
];

const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Destructure actions and state from your Zustand store
    const { login, loginWithGoogle, isAuthenticated, isLoading, error, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // IMPORTANT: Replace with your actual Google Client ID
    // Get this from your Google Cloud Console.
    // For local development, you might put it directly here, but for production, use an environment variable.
    // e.g., process.env.REACT_APP_GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // <--- REPLACE THIS WITH YOUR CLIENT ID

    // Get the intended destination from location state, or default to dashboard
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

    // Effect to redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            console.log('Authenticated, redirecting to:', from);
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Effect to clear error when component mounts or input changes
    // This provides a cleaner UX
    useEffect(() => {
        clearError(); // Clear any previous errors on mount
    }, [clearError]); // Depend on clearError to prevent re-runs if it's stable

    // Handle traditional username/password submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return; // Prevent multiple submissions if already loading

        clearError(); // Clear existing error before new attempt

        const success = await login({ username, password });
        // Redirection is handled by the useEffect above if 'success' is true and isAuthenticated updates
        if (!success) {
            console.log('Login attempt failed, error message should be displayed.');
        }
    };

    // Handle Google Login Success
    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log('Google login success! ID Token received.');
        if (credentialResponse.credential) {
            clearError(); // Clear any existing errors
            const success = await loginWithGoogle(credentialResponse.credential);
            if (!success) {
                console.log('Google login backend processing failed.');
            }
        } else {
            console.error('Google login success callback but no credential received.');
            clearError();
            useAuthStore.setState({ error: 'Google login failed: No credential received.' });
        }
    };

    // Handle Google Login Failure
    const handleGoogleError = () => {
        console.error('Google Login Failed');
        clearError();
        useAuthStore.setState({ error: 'Google login failed. Please try again or use username/password.' });
    };

    return (
        // Wrap your component with GoogleOAuthProvider
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="flex w-screen h-screen overflow-hidden">
                {/* Left Section: Trusted Partners Text and Logo Carousel - 60% width and full height */}
                <div className="hidden lg:flex lg:w-[60%] flex-col items-center justify-center relative h-full bg-gradient-to-br from-blue-500 to-indigo-700 p-8">
                    {/* Top Logo Carousel Placeholder */}
                    <div className="w-full relative z-10 p-4 overflow-hidden">
                        <div className="flex justify-center items-center gap-6 flex-wrap">
                            {clientLogos.slice(0, Math.ceil(clientLogos.length / 2)).map((logo, index) => (
                                <img
                                    key={`logo-top-${index}`}
                                    src={logo}
                                    alt={`Partner Logo ${index + 1}`}
                                    className="h-16 max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Big "Our Trusted Partners" Text */}
                    <div className="relative z-10 flex-grow flex items-center justify-center text-white text-center p-4">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight">
                            Our Trusted Partners
                        </h2>
                    </div>

                    {/* Bottom Logo Carousel Placeholder */}
                    <div className="w-full relative z-10 p-4 overflow-hidden">
                        <div className="flex justify-center items-center gap-6 flex-wrap">
                            {clientLogos.slice(Math.ceil(clientLogos.length / 2)).map((logo, index) => (
                                <img
                                    key={`logo-bottom-${index}`}
                                    src={logo}
                                    alt={`Partner Logo ${index + Math.ceil(clientLogos.length / 2) + 1}`}
                                    className="h-16 max-w-[120px] object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section: Login Form - 40% width and full height */}
                <div className="w-full lg:w-[40%] p-8 md:p-12 flex flex-col justify-center bg-white h-full">
                    <div className="text-center mb-6">
                        {/* College Logo */}
                        <div className="flex justify-center mb-4">
                            <img src={collegeLogo} alt="College Logo" className="h-24 object-contain" />
                        </div>

                        <h1 className="font-serif text-2xl font-bold text-gray-800">Admin Login</h1>
                        <p className="text-gray-600 mt-1">Sign in to access your dashboard</p>
                    </div>

                    {/* Google Login Button */}
                    <div className="mb-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            text="continue_with"
                            shape="rectangular"
                            size="large"
                            theme="outline"
                            // Custom button might be needed if GoogleLogin doesn't offer enough styling flexibility
                        />
                    </div>

                    {/* OR Separator */}
                    <div className="relative flex items-center justify-center py-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); clearError(); }} // Clear error on input change
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearError(); }} // Clear error on input change
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>

                        <div className="text-center mt-6">
                            <Link
                                to="/"
                                className="text-primary-600 hover:text-primary-700 text-sm transition-colors duration-200"
                            >
                                Return to College Website
                            </Link>
                        </div>
                        {/* Designed and developed by */}
                        <div className="text-center text-gray-500 text-xs mt-4">
                            Designed and developed by Pixel Clients Technologies
                        </div>
                    </form>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default AdminLogin;