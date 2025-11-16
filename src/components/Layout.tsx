import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoImage from '../assets/alugueldecarroai-preto.png';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Determinar se deve mostrar o header completo ou apenas a barra
  const showFullHeader = location.pathname === '/reserve' || location.pathname.startsWith('/reserve/');

  return (
    <div className="layout-container">
      {showFullHeader ? (
        <div className="layout-header">
          <div className="header-top">
            <div className="header-logo">
              <img src={logoImage} alt="Aluguel de Carro AI" />
            </div>
            <div className="header-actions">
              <Button
                label="Reserve Aqui"
                icon="pi pi-shopping-cart"
                onClick={() => navigate('/reserve')}
                severity="secondary"
                outlined
                size="small"
              />
              <Button
                label="Reservas"
                icon="pi pi-list"
                onClick={() => navigate('/reservas')}
                severity="secondary"
                outlined
                size="small"
              />
              {isAdmin && (
                <Button
                  label="Área Admin"
                  icon="pi pi-cog"
                  onClick={() => navigate('/admin')}
                  severity="secondary"
                  outlined
                  size="small"
                />
              )}
              <Button
                label="Sair"
                icon="pi pi-sign-out"
                onClick={handleLogout}
                severity="secondary"
                size="small"
              />
              <span className="welcome-message">Bem-vindo, {user?.name} {user?.surname}!</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="layout-header-bar">
          <div className="header-logo">
            <img src={logoImage} alt="Aluguel de Carro AI" />
          </div>
          <div className="header-actions">
            <Button
              label="Reserve Aqui"
              icon="pi pi-shopping-cart"
              onClick={() => navigate('/reserve')}
              severity="secondary"
              outlined
              size="small"
            />
            <Button
              label="Reservas"
              icon="pi pi-list"
              onClick={() => navigate('/reservas')}
              severity="secondary"
              outlined
              size="small"
            />
            {isAdmin && (
              <Button
                label="Área Admin"
                icon="pi pi-cog"
                onClick={() => navigate('/admin')}
                severity="secondary"
                outlined
                size="small"
              />
            )}
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              severity="secondary"
              size="small"
            />
            <span className="welcome-message">Bem-vindo, {user?.name} {user?.surname}!</span>
          </div>
        </div>
      )}
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;

