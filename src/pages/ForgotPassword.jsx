import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions.');
    } catch (err) {
      setError('Failed to reset password. Please check if the email is correct.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Password Reset</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Enter your email to receive a password reset link.</p>
        
        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-500/50">{error}</p>}
        {message && <p className="bg-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-4 border border-green-500/50">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
          >
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-rose-400 hover:underline text-sm font-medium">
            Back to Login
          </Link>
        </div>

        <p className="text-center text-gray-400 mt-4 text-xs">
          Need an account? <Link to="/signup" className="text-rose-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;