import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store';  // Import the Store we just created

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the App in Provider so Redux works everywhere */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);