import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// THUNKS
export const fetchInventory = createAsyncThunk('inventory/fetch', async (_, { getState }) => {
  const token = getState().auth.token;
  const response = await axios.get('http://127.0.0.1:5000/api/inventory', {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

export const addItem = createAsyncThunk('inventory/add', async (itemData, { getState }) => {
  const token = getState().auth.token;
  const response = await axios.post('http://127.0.0.1:5000/api/inventory/add', itemData, {
    headers: { 'x-auth-token': token }
  });
  return response.data;
});

export const deleteItem = createAsyncThunk('inventory/delete', async (id, { getState }) => {
  const token = getState().auth.token;
  await axios.delete(`http://127.0.0.1:5000/api/inventory/${id}`, {
    headers: { 'x-auth-token': token }
  });
  return id;
});

// SLICE
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { list: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.fulfilled, (state, action) => { state.list = action.payload; })
      .addCase(addItem.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(deleteItem.fulfilled, (state, action) => { state.list = state.list.filter(i => i._id !== action.payload); });
  },
});

export default inventorySlice.reducer;