import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff, Save, Activity, Trash2, HeartPulse } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({ name: '', age: '', symptoms: '' });
  const [patients, setPatients] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // --- 1. FETCH DATA ---
  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // --- 2. DELETE DATA ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/patients/${id}`);
        fetchPatients();
      } catch (err) {
        alert("Error deleting patient");
      }
    }
  };

  // --- 3. VOICE LOGIC ---
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
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // --- 4. SAVE LOGIC ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/patients/add', formData);
      alert("Patient Saved Successfully!");
      setFormData({ name: '', age: '', symptoms: '' });
      fetchPatients();
    } catch (err) {
      alert("Error saving data. Check Backend!");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <HeartPulse size={40} className="text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Medicamp System</h1>
        </div>
        <p className="text-slate-500">Efficient Voice-Powered Patient Entry</p>
      </header>

      {/* MAIN GRID LAYOUT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">New Patient Entry</h2>
          
          <form onSubmit={handleSave} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Rahul Sharma" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
              <input 
                type="number" 
                placeholder="e.g. 45" 
                value={formData.age} 
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-slate-600 mb-1">Symptoms (Voice Enabled)</label>
              <textarea 
                placeholder="Tap microphone and speak..." 
                value={formData.symptoms} 
                onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                className="w-full p-3 h-32 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none"
                required
              />
              <button 
                type="button" 
                onClick={toggleListening}
                className={`absolute right-3 bottom-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Save size={20} /> Save Record
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-semibold text-slate-700">Recent Patients</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
              {patients.length} Total
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {patients.length === 0 ? (
              <p className="text-center text-slate-400 py-10">No patients added yet.</p>
            ) : (
              patients.map((p) => (
                <div key={p._id} className="group bg-slate-50 hover:bg-white border border-transparent hover:border-blue-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-start">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-lg font-bold text-slate-800">{p.name}</h3>
                      <span className="text-sm text-slate-500">({p.age} yrs)</span>
                    </div>
                    <div className="mt-2 text-slate-600 flex items-start gap-2">
                      <Activity size={16} className="mt-1 text-blue-500 shrink-0" /> 
                      <p className="text-sm leading-relaxed">{p.symptoms}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Patient"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;