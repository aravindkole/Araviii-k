import { describe, it, expect } from 'vitest';
import { Assignment, FocusSession } from '../types';

describe('Dashboard Metrics & Calculations', () => {
  it('calculates completion rate correctly with 0 tasks', () => {
    const tasks: Assignment[] = [];
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    expect(rate).toBe(0);
  });

  it('calculates completion rate accurately with mixed tasks', () => {
    const tasks: Partial<Assignment>[] = [
      { id: '1', status: 'completed' },
      { id: '2', status: 'todo' },
      { id: '3', status: 'in_progress' },
      { id: '4', status: 'completed' },
    ];
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const rate = Math.round((completed / tasks.length) * 100);
    expect(rate).toBe(50);
  });

  it('calculates total focus hours from session durations', () => {
    const sessions: Partial<FocusSession>[] = [
      { durationMinutes: 25 },
      { durationMinutes: 25 },
      { durationMinutes: 50 },
    ];
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const hours = (totalMinutes / 60).toFixed(1);
    expect(totalMinutes).toBe(100);
    expect(hours).toBe('1.7');
  });

  it('detects overdue assignments by past due date', () => {
    const pastDate = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
    const futureDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = new Date(pastDate) < today;
    const isFuture = new Date(futureDate) < today;

    expect(isPast).toBe(true);
    expect(isFuture).toBe(false);
  });
});
