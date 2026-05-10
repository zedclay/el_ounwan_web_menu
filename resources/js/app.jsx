import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './MainApp';

if (document?.fonts?.ready) {
    document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
} else {
    document.documentElement.classList.add('fonts-loaded');
}

const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
}
