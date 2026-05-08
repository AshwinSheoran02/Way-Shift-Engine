import { useState, useCallback } from 'react';
import type { TripFormData } from '../../types/trip.types';
import { validateTripForm } from '../../utils/validators';

const INTEREST_OPTIONS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Nightlife'];
const CONSTRAINT_OPTIONS = ['Vegetarian', 'Low walking', 'Elderly-friendly', 'Budget-conscious'];

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  loading: boolean;
}

/**
 * Trip planning form with destination, dates, budget, energy level, interests, and constraints.
 * All inputs have proper labels for accessibility.
 */
export function TripForm({ onSubmit, loading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    budgetPerDayINR: 5000,
    energyLevel: 'active',
    interests: [],
    constraints: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: keyof TripFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const togglePill = useCallback((field: 'interests' | 'constraints', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTripForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    onSubmit(formData);
  }, [formData, onSubmit]);

  const isDisabled = !formData.destination.trim() || !formData.startDate || !formData.endDate || loading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Destination */}
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          placeholder="e.g., Jaipur, Goa, Manali..."
          value={formData.destination}
          onChange={(e) => handleChange('destination', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] transition-colors text-sm"
        />
        {errors.destination && <p className="mt-1 text-xs text-[var(--color-error-text)]">{errors.destination}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-primary)] focus:border-[var(--color-accent-mid)] transition-colors text-sm"
          />
          {errors.startDate && <p className="mt-1 text-xs text-[var(--color-error-text)]">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-primary)] focus:border-[var(--color-accent-mid)] transition-colors text-sm"
          />
          {errors.endDate && <p className="mt-1 text-xs text-[var(--color-error-text)]">{errors.endDate}</p>}
        </div>
      </div>

      {/* Budget Slider */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
          Budget per day: <span className="text-[var(--color-accent-end)] font-semibold">₹{formData.budgetPerDayINR.toLocaleString('en-IN')}</span>
        </label>
        <input
          id="budget"
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={formData.budgetPerDayINR}
          onChange={(e) => handleChange('budgetPerDayINR', Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent-mid)] bg-[var(--color-bg-elevated)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-1">
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
        {errors.budgetPerDayINR && <p className="mt-1 text-xs text-[var(--color-error-text)]">{errors.budgetPerDayINR}</p>}
      </div>

      {/* Energy Level */}
      <fieldset>
        <legend className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Energy Level
        </legend>
        <div className="flex gap-3">
          {(['relaxed', 'active', 'intense'] as const).map((level) => (
            <label
              key={level}
              className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 border ${
                formData.energyLevel === level
                  ? 'gradient-accent text-white border-transparent shadow-lg shadow-purple-500/20'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border-white/10 hover:border-white/20'
              }`}
            >
              <input
                type="radio"
                name="energyLevel"
                value={level}
                checked={formData.energyLevel === level}
                onChange={() => handleChange('energyLevel', level)}
                className="sr-only"
              />
              {level === 'relaxed' && '😌 '}
              {level === 'active' && '🚶 '}
              {level === 'intense' && '🏃 '}
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Interests */}
      <fieldset>
        <legend className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Interests
        </legend>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => togglePill('interests', interest)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                formData.interests.includes(interest)
                  ? 'bg-[var(--color-accent-mid)] text-white shadow-md shadow-purple-500/20'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-white/10 hover:border-white/20'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Constraints */}
      <fieldset>
        <legend className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Constraints
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONSTRAINT_OPTIONS.map((constraint) => (
            <button
              key={constraint}
              type="button"
              onClick={() => togglePill('constraints', constraint)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                formData.constraints.includes(constraint)
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-white/10 hover:border-white/20'
              }`}
            >
              {constraint}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
          isDisabled
            ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
            : 'gradient-accent text-white shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="ml-2">Building your trip...</span>
          </span>
        ) : (
          '🚀 Build My Trip'
        )}
      </button>
    </form>
  );
}
