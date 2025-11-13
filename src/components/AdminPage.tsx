import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { ToggleButton } from "primereact/togglebutton";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiService, type AdminUser } from "../services/api";
import "./AdminPage.scss";
import CreateEditUserModal from "./CreateEditUserModal";

const AdminPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const toast = React.useRef<Toast>(null);
  const menuRef = React.useRef<Menu>(null);
  const [currentMenuUser, setCurrentMenuUser] = useState<AdminUser | null>(
    null
  );
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [profiles, setProfiles] = useState<
    Array<{ tipoUsuarioId: number; nome: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      toast.current?.show({
        severity: "warn",
        summary: "Acesso Negado",
        detail: "Você não tem permissão para acessar esta área.",
      });
      return;
    }
    loadProfiles();
    loadUsers();
  }, [isAdmin]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    const timeout = setTimeout(() => {
      if (currentPage === 1) {
        loadUsers();
      } else {
        setCurrentPage(1);
      }
    }, 1200);

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchKey]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, rowsPerPage]);

  const loadProfiles = async () => {
    try {
      const response = await apiService.getProfiles();
      setProfiles(response.dados || []);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getUsers({
        key: searchKey || undefined,
        page: currentPage,
        qtPorPagina: rowsPerPage,
      });

      setUsers(response.dados.Itens || []);
      setTotalItems(response.dados.TotalItens || 0);
    } catch (error: unknown) {
      console.error("Error loading users:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar usuários.";
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowCreateModal(true);
  };

  const handleResetPassword = async (user: AdminUser) => {
    try {
      await apiService.resetPassword(user.usuarioId);
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Senha resetada com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Error resetting password:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao resetar senha.";
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: errorMessage,
      });
    }
  };

  const handleToggleUser = async (user: AdminUser) => {
    try {
      const updatedUser = await apiService.updateUser(user.usuarioId, {
        nome: user.nome,
        sobrenome: user.sobrenome,
        email: user.email,
        ativo: !user.ativo,
      });

      // Update local state
      setUsers(
        users.map((u) =>
          u.usuarioId === user.usuarioId ? updatedUser.dados : u
        )
      );

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: updatedUser.dados.ativo
          ? "Usuário ativado com sucesso."
          : "Usuário desativado com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Error toggling user:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao alterar status do usuário.";
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: errorMessage,
      });
      // Reload to revert state
      loadUsers();
    }
  };

  const handleUserSaved = () => {
    setShowCreateModal(false);
    setEditingUser(null);
    loadUsers();
  };

  const actionBodyTemplate = (rowData: AdminUser) => {
    const menuItems = [
      {
        label: "Editar",
        icon: "pi pi-pencil",
        command: () => {
          if (currentMenuUser) {
            handleEditUser(currentMenuUser);
          }
        },
      },
      {
        label: "Resetar Senha",
        icon: "pi pi-key",
        command: () => {
          if (currentMenuUser) {
            handleResetPassword(currentMenuUser);
          }
        },
      },
    ];

    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-text p-button-rounded"
          onClick={(e) => {
            setCurrentMenuUser(rowData);
            menuRef.current?.toggle(e);
          }}
          aria-label="Ações"
        />
        <Menu model={menuItems} popup ref={menuRef} />
      </div>
    );
  };

  const statusBodyTemplate = (rowData: AdminUser) => {
    return (
      <ToggleButton
        checked={rowData.ativo}
        onChange={() => handleToggleUser(rowData)}
        onLabel="Ativo"
        offLabel="Inativo"
        disabled={!isAdmin}
      />
    );
  };

  const accessedBodyTemplate = (rowData: AdminUser) => {
    return (
      <i
        className={`pi ${rowData.acessado ? "pi-circle" : "pi-circle-fill"}`}
        style={{ color: rowData.acessado ? "#6c757d" : "#28a745" }}
      />
    );
  };

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="access-denied">
          <h2>Acesso Negado</h2>
          <p>Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Toast ref={toast} />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Área Administrativa</h1>
          <Button
            label="Novo Usuário"
            icon="pi pi-plus"
            onClick={handleCreateUser}
            className="create-user-btn"
          />
        </div>

        {users.length === 0 && !isLoading ? (
          <div className="empty-state">
            <p>Não há usuários cadastrados.</p>
            <Button
              label="Novo Cadastro"
              icon="pi pi-plus"
              onClick={handleCreateUser}
            />
          </div>
        ) : (
          <>
            <div className="search-box">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  placeholder="Buscar usuário..."
                  className="search-input"
                />
              </span>
            </div>

            <DataTable
              value={users}
              loading={isLoading}
              paginator
              rows={rowsPerPage}
              rowsPerPageOptions={[10, 20, 30]}
              onPage={(e) => {
                setCurrentPage((e.page || 0) + 1);
                setRowsPerPage(e.rows || 10);
              }}
              totalRecords={totalItems}
              first={(currentPage - 1) * rowsPerPage}
              emptyMessage="Nenhum usuário encontrado"
              className="users-table"
            >
              <Column
                field="usuarioId"
                header="#ID"
                sortable
                style={{ width: "80px" }}
              />
              <Column
                field="nome"
                header="Nome"
                sortable
                body={(rowData) =>
                  `${rowData.nome} ${rowData.sobrenome || ""}`.trim()
                }
              />
              <Column
                field="tipoUsuario.nome"
                header="Perfil"
                sortable
                body={(rowData) => rowData.tipoUsuario?.nome || "N/A"}
              />
              <Column field="email" header="Email" sortable />
              <Column field="nomeLogin" header="Login" sortable />
              <Column
                header="Acessado"
                body={accessedBodyTemplate}
                style={{ width: "100px", textAlign: "center" }}
              />
              <Column
                header="Ativo"
                body={statusBodyTemplate}
                style={{ width: "120px", textAlign: "center" }}
              />
              <Column
                header="Ações"
                body={actionBodyTemplate}
                style={{ width: "80px", textAlign: "center" }}
              />
            </DataTable>
          </>
        )}
      </div>

      <CreateEditUserModal
        visible={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        profiles={profiles}
        onSuccess={handleUserSaved}
      />
    </div>
  );
};

export default AdminPage;
