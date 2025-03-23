
import React from 'react';
import { cn } from '@/lib/utils';

type Option = {
  value: string;
  label: string;
};

interface CategorySelectorProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export const CategorySelector = ({ 
  options, 
  selectedValues, 
  onChange 
}: CategorySelectorProps) => {
  
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => toggleOption(option.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/40",
              isSelected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
