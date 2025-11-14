import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { useAuth } from '../hooks/useAuth';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { isAuthenticated, login: authLogin, checkFirstAccess, createPassword } = useAuth();

  // Effect para limpar formulário quando logado
  useEffect(() => {
    if (isAuthenticated) {
      setLogin('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsFirstAccess(false);
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação básica
    if (!login || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      await authLogin({ loginName: login, password });
      // O redirecionamento será feito pelo useEffect
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleFirstAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      await createPassword(login, newPassword);
      // Após criar a senha, fazer login automaticamente
      await authLogin({ loginName: login, password: newPassword });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao criar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = async (value: string) => {
    setLogin(value);
    setError('');
    
    // Verificar se é primeiro acesso
    if (value.length > 3) {
      try {
        const isFirst = await checkFirstAccess(value);
        setIsFirstAccess(isFirst);
      } catch (error) {
        console.error('Erro ao verificar primeiro acesso:', error);
      }
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h2>{isFirstAccess ? 'Primeiro Acesso' : 'Entrar'}</h2>
          <p>{isFirstAccess ? 'Crie sua senha para continuar' : 'Faça login em sua conta'}</p>
        </div>

        {isFirstAccess ? (
          <form onSubmit={handleFirstAccessSubmit} className="login-form">
            {error && (
              <Message 
                severity="error" 
                text={error} 
                className="error-message"
              />
            )}

            <div className="field">
              <label htmlFor="login">Login</label>
              <InputText
                id="login"
                value={login}
                onChange={(e) => handleLoginChange(e.target.value)}
                placeholder="Digite seu login"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="newPassword">Nova Senha</label>
              <Password
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full"
                disabled={loading}
                toggleMask
                feedback={false}
              />
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                className="w-full"
                disabled={loading}
                toggleMask
                feedback={false}
              />
            </div>

            <Button
              type="submit"
              label={loading ? 'Criando...' : 'Criar Senha'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
              className="w-full login-button"
              disabled={loading}
            />
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <Message 
                severity="error" 
                text={error} 
                className="error-message"
              />
            )}

            <div className="field">
              <label htmlFor="login">Login</label>
              <InputText
                id="login"
                value={login}
                onChange={(e) => handleLoginChange(e.target.value)}
                placeholder="Digite seu login"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Senha</label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full"
                disabled={loading}
                toggleMask
                feedback={false}
              />
            </div>

            <Button
              type="submit"
              label={loading ? 'Entrando...' : 'Entrar'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
              className="w-full login-button"
              disabled={loading}
            />

            <Divider />

            <div className="login-footer">
              <p>
                <a href="#" className="forgot-password">
                  Esqueceu sua senha?
                </a>
              </p>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
