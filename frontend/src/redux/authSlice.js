import { createSlice } from '@reduxjs/toolkit';

// Check browser memory for existing token
const token = localStorage.getItem('token');

const initialState = {
  token: token,
  isAuthenticated: !!token, // True if token exists, False if not
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action 1: When user logs in successfully
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload); // Save to browser
    },
    // Action 2: When user logs out
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('token'); // Clear from browser
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;