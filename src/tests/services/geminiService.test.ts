import { describe, it, expect } from 'vitest';
import { parseGeminiResponse, ParseError } from '../../services/geminiService';
import { buildPlanPrompt, buildReplanPrompt } from '../../utils/promptBuilder';
import type { TripFormData, TripPlan } from '../../types/trip.types';

describe('parseGeminiResponse', () => {
  it('parses valid JSON and returns object', () => {
    const json = '{"destination": "Jaipur", "days": []}';
    const result = parseGeminiResponse<{ destination: string }>(json);
    expect(result.destination).toBe('Jaipur');
  });

  it('strips markdown code fences and parses JSON', () => {
    const wrapped = '```json\n{"destination": "Goa"}\n```';
    const result = parseGeminiResponse<{ destination: string }>(wrapped);
    expect(result.destination).toBe('Goa');
  });

  it('strips plain code fences (no language) and parses JSON', () => {
    const wrapped = '```\n{"value": 42}\n```';
    const result = parseGeminiResponse<{ value: number }>(wrapped);
    expect(result.value).toBe(42);
  });

  it('throws ParseError for invalid JSON', () => {
    expect(() => parseGeminiResponse('not valid json at all')).toThrow(ParseError);
  });

  it('throws ParseError for empty string', () => {
    expect(() => parseGeminiResponse('')).toThrow();
  });
});

describe('buildPlanPrompt', () => {
  it('includes destination in the prompt', () => {
    const formData: TripFormData = {
      origin: 'Delhi',
      destination: 'Manali',
      startDate: '2025-06-01',
      endDate: '2025-06-04',
      budgetPerDayINR: 3000,
      energyLevel: 'active',
      interests: ['Adventure'],
      constraints: [],
    };
    const prompt = buildPlanPrompt(formData);
    expect(prompt).toContain('Manali');
    expect(prompt).toContain('3000');
    expect(prompt).toContain('active');
  });

  it('includes interests in the prompt', () => {
    const formData: TripFormData = {
      origin: 'Mumbai',
      destination: 'Delhi',
      startDate: '2025-06-01',
      endDate: '2025-06-03',
      budgetPerDayINR: 5000,
      energyLevel: 'relaxed',
      interests: ['Culture', 'Food'],
      constraints: ['Vegetarian'],
    };
    const prompt = buildPlanPrompt(formData);
    expect(prompt).toContain('Culture');
    expect(prompt).toContain('Food');
    expect(prompt).toContain('Vegetarian');
  });
});

describe('buildReplanPrompt', () => {
  it('includes user message and plan in the prompt', () => {
    const plan: TripPlan = {
      destination: 'Jaipur',
      days: [],
      totalBudgetINR: 15000,
      constraints: [],
      generatedAt: new Date().toISOString(),
    };
    const userMessage = 'My flight is delayed by 2 hours';
    const prompt = buildReplanPrompt(plan, userMessage);
    expect(prompt).toContain('My flight is delayed by 2 hours');
    expect(prompt).toContain('Jaipur');
    expect(prompt).toContain('FLIGHT_DELAY');
  });
});
