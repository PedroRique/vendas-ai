import React from 'react';
import { Calendar } from 'primereact/calendar';
import './DatePicker.scss';

interface DatePickerProps {
  selectedDate: Date | null;
  minDate?: Date;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  minDate,
  onDateChange,
  placeholder = 'Selecione a data',
  className = '',
}) => {
  const handleDateSelect = (event: any) => {
    if (event.value) {
      onDateChange(event.value);
    }
  };

  return (
    <div className={`date-picker ${className}`}>
      <span className="icon">
        <i className="pi pi-calendar" />
      </span>
      <Calendar
        value={selectedDate}
        onChange={handleDateSelect}
        minDate={minDate}
        showIcon
        dateFormat="dd/mm/yy"
        placeholder={placeholder}
        showButtonBar
        className="date-picker-input"
        inputClassName="date-picker-input-field"
      />
    </div>
  );
};

export default DatePicker;

