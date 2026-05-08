import { useState, useCallback } from 'react';
import type { TripFormData } from '../../types/trip.types';
import { validateTripForm } from '../../utils/validators';
import { INTEREST_OPTIONS, CONSTRAINT_OPTIONS } from '../../constants/categories';
import { Footer } from '../Layout/Footer';
import { EnergySelector, PillGroup } from './FormFields';

interface TripFormProps {
  /** Callback when form is submitted and valid */
  onSubmit: (data: TripFormData) => void;
  /** Whether the trip is currently being generated */
  loading: boolean;
}

/**
 * Main entry form for trip planning.
 * Designed with Google's Material aesthetics (Clean, Light, Dynamic).
 */
export function TripForm({ onSubmit, loading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    origin: '',
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
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

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

  const isDisabled = !formData.origin.trim() || !formData.destination.trim() || !formData.startDate || !formData.endDate || loading;

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in" noValidate>
      {/* Starting Location */}
      <div>
        <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1.5">
          Starting Location (Current City)
        </label>
        <input
          id="origin"
          type="text"
          placeholder="e.g., Delhi, Mumbai, Bangalore..."
          value={formData.origin}
          onChange={(e) => handleChange('origin', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm transition-all"
        />
        {errors.origin && <p className="mt-1 text-xs text-[#EA4335] font-medium">{errors.origin}</p>}
      </div>

      {/* Destination */}
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1.5">
          Destination
        </label>
        <input
          id="destination"
          type="text"
          placeholder="e.g., Jaipur, Goa, Manali..."
          value={formData.destination}
          onChange={(e) => handleChange('destination', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm transition-all"
        />
        {errors.destination && <p className="mt-1 text-xs text-[#EA4335] font-medium">{errors.destination}</p>}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm transition-all"
          />
          {errors.startDate && <p className="mt-1 text-xs text-[#EA4335] font-medium">{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1.5">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:border-transparent text-sm transition-all"
          />
          {errors.endDate && <p className="mt-1 text-xs text-[#EA4335] font-medium">{errors.endDate}</p>}
        </div>
      </div>

      {/* Budget Slider */}
      <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-3">
          Budget per day: <span className="text-[#4285F4] font-bold">₹{formData.budgetPerDayINR.toLocaleString('en-IN')}</span>
        </label>
        <input
          id="budget"
          type="range"
          min={1000}
          max={50000}
          step={500}
          value={formData.budgetPerDayINR}
          onChange={(e) => handleChange('budgetPerDayINR', Number(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer accent-[#4285F4]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
          <span>₹1,000</span>
          <span>₹50,000</span>
        </div>
        {errors.budgetPerDayINR && <p className="mt-1 text-xs text-[#EA4335] font-medium">{errors.budgetPerDayINR}</p>}
      </div>

      {/* Energy Level */}
      <EnergySelector 
        selectedValue={formData.energyLevel} 
        onChange={(val) => handleChange('energyLevel', val)} 
      />

      {/* Interests */}
      <PillGroup
        label="Interests"
        options={INTEREST_OPTIONS}
        selectedValues={formData.interests}
        onToggle={(val) => togglePill('interests', val)}
        activeClass="bg-[#4285F4] text-white"
        hoverClass="hover:border-[#4285F4] hover:text-[#4285F4]"
      />

      {/* Constraints */}
      <PillGroup
        label="Constraints"
        options={CONSTRAINT_OPTIONS}
        selectedValues={formData.constraints}
        onToggle={(val) => togglePill('constraints', val)}
        activeClass="bg-[#FBBC04] text-gray-900"
        hoverClass="hover:border-[#FBBC04] hover:text-gray-900"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isDisabled}
        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 ${
          isDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#4285F4] hover:bg-[#3367D6] text-white shadow-xl shadow-blue-500/20 active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <span className="ml-2">Crafting Itinerary...</span>
          </span>
        ) : (
          '🚀 Generate Trip Plan'
        )}
      </button>
    </form>
    <Footer />
    </>
  );
}
