import React from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="App">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

export default App
