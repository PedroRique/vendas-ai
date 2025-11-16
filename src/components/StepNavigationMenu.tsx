import React, { useMemo } from 'react';
import { Steps } from 'primereact/steps';
import type { MenuItem } from 'primereact/menuitem';
import './StepNavigationMenu.scss';

interface StepNavigationMenuProps {
  currentStep: string;
  currentStepIndex: number;
  onStepChange: (step: string) => void;
}

const STEP_MAP: Record<string, number> = {
  'localization': 0,
  'cars': 1,
  'accessories': 2,
  'protections': 3,
  'personal': 4,
  'quotation': 4, // Mesmo índice que personal
  'finalization': 5,
};

const STEP_LABELS = [
  'Localização',
  'Veículos',
  'Acessórios',
  'Proteções',
  'Dados pessoais',
  'Finalização',
];

const StepNavigationMenu: React.FC<StepNavigationMenuProps> = ({
  currentStep,
  currentStepIndex,
  onStepChange,
}) => {
  const currentStepIndexValue = STEP_MAP[currentStep] ?? 0;

  const items: MenuItem[] = useMemo(() => {
    return STEP_LABELS.map((label, index) => ({
      label,
      disabled: index > currentStepIndex,
    }));
  }, [currentStepIndex]);

  const handleStepSelect = (e: { index: number }) => {
    const index = e.index;
    // Permite navegar apenas para steps já visitados
    if (index <= currentStepIndex) {
      // Encontrar o step correspondente ao índice
      const step = Object.keys(STEP_MAP).find(key => STEP_MAP[key] === index);
      if (step) {
        onStepChange(step);
      }
    }
  };

  return (
    <div className="step-navigation-stepper">
      <Steps 
        model={items}
        activeIndex={currentStepIndexValue}
        onSelect={handleStepSelect}
        readOnly={false}
      />
    </div>
  );
};

export default StepNavigationMenu;

