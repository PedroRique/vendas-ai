import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import type { CarFilter } from "../hooks/useCarFilters";
import "./CarFilters.scss";

interface CarFiltersProps {
  availableFilters: CarFilter[];
  characteristicFilters: CarFilter[];
  carrentalFilters: CarFilter[];
  activeFilters: Record<string, unknown>;
  onFilterChange: (filter: CarFilter) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({
  availableFilters,
  characteristicFilters,
  carrentalFilters,
  activeFilters,
  onFilterChange,
}) => {
  const isFilterActive = (filter: CarFilter): boolean => {
    switch (filter.name) {
      case "lugares":
        return activeFilters.lugares === filter.value;
      case "cambioAutomatico":
        return activeFilters.cambioAutomatico === filter.value;
      case "arCondicionado":
        return activeFilters.arCondicionado === filter.value;
      case "numeroPortas":
        return activeFilters.numeroPortas === filter.value;
      case "nomeAgencia":
        return (
          Array.isArray(activeFilters.nomeAgencia) &&
          activeFilters.nomeAgencia.includes(filter.value as string)
        );
      default:
        return false;
    }
  };

  const isFilterDisabled = (filter: CarFilter): boolean => {
    // Se há outro filtro do mesmo nome ativo com valor diferente, desabilita este
    if (filter.name !== "nomeAgencia") {
      const activeValue =
        activeFilters[filter.name as keyof typeof activeFilters];
      if (activeValue !== undefined && activeValue !== filter.value) {
        return true;
      }
    }
    return false;
  };

  const renderFilterList = (filters: CarFilter[]) => {
    return (
      <ul className="filter-list">
        {filters.map((filter, index) => {
          const isActive = isFilterActive(filter);
          const isDisabled = isFilterDisabled(filter);

          return (
            <li
              key={`${filter.name}-${filter.value}-${index}`}
              className={`filter-item ${filter.featured ? "featured" : ""} ${
                isDisabled ? "-disabled" : ""
              }`}
            >
              <Checkbox
                inputId={`filter-${filter.name}-${filter.value}-${index}`}
                checked={isActive}
                disabled={isDisabled}
                onChange={() => onFilterChange(filter)}
              />
              <label
                htmlFor={`filter-${filter.name}-${filter.value}-${index}`}
                className={isDisabled ? "disabled" : ""}
              >
                {filter.description}
              </label>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="car-filters">
      <h2 className="filters-title">Detalhes do carro</h2>

      {/* Filtros Disponíveis (Featured) */}
      {availableFilters.length > 0 && (
        <div className="filters-section">
          {renderFilterList(availableFilters)}
        </div>
      )}

      {/* Accordion para características e locadoras */}
      <Accordion multiple className="filters-accordion">
        {/* Características */}
        {characteristicFilters.length > 0 && (
          <AccordionTab header="Características">
            {renderFilterList(characteristicFilters)}
          </AccordionTab>
        )}

        {/* Locadoras */}
        {carrentalFilters.length > 0 && (
          <AccordionTab header="Locadoras">
            {renderFilterList(carrentalFilters)}
          </AccordionTab>
        )}
      </Accordion>
    </div>
  );
};

export default CarFilters;
