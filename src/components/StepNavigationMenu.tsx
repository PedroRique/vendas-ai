import React from 'react';
import './StepNavigationMenu.scss';

interface MenuItem {
  name: string;
  step: string;
  icon: string;
}

interface StepNavigationMenuProps {
  currentStep: string;
  currentStepIndex: number;
  onStepChange: (step: string) => void;
}

const MENU_STEPS: MenuItem[] = [
  {
    name: 'Localização',
    step: 'localization',
    icon: 'location_on',
  },
  {
    name: 'Veículos',
    step: 'cars',
    icon: 'directions_car',
  },
  {
    name: 'Acessórios',
    step: 'accessories',
    icon: 'settings',
  },
  {
    name: 'Proteções',
    step: 'protections',
    icon: 'beach_access',
  },
  {
    name: 'Dados pessoais',
    step: 'personal',
    icon: 'person',
  },
  {
    name: 'Finalização',
    step: 'finalization',
    icon: 'check_circle',
  },
];

const StepNavigationMenu: React.FC<StepNavigationMenuProps> = ({
  currentStep,
  currentStepIndex,
  onStepChange,
}) => {
  const isStepEnabled = (index: number): boolean => {
    // Permite navegar para steps anteriores ou o atual
    return index <= currentStepIndex;
  };

  const handleStepClick = (step: string, index: number) => {
    if (isStepEnabled(index)) {
      onStepChange(step);
    }
  };

  return (
    <aside className="step-navigation-menu">
      <ul className="menu-box">
        {MENU_STEPS.map((menu, index) => {
          const isActive = currentStep === menu.step;
          const isEnabled = isStepEnabled(index);
          
          return (
            <li key={menu.step}>
              <button
                className={`menu-item ${isActive ? '--active' : ''} ${!isEnabled ? '--disabled' : ''}`}
                onClick={() => handleStepClick(menu.step, index)}
                disabled={!isEnabled}
                title={menu.name}
                aria-label={menu.name}
              >
                <i className="material-icons">{menu.icon}</i>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default StepNavigationMenu;

