import React, { useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import type { Car } from '../hooks/useCarFilters';
import AccessoriesList from './AccessoriesList';
import Sidebar from './Sidebar';
import './AccessoriesPage.scss';

export interface Accessory {
  nome: string;
  valorDiaria: number;
  valorTotal: number;
  quantidade?: number;
  quantidadeMaxima?: number;
  quantidadeMaximaDiariasSerCobrado?: number;
  obrigatorio?: boolean;
  selected?: boolean;
  [key: string]: unknown;
}

interface AccessoriesPageProps {
  selectedCar: Car;
  localizationData: Record<string, unknown>;
  onSuccess: (accessories: Accessory[]) => void;
  onAbort?: () => void;
}

const AccessoriesPage: React.FC<AccessoriesPageProps> = ({
  selectedCar,
  localizationData,
  onSuccess,
  onAbort,
}) => {
  const toast = React.useRef<Toast>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>(
    (localizationData.accessories as Accessory[]) || []
  );

  const accessories = useMemo(() => {
    const dadosOpcionais = selectedCar.dadosOpcionais || [];
    // Inicializar quantidade para acessórios já selecionados
    return dadosOpcionais.map((acc) => {
      const existing = selectedAccessories.find(
        (sel) => sel.nome === acc.nome
      );
      return {
        ...acc,
        selected: !!existing,
        quantidade: existing?.quantidade || acc.quantidade || 0,
      };
    });
  }, [selectedCar.dadosOpcionais, selectedAccessories]);

  const handleAccessoryChange = (accessory: Accessory, quantity: number) => {
    // Calcular valor total baseado na quantidade e valor diária
    // Se há limite de diárias para cobrança, usar o mínimo entre quantidade e limite
    const maxDiarias = accessory.quantidadeMaximaDiariasSerCobrado;
    const diarias = maxDiarias ? Math.min(quantity, maxDiarias) : quantity;
    const valorTotal = accessory.valorDiaria * diarias;

    const updated: Accessory = {
      ...accessory,
      quantidade: quantity,
      valorTotal: valorTotal,
      selected: quantity > 0,
    };

    let newSelected: Accessory[];
    if (quantity === 0) {
      // Remover acessório
      newSelected = selectedAccessories.filter(
        (acc) => acc.nome !== accessory.nome
      );
    } else {
      // Adicionar ou atualizar acessório
      const existingIndex = selectedAccessories.findIndex(
        (acc) => acc.nome === accessory.nome
      );
      if (existingIndex >= 0) {
        newSelected = [...selectedAccessories];
        newSelected[existingIndex] = updated;
      } else {
        newSelected = [...selectedAccessories, updated];
      }
    }

    setSelectedAccessories(newSelected);
  };

  const calculateTotalPrice = (items: Accessory[]): number => {
    return items.reduce((total, item) => {
      // valorTotal já é o valor total (diária * quantidade cobrada)
      return total + (item.valorTotal || 0);
    }, 0);
  };

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(selectedAccessories);
  }, [selectedAccessories]);

  const handleSubmit = () => {
    onSuccess(selectedAccessories);
    toast.current?.show({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Acessórios salvos com sucesso.',
    });
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  return (
    <div className="accessories-page sidebar-container">
      <Toast ref={toast} />
      <div className="accessories-content-wrapper">
        <div className="accessories-header">
          <h1 className="main-title">Acessórios</h1>
        </div>

        <div className="accessories-content">
          {accessories.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum acessório disponível</p>
            </div>
          ) : (
            <AccessoriesList
              accessories={accessories}
              onAccessoryChange={handleAccessoryChange}
            />
          )}

          <div className="accessories-summary">
            <div className="summary-item">
              <span className="label">Total de Acessórios:</span>
              <span className="value">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          <div className="accessories-footer">
            <Button
              label="Encerrar"
              icon="pi pi-times"
              severity="secondary"
              onClick={handleAbort}
            />
            <Button
              label="Continuar"
              icon="pi pi-check"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>

      <Sidebar
        selectedCar={selectedCar}
        localizationData={localizationData as any}
        accessories={selectedAccessories}
        protections={[]}
      />
    </div>
  );
};

export default AccessoriesPage;

