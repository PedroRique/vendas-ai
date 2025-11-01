import React from 'react';
import { Calendar } from 'primereact/calendar';
import './TimePicker.scss';

interface TimePickerProps {
  selectedTime: Date | null;
  onTimeChange: (time: Date) => void;
  placeholder?: string;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  onTimeChange,
  placeholder = '00:00',
  className = '',
}) => {
  const handleTimeSelect = (event: any) => {
    if (event.value) {
      onTimeChange(event.value);
    }
  };

  // Criar uma data base para o time picker
  const getTimeValue = (): Date | null => {
    if (!selectedTime) return null;
    const date = new Date(selectedTime);
    return date;
  };

  return (
    <div className={`time-picker ${className}`}>
      <Calendar
        value={getTimeValue()}
        onChange={handleTimeSelect}
        timeOnly
        hourFormat="24"
        showTime
        showSeconds={false}
        placeholder={placeholder}
        className="time-picker-input"
        stepMinute={15}
      />
    </div>
  );
};

export default TimePicker;

