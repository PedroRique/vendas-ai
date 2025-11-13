import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { Toast } from 'primereact/toast';
import { apiService, type AdminUser, type Profile } from '../services/api';
import './CreateEditUserModal.scss';

interface CreateEditUserModalProps {
  visible: boolean;
  onHide: () => void;
  user: AdminUser | null;
  profiles: Profile[];
  onSuccess: () => void;
}

const CreateEditUserModal: React.FC<CreateEditUserModalProps> = ({
  visible,
  onHide,
  user,
  profiles,
  onSuccess,
}) => {
  const toast = React.useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    nomeLogin: '',
    tipoUsuarioId: 0,
    ativo: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      if (user) {
        // Edit mode
        setFormData({
          nome: user.nome || '',
          sobrenome: user.sobrenome || '',
          email: user.email || '',
          nomeLogin: user.nomeLogin || '',
          tipoUsuarioId: user.tipoUsuario?.tipoUsuarioId || 0,
          ativo: user.ativo ?? true,
        });
      } else {
        // Create mode
        setFormData({
          nome: '',
          sobrenome: '',
          email: '',
          nomeLogin: '',
          tipoUsuarioId: 0,
          ativo: true,
        });
      }
      setErrors({});
    }
  }, [visible, user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.sobrenome.trim()) {
      newErrors.sobrenome = 'Sobrenome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!user && !formData.nomeLogin.trim()) {
      newErrors.nomeLogin = 'Login é obrigatório';
    }

    if (!formData.tipoUsuarioId || formData.tipoUsuarioId === 0) {
      newErrors.tipoUsuarioId = 'Perfil é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validação',
        detail: 'Por favor, corrija os erros no formulário.',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (user) {
        // Update user
        await apiService.updateUser(user.usuarioId, {
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          email: formData.email,
          tipoUsuarioId: formData.tipoUsuarioId,
          ativo: formData.ativo,
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário atualizado com sucesso.',
        });
      } else {
        // Create user
        await apiService.createUser({
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          email: formData.email,
          nomeLogin: formData.nomeLogin,
          tipoUsuarioId: formData.tipoUsuarioId,
          tipoAtuacaoId: 1, // Vendas (baseado no sistema antigo)
          ativo: formData.ativo,
        });
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso.',
        });
      }

      onSuccess();
    } catch (error: unknown) {
      console.error('Error saving user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar usuário.';
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const profileOptions = profiles.map((profile) => ({
    label: profile.nome,
    value: profile.tipoUsuarioId,
  }));

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={user ? 'Editar Usuário' : 'Novo Usuário'}
        visible={visible}
        onHide={onHide}
        style={{ width: '600px' }}
        modal
        className="create-edit-user-modal"
      >
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-field">
            <label htmlFor="nome" className="form-label">
              Nome <span className="required">*</span>
            </label>
            <InputText
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className={errors.nome ? 'p-invalid' : ''}
              placeholder="Digite o nome do usuário"
            />
            {errors.nome && <small className="p-error">{errors.nome}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="sobrenome" className="form-label">
              Sobrenome <span className="required">*</span>
            </label>
            <InputText
              id="sobrenome"
              value={formData.sobrenome}
              onChange={(e) => setFormData({ ...formData, sobrenome: e.target.value })}
              className={errors.sobrenome ? 'p-invalid' : ''}
              placeholder="Digite o sobrenome do usuário"
            />
            {errors.sobrenome && <small className="p-error">{errors.sobrenome}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'p-invalid' : ''}
              placeholder="Digite um email válido"
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="tipoUsuarioId" className="form-label">
              Perfil <span className="required">*</span>
            </label>
            <Dropdown
              id="tipoUsuarioId"
              value={formData.tipoUsuarioId}
              options={profileOptions}
              onChange={(e) => setFormData({ ...formData, tipoUsuarioId: e.value })}
              placeholder="Selecione o perfil"
              className={errors.tipoUsuarioId ? 'p-invalid' : ''}
            />
            {errors.tipoUsuarioId && <small className="p-error">{errors.tipoUsuarioId}</small>}
          </div>

          {!user && (
            <div className="form-field">
              <label htmlFor="nomeLogin" className="form-label">
                Login <span className="required">*</span>
              </label>
              <InputText
                id="nomeLogin"
                value={formData.nomeLogin}
                onChange={(e) => setFormData({ ...formData, nomeLogin: e.target.value })}
                className={errors.nomeLogin ? 'p-invalid' : ''}
                placeholder="Digite o login para acesso"
              />
              {errors.nomeLogin && <small className="p-error">{errors.nomeLogin}</small>}
            </div>
          )}

          {!user && (
            <div className="form-field">
              <label htmlFor="ativo" className="form-label">
                Ativo
              </label>
              <div className="switch-field">
                <InputSwitch
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => setFormData({ ...formData, ativo: e.value ?? true })}
                />
                <span className="switch-label">{formData.ativo ? 'Ativo' : 'Inativo'}</span>
              </div>
            </div>
          )}

          <div className="modal-footer">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={onHide}
              severity="secondary"
              disabled={isLoading}
            />
            <Button
              label={user ? 'Salvar' : 'Cadastrar'}
              icon="pi pi-check"
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default CreateEditUserModal;

