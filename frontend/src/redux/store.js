import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import patientReducer from './patientSlice';
import inventoryReducer from './inventorySlice'; // <--- CHANGE 1: Import the file

// 1. Configuration: What to save?
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'patients', 'inventory'], // <--- CHANGE 2: Add 'inventory' here
};

// 2. Combine your slices
const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientReducer,
  inventory: inventoryReducer, // <--- CHANGE 3: Register the reducer here
});

// 3. Wrap the reducer with the persistence logic
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 5. Export the Persistor
export const persistor = persistStore(store);