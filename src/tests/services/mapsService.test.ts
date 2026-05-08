import { describe, it, expect } from 'vitest';
import { buildDayRouteUrl, buildMapsSearchUrl, buildMapsEmbedUrl } from '../../services/mapsService';

describe('mapsService', () => {
  describe('buildMapsSearchUrl', () => {
    it('builds a valid search URL', () => {
      const url = buildMapsSearchUrl('Amber Fort', 'Jaipur');
      expect(url).toContain('google.com/maps/search');
      expect(url).toContain('Amber%20Fort');
      expect(url).toContain('Jaipur');
    });
  });

  describe('buildMapsEmbedUrl', () => {
    it('builds a valid embed URL', () => {
      const url = buildMapsEmbedUrl('Amber Fort', 'Jaipur');
      expect(url).toContain('maps.google.com/maps');
      expect(url).toContain('output=embed');
    });
  });

  describe('buildDayRouteUrl', () => {
    it('returns null for empty locations', () => {
      expect(buildDayRouteUrl([], 'Jaipur')).toBeNull();
    });

    it('returns search URL for single location', () => {
      const url = buildDayRouteUrl(['Amber Fort'], 'Jaipur');
      expect(url).toContain('search');
    });

    it('builds directions URL for multiple locations', () => {
      const locations = ['Airport', 'Hotel', 'Amber Fort'];
      const url = buildDayRouteUrl(locations, 'Jaipur');
      expect(url).toContain('google.com/maps/dir');
      expect(url).toContain('origin=Airport');
      expect(url).toContain('destination=Amber%20Fort');
      expect(url).toContain('waypoints=Hotel');
    });
  });
});
