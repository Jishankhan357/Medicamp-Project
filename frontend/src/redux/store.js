import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authReducer from './authSlice';
import patientReducer from './patientSlice';

// 1. Configuration: What to save?
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'patients'], // Save BOTH Auth and Patients
};

// 2. Combine your slices
const rootReducer = combineReducers({
  auth: authReducer,
  patients: patientReducer,
});

// 3. Wrap the reducer with the persistence logic
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create the Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings for non-serializable data
    }),
});

// 5. Export the Persistor (The Saver)
export const persistor = persistStore(store);