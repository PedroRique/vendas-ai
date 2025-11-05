import React, { useState, useMemo } from 'react';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import type { Car } from '../hooks/useCarFilters';
import type { Accessory } from './AccessoriesPage';
import Sidebar from './Sidebar';
import './ProtectionsPage.scss';

export interface Protection {
  codigoProtecao: string;
  nome: string;
  descricao?: string;
  obrigatorio: boolean;
  valorTotal: number;
  valorDiaria: number;
  ordenacao?: number;
  sigla?: string;
  [key: string]: unknown;
}

interface ProtectionsPageProps {
  selectedCar: Car;
  localizationData: Record<string, unknown>;
  accessories: Accessory[];
  onSuccess: (protections: Protection[]) => void;
  onAbort?: () => void;
}

const ProtectionsPage: React.FC<ProtectionsPageProps> = ({
  selectedCar,
  localizationData,
  accessories,
  onSuccess,
  onAbort,
}) => {
  const toast = React.useRef<Toast>(null);
  
  // Códigos de proteções adicionais (opcionais)
  const additionalProtectionsCodes = ['17', '41', '7', '1', '32'];
  
  // Separar proteções principais e adicionais
  const { mainProtections, additionalProtections } = useMemo(() => {
    const allProtections = selectedCar.dadosProtecoes || [];
    
    const main = allProtections
      .filter((p) => !additionalProtectionsCodes.includes(p.codigoProtecao))
      .sort((a, b) => (a.ordenacao || 0) - (b.ordenacao || 0));
    
    const additional = allProtections
      .filter((p) => additionalProtectionsCodes.includes(p.codigoProtecao))
      .sort((a, b) => (a.ordenacao || 0) - (b.ordenacao || 0));
    
    return {
      mainProtections: main,
      additionalProtections: additional,
    };
  }, [selectedCar.dadosProtecoes]);

  // Estado inicial: seleciona proteção obrigatória ou primeira da lista
  const initialProtection = useMemo(() => {
    const saved = (localizationData.protection as Protection[]) || [];
    if (saved.length > 0) {
      return saved[0];
    }
    return (
      mainProtections.find((p) => p.obrigatorio) || mainProtections[0] || null
    );
  }, [mainProtections, localizationData.protection]);

  const [selectedProtection, setSelectedProtection] = useState<Protection | null>(
    initialProtection
  );

  // Estado inicial para proteção adicional
  const initialAdditionalProtection = useMemo(() => {
    const saved = (localizationData.protection as Protection[]) || [];
    return saved.length > 1 ? saved[1] : null;
  }, [localizationData.protection]);

  const [selectedAdditionalProtection, setSelectedAdditionalProtection] =
    useState<Protection | null>(initialAdditionalProtection);

  // Calcular basicProtection (proteção básica obrigatória)
  // Removido basicProtection e basicProtectionDaily não utilizados

  // Calcular diferença de preço quando não é obrigatória
  const calcProtectionDiff = (protection: Protection): number => {
    if (protection.obrigatorio) {
      return 0; // Já incluído (não deve ser exibido)
    }
    // Retorna o valor total (como no sistema antigo)
    return protection.valorTotal;
  };

  const handleProtectionChange = (protection: Protection) => {
    setSelectedProtection(protection);
  };

  const handleAdditionalProtectionChange = (protection: Protection | null) => {
    setSelectedAdditionalProtection(protection);
  };

  // Compute selected protections array for Sidebar
  const selectedProtections = useMemo(() => {
    const protections: Protection[] = [];
    
    if (selectedProtection) {
      protections.push(selectedProtection);
    }
    
    if (selectedAdditionalProtection) {
      protections.push(selectedAdditionalProtection);
    }
    
    return protections;
  }, [selectedProtection, selectedAdditionalProtection]);

  const handleSubmit = () => {
    onSuccess(selectedProtections);
    toast.current?.show({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Proteções selecionadas com sucesso.',
    });
  };

  const handleAbort = () => {
    if (onAbort) {
      onAbort();
    }
  };

  // Removido isMensal não utilizado

  return (
    <div className="protections-page">
      <Toast ref={toast} />
      <Card className="protections-card">
        <div className="protections-header">
          <h1 className="main-title">Proteção Especial</h1>
        </div>

        <div className="protections-content">
          {/* Proteções Principais */}
          <div className="protections-section">
            <div className="protections-list">
              {mainProtections.length === 0 ? (
                <p className="empty-message">Nenhuma proteção disponível</p>
              ) : (
                mainProtections.map((protection, index) => {
                  const diff = calcProtectionDiff(protection);
                  const isSelected = selectedProtection?.codigoProtecao === protection.codigoProtecao;

                  return (
                    <div
                      key={index}
                      className={`protection-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleProtectionChange(protection)}
                    >
                      <div className="protection-radio">
                        <RadioButton
                          inputId={`protection-${index}`}
                          name="protection"
                          value={protection.codigoProtecao}
                          checked={isSelected}
                          onChange={() => handleProtectionChange(protection)}
                        />
                      </div>
                      <label
                        htmlFor={`protection-${index}`}
                        className="protection-label"
                      >
                        <span className="protection-name">{protection.nome}</span>
                        {protection.descricao && (
                          <span className="protection-tooltip" title={protection.descricao}>
                            <i className="pi pi-info-circle"></i>
                          </span>
                        )}
                        <span className="protection-price">
                          {protection.obrigatorio ? (
                            <b>Incluído</b>
                          ) : (
                            <b>+ R$ {diff.toFixed(2).replace('.', ',')}</b>
                          )}
                        </span>
                      </label>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Proteções Adicionais (Opcionais) */}
          {additionalProtections.length > 0 && (
            <div className="protections-section additional-section">
              <h2 className="section-title">Opcional:</h2>
              <div className="protections-list">
                {additionalProtections.map((protection, index) => {
                  const isSelected =
                    selectedAdditionalProtection?.codigoProtecao ===
                    protection.codigoProtecao;

                  return (
                    <div
                      key={index}
                      className={`protection-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleAdditionalProtectionChange(isSelected ? null : protection)}
                    >
                      <div className="protection-radio">
                        <RadioButton
                          inputId={`additional-${index}`}
                          name="additionalProtection"
                          value={protection.codigoProtecao}
                          checked={isSelected}
                          onChange={() => handleAdditionalProtectionChange(isSelected ? null : protection)}
                        />
                      </div>
                      <label
                        htmlFor={`additional-${index}`}
                        className="protection-label"
                      >
                        <span className="protection-name">{protection.nome}</span>
                        {protection.descricao && (
                          <span className="protection-tooltip" title={protection.descricao}>
                            <i className="pi pi-info-circle"></i>
                          </span>
                        )}
                        <span className="protection-price">
                          {protection.obrigatorio ? (
                            <b>Incluído</b>
                          ) : (
                            <b>+ R$ {protection.valorTotal.toFixed(2).replace('.', ',')}</b>
                          )}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="protections-footer">
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
      </Card>

      <Sidebar
        selectedCar={selectedCar}
        localizationData={localizationData as any}
        accessories={accessories}
        protections={selectedProtections}
      />
    </div>
  );
};

export default ProtectionsPage;

