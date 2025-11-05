import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import type { Accessory } from './AccessoriesPage';
import './AccessoriesList.scss';

interface AccessoriesListProps {
  accessories: Accessory[];
  onAccessoryChange: (accessory: Accessory, quantity: number) => void;
}

const AccessoriesList: React.FC<AccessoriesListProps> = ({
  accessories,
  onAccessoryChange,
}) => {
  const handleQuantityChange = (accessory: Accessory, value: number | null | undefined) => {
    const quantity = value ?? 0;
    const maxQuantity = accessory.quantidadeMaxima || 999;
    const finalQuantity = Math.min(Math.max(0, quantity), maxQuantity);
    onAccessoryChange(accessory, finalQuantity);
  };

  return (
    <div className="accessories-list">
      <div className="list-header">
        <span className="header-col description">Descrição</span>
        <span className="header-col quantity">Quantidade</span>
        <span className="header-col daily">Diária</span>
      </div>

      <div className="list-items">
        {accessories.map((accessory, index) => (
          <div key={index} className="list-item">
            <span className="item-col description">
              {accessory.nome}
              {accessory.obrigatorio && (
                <span className="required-badge">Obrigatório</span>
              )}
            </span>
            <div className="item-col quantity">
              <InputNumber
                value={accessory.quantidade || 0}
                onValueChange={(e) =>
                  handleQuantityChange(accessory, e.value)
                }
                min={accessory.obrigatorio ? 1 : 0}
                max={accessory.quantidadeMaxima || 999}
                showButtons
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                disabled={accessory.obrigatorio && (accessory.quantidade || 0) === 1}
              />
            </div>
            <span className="item-col daily">
              R$ {accessory.valorDiaria.toFixed(2).replace('.', ',')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesList;

