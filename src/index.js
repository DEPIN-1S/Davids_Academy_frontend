import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { FileProvider } from '../src/context/FileContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* ✅ Wrap Redux Provider */}
      <FileProvider> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </FileProvider> 
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
