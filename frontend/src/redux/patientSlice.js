import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- THUNKS (The Background Workers) ---

// 1. Worker to Fetch Patients
export const fetchPatients = createAsyncThunk('patients/fetch', async (_, { getState }) => {
  const token = getState().auth.token; // Get token from Auth Slice
  const response = await axios.get('http://127.0.0.1:5000/api/patients', {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

// 2. Worker to Add Patient
export const addPatient = createAsyncThunk('patients/add', async (patientData, { getState }) => {
  const token = getState().auth.token;
  const response = await axios.post('http://127.0.0.1:5000/api/patients/add', patientData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

// 3. Worker to Delete Patient
export const deletePatient = createAsyncThunk('patients/delete', async (id, { getState }) => {
  const token = getState().auth.token;
  await axios.delete(`http://127.0.0.1:5000/api/patients/${id}`, {
    headers: { 'x-auth-token': token }
  });
  return id; // Return the ID so we can remove it from the list
});

// --- SLICE (The State Manager) ---
const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {}, // No simple reducers needed, we use extraReducers for Thunks
  extraReducers: (builder) => {
    builder
      // Handle Fetch
      .addCase(fetchPatients.pending, (state) => { state.loading = true; })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle Add
      .addCase(addPatient.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add new patient to top of list
      })
      // Handle Delete
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload); // Remove from list
      });
  },
});

export default patientSlice.reducer;