import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DayColumn } from '../../components/ItineraryView/DayColumn';
import type { Day } from '../../types/trip.types';

const mockDay: Day = {
  dayNumber: 1,
  date: '2025-01-01',
  activities: [
    { id: '1', title: 'A1', costINR: 1000, location: 'L1', time: '09:00', category: 'food', description: 'D1', durationMinutes: 60, mapsUrl: '' },
    { id: '2', title: 'A2', costINR: 2000, location: 'L2', time: '11:00', category: 'culture', description: 'D2', durationMinutes: 120, mapsUrl: '' },
  ],
};

describe('DayColumn', () => {
  it('renders day number and date', () => {
    render(
      <DayColumn 
        day={mockDay} 
        destination="Jaipur" 
        dailyBudget={5000}
        changedActivityIds={[]}
        removedActivityIds={[]}
        addedActivityIds={[]}
      />
    );
    expect(screen.getByText(/Day 1/i)).toBeInTheDocument();
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });

  it('calculates budget color correctly (Green for low spend)', () => {
    render(
      <DayColumn 
        day={mockDay} 
        destination="Jaipur" 
        dailyBudget={5000} // Total is 3000, ratio is 0.6 (< 0.75)
        changedActivityIds={[]}
        removedActivityIds={[]}
        addedActivityIds={[]}
      />
    );
    const budgetText = screen.getByText(/₹3,000 \/ ₹5,000/i);
    expect(budgetText).toHaveClass('text-[#34A853]');
  });

  it('calculates budget color correctly (Red for high spend)', () => {
    render(
      <DayColumn 
        day={mockDay} 
        destination="Jaipur" 
        dailyBudget={3100} // Total is 3000, ratio is ~0.97 (> 0.9)
        changedActivityIds={[]}
        removedActivityIds={[]}
        addedActivityIds={[]}
      />
    );
    const budgetText = screen.getByText(/₹3,000 \/ ₹3,100/i);
    expect(budgetText).toHaveClass('text-[#EA4335]');
  });
});
