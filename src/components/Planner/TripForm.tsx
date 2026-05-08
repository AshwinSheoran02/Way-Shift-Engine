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
 * All inputs have proper labels for accessibility. Light-first with dark: variants.
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
        <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          placeholder="e.g., Jaipur, Goa, Manali..."
          value={formData.destination}
          onChange={(e) => handleChange('destination', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        {errors.destination && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.destination}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.startDate && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.endDate && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.endDate}</p>}
        </div>
      </div>

      {/* Budget Slider */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Budget per day: <span className="text-indigo-600 dark:text-indigo-400 font-semibold">₹{formData.budgetPerDayINR.toLocaleString('en-IN')}</span>
        </label>
        <input
          id="budget"
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={formData.budgetPerDayINR}
          onChange={(e) => handleChange('budgetPerDayINR', Number(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700 accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
        {errors.budgetPerDayINR && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.budgetPerDayINR}</p>}
      </div>

      {/* Energy Level */}
      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Energy Level
        </legend>
        <div className="flex gap-3">
          {(['relaxed', 'active', 'intense'] as const).map((level) => (
            <label
              key={level}
              className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer text-sm font-medium transition-all duration-200 border ${
                formData.energyLevel === level
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
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
        <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Constraints */}
      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
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
            ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]'
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
