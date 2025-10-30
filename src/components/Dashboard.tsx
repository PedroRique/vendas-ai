import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Bem-vindo ao sistema de vendas!</p>
        </div>

        <div className="dashboard-content">
          <div className="user-info">
            <h3>Informações do Usuário</h3>
            <p><strong>Login:</strong> {user?.login}</p>
            <p><strong>Token:</strong> {user?.token ? '***' + user.token.slice(-8) : 'N/A'}</p>
          </div>

          <div className="dashboard-actions">
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
