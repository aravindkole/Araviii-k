import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storage';

describe('StorageService Persistence & Backup', () => {
  beforeEach(() => {
    // Clear mock storage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('exports valid JSON bundle containing essential tables', () => {
    const jsonStr = StorageService.exportAllData();
    expect(jsonStr).toBeDefined();

    const parsed = JSON.parse(jsonStr);
    expect(parsed.version).toBe('1.0.0');
    expect(Array.isArray(parsed.subjects)).toBe(true);
    expect(Array.isArray(parsed.assignments)).toBe(true);
    expect(Array.isArray(parsed.timetable)).toBe(true);
    expect(Array.isArray(parsed.exams)).toBe(true);
    expect(Array.isArray(parsed.notes)).toBe(true);
  });

  it('handles valid and invalid import strings gracefully', () => {
    // Invalid
    const badRes = StorageService.importData('{ malformed json');
    expect(badRes.success).toBe(false);

    // Valid
    const goodJson = JSON.stringify({
      version: '1.0.0',
      subjects: [{ id: 's1', name: 'Test', code: 'T101', color: '#000' }],
      assignments: [],
      timetable: [],
      exams: [],
      notes: [],
    });
    const goodRes = StorageService.importData(goodJson);
    expect(goodRes.success).toBe(true);
  });
});
