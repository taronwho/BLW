import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './index.css';

const container = document.getElementById('root');
if (container === null) {
  throw new Error('Chybí #root: zkontroluj index.html.');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
