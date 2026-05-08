import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TripForm } from './TripForm';

describe('TripForm', () => {
  it('renders without crash', () => {
    render(<TripForm onSubmit={() => {}} loading={false} />);
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
  });

  it('has submit button disabled when destination is empty', () => {
    render(<TripForm onSubmit={() => {}} loading={false} />);
    const submitButton = screen.getByRole('button', { name: /build my trip/i });
    expect(submitButton).toBeDisabled();
  });

  it('renders all form fields', () => {
    render(<TripForm onSubmit={() => {}} loading={false} />);
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByText(/Energy Level/)).toBeInTheDocument();
    expect(screen.getByText(/Interests/)).toBeInTheDocument();
    expect(screen.getByText(/Constraints/)).toBeInTheDocument();
  });

  it('shows loading state when loading prop is true', () => {
    render(<TripForm onSubmit={() => {}} loading={true} />);
    expect(screen.getByText(/Building your trip/i)).toBeInTheDocument();
  });
});
