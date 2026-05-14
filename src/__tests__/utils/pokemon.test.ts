/**
 * Pokemon Utility Tests
 */

import {
  capitalize,
  formatAbilityName,
  formatHeight,
  formatStatName,
  formatWeight,
  getPokemonIdFromUrl,
  getStatColor,
  getStatPercentage,
} from '@/utils/pokemon';

describe('Pokemon Utilities', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('bulbasaur')).toBe('Bulbasaur');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('formatHeight', () => {
    it('formats height correctly', () => {
      expect(formatHeight(7)).toContain("2'");
    });

    it('handles zero height', () => {
      const result = formatHeight(0);
      expect(result).toContain('0');
    });
  });

  describe('formatWeight', () => {
    it('formats weight correctly', () => {
      expect(formatWeight(69)).toContain('lbs');
    });

    it('includes kg in result', () => {
      const result = formatWeight(69);
      expect(result).toContain('kg');
    });
  });

  describe('formatStatName', () => {
    it('formats stat names', () => {
      expect(formatStatName('hp')).toBe('HP');
      expect(formatStatName('attack')).toBe('ATK');
      expect(formatStatName('special-attack')).toBe('SP.ATK');
    });

    it('handles unknown stat names', () => {
      expect(formatStatName('unknown')).toBe('unknown');
    });
  });

  describe('formatAbilityName', () => {
    it('formats ability names with hyphens', () => {
      expect(formatAbilityName('static-electricity')).toBe('Static Electricity');
    });

    it('capitalizes single words', () => {
      expect(formatAbilityName('overgrow')).toBe('Overgrow');
    });
  });

  describe('getPokemonIdFromUrl', () => {
    it('extracts Pokemon ID from URL', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/1/';
      expect(getPokemonIdFromUrl(url)).toBe(1);
    });

    it('handles URL without trailing slash', () => {
      const url = 'https://pokeapi.co/api/v2/pokemon/25';
      expect(getPokemonIdFromUrl(url)).toBe(25);
    });

    it('returns 0 for invalid URL', () => {
      expect(getPokemonIdFromUrl('invalid')).toBe(0);
    });
  });

  describe('getStatPercentage', () => {
    it('calculates percentage correctly', () => {
      const percentage = getStatPercentage(100);
      expect(percentage).toBeGreaterThan(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });

    it('handles max stat value', () => {
      const percentage = getStatPercentage(255);
      expect(percentage).toBeCloseTo(100);
    });

    it('handles zero value', () => {
      expect(getStatPercentage(0)).toBe(0);
    });
  });

  describe('getStatColor', () => {
    it('returns green for high percentage', () => {
      expect(getStatColor(85)).toBe('#4CAF50');
    });

    it('returns orange for medium percentage', () => {
      expect(getStatColor(50)).toBe('#FFC107');
    });

    it('returns red for low percentage', () => {
      expect(getStatColor(10)).toBe('#F44336');
    });
  });
});
