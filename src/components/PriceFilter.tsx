import React, { useState, useEffect, useRef } from 'react';
import { Slider } from 'primereact/slider';
import './PriceFilter.scss';

interface PriceFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const prevValueRef = useRef<[number, number]>(value);

  useEffect(() => {
    // Comparar valores ao invés de referência do array para evitar loops infinitos
    const valueChanged = 
      prevValueRef.current[0] !== value[0] || 
      prevValueRef.current[1] !== value[1];
    
    if (valueChanged) {
      setLocalValue(value);
      prevValueRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[0], value[1]]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleChange = (e: { value: number | number[] | undefined }) => {
    if (e.value === undefined) return;
    const range = (Array.isArray(e.value) ? e.value : [e.value, e.value]) as [number, number];
    setLocalValue(range);
    onChange(range);
  };

  return (
    <div className="price-filter">
      <h3 className="price-filter-title">Filtro de Preço</h3>
      <div className="price-filter-display">
        <span className="price-min">{formatCurrency(localValue[0])}</span>
        <span className="price-separator">-</span>
        <span className="price-max">{formatCurrency(localValue[1])}</span>
      </div>
      <Slider
        className="price-slider"
        min={min}
        max={max}
        value={localValue}
        onChange={handleChange}
        step={10}
        range
      />
      <div className="price-filter-buttons">
        <button
          type="button"
          className="price-button decrease"
          onClick={() => {
            const newMin = Math.max(min, localValue[0] - 10);
            handleChange({ value: [newMin, localValue[1]] });
          }}
          disabled={localValue[0] <= min}
        >
          <i className="pi pi-minus" />
        </button>
        <button
          type="button"
          className="price-button increase"
          onClick={() => {
            const newMax = Math.min(max, localValue[1] + 10);
            handleChange({ value: [localValue[0], newMax] });
          }}
          disabled={localValue[1] >= max}
        >
          <i className="pi pi-plus" />
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;

