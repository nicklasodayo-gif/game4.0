import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

document.addEventListener('DOMContentLoaded', () => {
  // Prevent pinch zoom (kiosk mode).
  document.addEventListener(
    'touchmove',
    (e) => {
      if ((e as unknown as { scale?: number }).scale !== 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  // Prevent context menu.
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Prevent double-tap zoom.
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    },
    false
  );
});

// Service worker registration (for PWA / offline kiosk support).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed; app still works online.
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element with id "root" was not found in index.html');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
