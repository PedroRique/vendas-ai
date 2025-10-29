import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import './LoginForm.scss';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulação de validação
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    // Simulação de login (substitua pela sua lógica de autenticação)
    setTimeout(() => {
      setLoading(false);
      if (email === 'admin@example.com' && password === '123456') {
        alert('Login realizado com sucesso!');
        setEmail('');
        setPassword('');
      } else {
        setError('Email ou senha incorretos');
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <h2>Entrar</h2>
          <p>Faça login em sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <Message 
              severity="error" 
              text={error} 
              className="error-message"
            />
          )}

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
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
            <p>
              Não tem uma conta? <a href="#" className="signup-link">Cadastre-se</a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;
