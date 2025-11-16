import React, { useState, useEffect, useRef } from 'react';
import { Tag } from 'primereact/tag';
import './AutocompleteInput.scss';

export interface AutocompleteItem {
  nome: string;
  sigla?: string;
  lojas?: string[];
  qtLojas?: number;
  descricao?: string;
  codigo?: string;
  rentalCompanyId?: number;
  rentalCompanyName?: string;
}

export interface AutocompleteCategory {
  title: string;
  items: AutocompleteItem[];
  icon?: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: AutocompleteItem) => void;
  categories?: AutocompleteCategory[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  loading?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onSelect,
  categories = [],
  placeholder = 'Digite para buscar...',
  className = '',
  required = false,
  loading = false,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasResults = categories.some(cat => cat.items.length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setShowDropdown(false), 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (hasResults && isFocused) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [hasResults, isFocused, categories]);

  const handleFocus = () => {
    setIsFocused(true);
    if (hasResults) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 200);
  };

  const handleSelect = (item: AutocompleteItem) => {
    onSelect(item);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const getDisplayName = (item: AutocompleteItem): string => {
    return item.nome || item.descricao || '';
  };

  const getIconClass = (icon?: string): string => {
    switch (icon) {
      case 'airport':
        return 'pi pi-map-marker';
      case 'city':
      case 'district':
      case 'store':
        return 'pi pi-building';
      default:
        return 'pi pi-map-marker';
    }
  };

  return (
    <div className={`autocomplete-input ${className} ${loading ? '-loading' : ''}`}>
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="autocomplete-input-field"
          required={required}
          autoComplete="off"
        />
        {loading && (
          <i className="pi pi-spin pi-spinner autocomplete-loading-icon" />
        )}
      </div>
      
      {showDropdown && hasResults && (
        <div ref={dropdownRef} className="autocomplete-dropdown">
          {categories.map((category, catIndex) => {
            if (category.items.length === 0) return null;
            
            return (
              <div key={catIndex} className="autocomplete-category">
                <p className="autocomplete-category-title">{category.title}</p>
                <ul className="autocomplete-list">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="autocomplete-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(item);
                      }}
                    >
                      {category.icon && (
                        <i className={getIconClass(category.icon)} />
                      )}
                      <div className="autocomplete-item-content">
                        <div className="autocomplete-item-header">
                          <p className="autocomplete-item-name">
                            {getDisplayName(item)}
                          </p>
                          {item.rentalCompanyName && (
                            <Tag
                              value={item.rentalCompanyName}
                              severity="info"
                              className="autocomplete-company-tag"
                            />
                          )}
                        </div>
                        {item.qtLojas !== undefined && (
                          <p className="autocomplete-item-meta">
                            {item.qtLojas} lojas de atendimento
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;

