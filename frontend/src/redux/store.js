import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import patientReducer from './patientSlice'; // Import the new slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer, // Register it here
  },
});