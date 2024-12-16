'use client';
import { useState } from 'react';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import Notification from './Notification';
import '../styles/styles-login.css';
import logo from '../../public/assets/logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            setNotification({ message: data.message, type: 'success', visible: true });
            router.push('/admin/dashboard'); 
        } catch (err) {
            setNotification({ message: err.message, type: 'error', visible: true });
        } finally {
            setLoading(false);
        }
    };

    const closeNotification = () => {
        setNotification({ ...notification, visible: false });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className={`bg-white p-8 rounded-lg shadow-xl w-96 form-container`}>
            <div className="text-center">
                <Image src={logo} alt="Logo" className="w-72 h-54 mx-auto pointer-events-none"  />
                <p className="text-gray-500">"Shop smart, live better."</p>
            </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="email">Email</label>
                        <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-300 focus-within:border-blue-500 transition">
                            <FaEnvelope className="text-gray-500 mr-2" />
                            <input
                                className="w-full bg-transparent outline-none text-gray-700"
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="password">Password</label>
                        <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-300 focus-within:border-blue-500 transition">
                            <FaLock className="text-gray-500 mr-2" />
                            <input
                                className="w-full bg-transparent outline-none text-gray-700"
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 ```javascript
                        transition duration-300 focus:outline-none"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <FaSpinner className="text-white mr-2 animate-spin" />
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>
                </form>
            </div>

            {/* Notification Component */}
            {notification.visible && (
                <Notification
                    message={notification.message}
                    type={notification.type === 'success' ? 'success' : 'error'}
                    onClose={closeNotification}
                />
            )}
        </div>
    );
}