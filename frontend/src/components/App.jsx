import React from 'react';
import ParentDashboard from './ParentDashboard';
import { ParentProvider } from './ParentContext';
import '../styles/App.css';

function App() {
  return (
    <ParentProvider>
      <ParentDashboard />
    </ParentProvider>
  );
}

export default App;
