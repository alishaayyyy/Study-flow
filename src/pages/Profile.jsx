import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
// Icons ke liye (agar installed nahi hai to: npm install lucide-react)
import { ArrowLeft, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, resetPassword } = useAuth();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    try {
      await resetPassword(user.email);
      setMessage('A reset link has been sent to your email.');
      setIsError(false);
    } catch (err) {
      setMessage('Error sending reset link.');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-rose-500/30">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-8 px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>

        <div className="relative">
          {/* Background Glow Effect */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
            
            <div className="flex flex-col items-center mb-12">
              {/* Avatar with Ring Effect */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative w-28 h-28 rounded-full bg-[#111] border-2 border-white/10 flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-400 shadow-2xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="text-3xl font-bold mt-6 tracking-tight">Account Settings</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your private information</p>
            </div>

            <div className="space-y-4">
              {/* Email Section */}
              <div className="group bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-[1.5rem] border border-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold block mb-0.5">Email Address</label>
                    <p className="text-gray-200 font-medium">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="group bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-[1.5rem] border border-white/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold block mb-0.5">Password</label>
                      <p className="text-gray-200 font-medium tracking-widest">••••••••••••</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePasswordReset}
                    className="px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl border border-rose-500/20 transition-all active:scale-95"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Enhanced Feedback Message */}
              {message && (
                <div className={`mt-6 flex items-center gap-3 p-4 rounded-2xl border animate-in fade-in zoom-in duration-300 ${
                  isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;