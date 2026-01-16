import React, { useState } from 'react';
import axios from 'axios';
import { Lock, User, ShieldCheck } from 'lucide-react';

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? 'register' : 'login';
    
    // ---------------------------------------------------------
    // CHANGE: Point to Cloud Backend
    // ---------------------------------------------------------
    const BASE_URL = "https://medicamp-backend.onrender.com";

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/${endpoint}`, {
        username,
        password
      });

      if (isRegistering) {
        alert("Registration Successful! Now please Login.");
        setIsRegistering(false); // Switch back to Login mode
      } else {
        // Login Successful -> Send token to App.js
        onLogin(res.data.token);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Server might be waking up (wait 30s).");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-200 dark:border-slate-700">
        
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <ShieldCheck size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">
          {isRegistering ? "Create Admin ID" : "Doctor Login"}
        </h2>
        <p className="text-center text-slate-500 mb-6 text-sm">
          Medicamp Secure Access
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" placeholder="Username" 
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="password" placeholder="Password" 
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-md"
          >
            {isRegistering ? "Register Now" : "Login Securely"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
          {isRegistering ? "Already have an ID?" : "New to Medicamp?"}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 dark:text-blue-400 font-bold ml-1 hover:underline"
          >
            {isRegistering ? "Login here" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;