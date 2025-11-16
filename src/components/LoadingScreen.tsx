import React from 'react';
import './LoadingScreen.scss';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <h2>Carregando...</h2>
        <p>Por favor, aguarde enquanto preparamos o sistema.</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

