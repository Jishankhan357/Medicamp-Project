import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mic, MicOff, Save, Activity } from 'lucide-react';

function App() {
  const [formData, setFormData] = useState({ name: '', age: '', symptoms: '' });
  const [patients, setPatients] = useState([]); // Store list of patients
  const [isListening, setIsListening] = useState(false);

  // --- 1. FETCH DATA ON LOAD ---
  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  useEffect(() => {
    fetchPatients(); // Run this when page opens
  }, []);

  // --- 2. VOICE LOGIC ---
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

  // --- 3. SAVE LOGIC ---
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/patients/add', formData);
      alert("Patient Saved Successfully!");
      setFormData({ name: '', age: '', symptoms: '' }); // Clear form
      fetchPatients(); // Refresh the list instantly!
    } catch (err) {
      alert("Error saving data. Check Backend!");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ color: '#2c3e50', textAlign: 'center' }}>🏥 Medicamp System</h2>
      
      {/* FORM SECTION */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <input 
          type="text" placeholder="Patient Name" 
          value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={inputStyle} required
        />
        <input 
          type="number" placeholder="Age" 
          value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
          style={inputStyle} required
        />
        
        <div style={{ position: 'relative' }}>
          <textarea 
            placeholder="Symptoms (Type or Use Mic)" 
            value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
            style={{ ...inputStyle, height: '80px' }} required
          />
          <button 
            type="button" onClick={toggleListening}
            style={{ position: 'absolute', right: '10px', bottom: '10px', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            {isListening ? <MicOff color="red" /> : <Mic color="blue" />}
          </button>
        </div>

        <button type="submit" style={btnStyle}>
          <Save size={18} /> Save Patient Record
        </button>
      </form>

      {/* LIST SECTION */}
      <h3 style={{ marginTop: '30px', color: '#34495e' }}>📋 Recent Patients</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {patients.map((p) => (
          <div key={p._id} style={cardStyle}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{p.name} <span style={{ fontSize: '14px', color: '#7f8c8d' }}>({p.age} yrs)</span></div>
            <div style={{ color: '#e74c3c', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={14} /> {p.symptoms}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Styles
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', width: '95%' };
const btnStyle = { padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px' };
const cardStyle = { padding: '15px', borderLeft: '5px solid #3498db', backgroundColor: '#f9f9f9', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };

export default App;