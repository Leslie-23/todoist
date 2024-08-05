// import React from 'react';
// render(<App />, document.getElementById('root'));
// After
// import { render } from 'react-dom';
import App from './App';
import './App.scss';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);
