import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ---------------------------------------------------------
// 1. SET THE CLOUD URL (Replace this if yours is different)
// ---------------------------------------------------------
const BASE_URL = "https://medicamp-backend.onrender.com/"; 

// --- THUNKS ---

// 1. Worker to Fetch Patients
export const fetchPatients = createAsyncThunk('patients/fetch', async (_, { getState }) => {
  const token = getState().auth.token;
  // CHANGE: Use BASE_URL
  const response = await axios.get(`${BASE_URL}/api/patients`, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

// 2. Worker to Add Patient
export const addPatient = createAsyncThunk('patients/add', async (patientData, { getState }) => {
  const token = getState().auth.token;
  // CHANGE: Use BASE_URL
  const response = await axios.post(`${BASE_URL}/api/patients/add`, patientData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

// 3. Worker to Delete Patient
export const deletePatient = createAsyncThunk('patients/delete', async (id, { getState }) => {
  const token = getState().auth.token;
  // CHANGE: Use BASE_URL
  await axios.delete(`${BASE_URL}/api/patients/${id}`, {
    headers: { 'x-auth-token': token }
  });
  return id;
});

// --- SLICE ---
const patientSlice = createSlice({
  name: 'patients',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => { state.loading = true; })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p._id !== action.payload);
      });
  },
});

export default patientSlice.reducer;