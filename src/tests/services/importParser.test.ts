import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseImportedTrip } from '../../services/importParser';
import * as geminiService from '../../services/geminiService';
import { FALLBACK_TRIP } from '../../services/fallbackData';

vi.mock('../../services/geminiService', () => ({
  callGemini: vi.fn(),
  parseGeminiResponse: vi.fn(),
  GeminiError: class extends Error { name = 'GeminiError' }
}));

describe('importParser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully parses a trip using Gemini', async () => {
    const mockPlan = {
      destination: 'London',
      days: [{ dayNumber: 1, activities: [{ location: 'Big Ben' }] }],
    };
    
    vi.mocked(geminiService.callGemini).mockResolvedValue('raw response');
    vi.mocked(geminiService.parseGeminiResponse).mockReturnValue(mockPlan);

    const result = await parseImportedTrip('some text');
    
    expect(result.plan.destination).toBe('London');
    expect(result.warning).toBeUndefined();
    expect(result.plan.days[0].activities[0].mapsUrl).toContain('Big%20Ben');
  });

  it('falls back to demo data on Gemini error', async () => {
    vi.mocked(geminiService.callGemini).mockRejectedValue(new Error('API Down'));

    const result = await parseImportedTrip('some text');
    
    expect(result.plan).toEqual(FALLBACK_TRIP);
    expect(result.warning).toBe('Failed to parse trip. Using demo data.');
  });
});
