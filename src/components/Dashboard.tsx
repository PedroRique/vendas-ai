import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuth } from '../hooks/useAuth';
import LocalizationForm from './LocalizationForm';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLocalizationForm, setShowLocalizationForm] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLocalizationSuccess = (data: any) => {
    console.log('Localization data:', data);
    // TODO: Navigate to next step or save data
    // For now, we'll keep the form visible but you can navigate to vehicle selection
    setShowLocalizationForm(false);
  };

  const handleLocalizationAbort = () => {
    // TODO: Handle abort action
    console.log('Localization form aborted');
  };

  return (
    <div className="dashboard-container">
      <Card className="dashboard-card">
        <div className="dashboard-header">
          <div className="header-top">
            <h1>Sistema de Vendas</h1>
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
          </div>
          <p>Bem-vindo, {user?.login}!</p>
        </div>

        <div className="dashboard-content">
          {showLocalizationForm ? (
            <LocalizationForm
              onSuccess={handleLocalizationSuccess}
              onAbort={handleLocalizationAbort}
              agencyCode={(user && 'id_carrental' in user ? (user.id_carrental as number) : 0) || 0}
            />
          ) : (
            <div className="content-placeholder">
              <h3>Formulário de destino concluído!</h3>
              <p>Próximo passo: Seleção de veículos</p>
              <Button
                label="Voltar ao formulário"
                icon="pi pi-arrow-left"
                onClick={() => setShowLocalizationForm(true)}
                severity="secondary"
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
