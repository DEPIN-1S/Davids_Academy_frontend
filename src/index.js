import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { FileProvider } from '../src/context/FileContext';
import ResultProvider from './context/ResultProvider';

// ✅ Suppress console logs in production environment
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ResultProvider>
      <Provider store={store}> {/* ✅ Wrap Redux Provider */}
        <FileProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </FileProvider>
      </Provider>
    </ResultProvider>
  </React.StrictMode>
);
reportWebVitals();
