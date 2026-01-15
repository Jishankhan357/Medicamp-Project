import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout } from './redux/authSlice';
import { fetchPatients, addPatient, deletePatient } from './redux/patientSlice';
import { Mic, MicOff, Save, Activity, Trash2, HeartPulse, Moon, Sun, LogOut } from 'lucide-react';
import Login from './Login';
import Inventory from './Inventory'; // Import Inventory

function App() {
  const dispatch = useDispatch();
  
  // Get Auth State
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Get Patient State
  const { list: patients, loading } = useSelector((state) => state.patients);

  const [formData, setFormData] = useState({ name: '', age: '', symptoms: '' });
  const [isListening, setIsListening] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // --- NEW: TAB STATE ---
  const [activeTab, setActiveTab] = useState('patients'); 

  // --- DARK MODE ---
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- FETCH ON LOAD ---
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPatients());
    }
  }, [isAuthenticated, dispatch]);

  // --- HANDLERS ---
  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deletePatient(id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(addPatient(formData));
    alert("Request Sent to Redux!");
    setFormData({ name: '', age: '', symptoms: '' });
  };

  // --- VOICE ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    setFormData({ ...formData, symptoms: transcript });
  };

  const toggleListening = () => {
    if (isListening) { recognition.stop(); setIsListening(false); }
    else { recognition.start(); setIsListening(true); }
  };

  if (!isAuthenticated) {
    return <Login onLogin={(token) => dispatch(loginSuccess(token))} />;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <HeartPulse size={40} className="text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medicamp System</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Redux Enterprise Edition</p>
          </div>
        </div>
        <div className="flex gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700">
                {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-600" />}
            </button>
            <button onClick={() => dispatch(logout())} className="flex items-center gap-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors">
                <LogOut size={18} /> Logout
            </button>
        </div>
      </header>

      {/* TAB NAVIGATION BUTTONS */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex">
          <button 
            onClick={() => setActiveTab('patients')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'patients' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Patient Records
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${activeTab === 'inventory' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
          >
            Smart Inventory
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDERING (The Switch) */}
      {activeTab === 'patients' ? (
        // --- PATIENT VIEW ---
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Patient Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400 border-b dark:border-slate-700 pb-2">New Patient Entry</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none" required /></div>
              <div><label className="block text-sm font-medium mb-1">Age</label><input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none" required /></div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Symptoms</label>
                <textarea value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} className="w-full p-3 h-32 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 outline-none resize-none" required />
                <button type="button" onClick={toggleListening} className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 dark:bg-slate-600 text-blue-600'}`}>{isListening ? <MicOff size={24} /> : <Mic size={24} />}</button>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2"><Save size={20} /> Save Record</button>
            </form>
          </div>

          {/* Patient List */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-2">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Recent Patients</h2>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-bold px-3 py-1 rounded-full">{patients.length} Total</span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading && <p className="text-center text-blue-500">Syncing with database...</p>}
              {!loading && patients.map((p) => (
                <div key={p._id} className="group bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-blue-200 dark:hover:border-blue-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-start">
                  <div>
                    <div className="flex items-baseline gap-2"><h3 className="text-lg font-bold text-slate-800 dark:text-white">{p.name}</h3><span className="text-sm text-slate-500 dark:text-slate-400">({p.age} yrs)</span></div>
                    <div className="mt-2 text-slate-600 dark:text-slate-300 flex items-start gap-2"><Activity size={16} className="mt-1 text-blue-500 shrink-0" /> <p className="text-sm leading-relaxed">{p.symptoms}</p></div>
                  </div>
                  <button onClick={() => handleDelete(p._id)} className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-slate-600 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // --- INVENTORY VIEW ---
        <Inventory />
      )}
      
    </div>
  );
}

export default App;