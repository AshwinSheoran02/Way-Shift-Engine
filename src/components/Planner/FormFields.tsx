import { memo } from 'react';

interface PillGroupProps {
  label: string;
  options: readonly string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  activeClass: string;
  hoverClass: string;
}

/**
 * Reusable pill-based selection group for interests and constraints.
 */
export const PillGroup = memo(({ label, options, selectedValues, onToggle, activeClass, hoverClass }: PillGroupProps) => (
  <fieldset>
    <legend className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedValues.includes(option)
              ? `${activeClass} shadow-md`
              : `bg-white text-gray-600 border border-gray-200 ${hoverClass}`
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </fieldset>
));

interface EnergySelectorProps {
  selectedValue: 'relaxed' | 'active' | 'intense';
  onChange: (value: 'relaxed' | 'active' | 'intense') => void;
}

/**
 * Specialized selector for energy levels with emojis.
 */
export const EnergySelector = memo(({ selectedValue, onChange }: EnergySelectorProps) => {
  const levels = [
    { id: 'relaxed', label: 'Relaxed', emoji: '😌', activeClass: 'bg-[#34A853] border-[#34A853]' },
    { id: 'active', label: 'Active', emoji: '🚶', activeClass: 'bg-[#4285F4] border-[#4285F4]' },
    { id: 'intense', label: 'Intense', emoji: '🏃', activeClass: 'bg-[#EA4335] border-[#EA4335]' },
  ] as const;

  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">
        Energy Level
      </legend>
      <div className="flex gap-3">
        {levels.map((level) => (
          <label
            key={level.id}
            className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 border ${
              selectedValue === level.id
                ? `${level.activeClass} text-white shadow-md`
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="energyLevel"
              value={level.id}
              checked={selectedValue === level.id}
              onChange={() => onChange(level.id)}
              className="sr-only"
            />
            {level.emoji} {level.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
});
