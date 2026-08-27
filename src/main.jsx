import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

async function start() {
  if (import.meta.env.VITE_USE_MOCKS === '1') {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

start();
