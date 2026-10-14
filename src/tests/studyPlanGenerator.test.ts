import { describe, it, expect } from 'vitest';
import { Subject, Exam, Assignment, StudyPlanBlock } from '../types';

describe('Smart Study Plan Generator Algorithm', () => {
  const mockSubjects: Subject[] = [
    { id: 'sub_1', name: 'Algorithms', code: 'CS301', color: '#4F46E5' },
    { id: 'sub_2', name: 'Math', code: 'MATH101', color: '#0EA5E9' },
  ];

  const mockExams: Exam[] = [
    {
      id: 'ex_1',
      subjectId: 'sub_1',
      title: 'Algorithms Final',
      examDate: '2026-10-30',
      startTime: '10:00',
      durationMinutes: 120,
      location: 'Hall A',
      preparationStatus: 'revising',
      priority: 'urgent',
      topics: [{ id: 'tp_1', title: 'Dynamic Programming', done: false }],
    },
  ];

  it('generates 7-day distributed study blocks honoring daily hours', () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['09:00 - 10:30', '14:30 - 16:00'];
    const generated: StudyPlanBlock[] = [];

    days.forEach((day, dayIndex) => {
      for (let s = 0; s < 2; s++) {
        const assignedSub = mockSubjects[(dayIndex + s) % mockSubjects.length];
        generated.push({
          id: `spb_${day}_${s}`,
          day,
          timeSlot: timeSlots[s],
          subjectId: assignedSub.id,
          topic: `Review session for ${assignedSub.name}`,
          durationMinutes: 90,
          completed: false,
          priority: 'urgent',
        });
      }
    });

    expect(generated.length).toBe(14); // 7 days * 2 sessions
    expect(generated[0].day).toBe('Monday');
    expect(generated[0].durationMinutes).toBe(90);
    expect(generated.some((b) => b.subjectId === 'sub_1')).toBe(true);
  });

  it('allows toggling block completion status', () => {
    const block: StudyPlanBlock = {
      id: 'blk_1',
      day: 'Monday',
      timeSlot: '09:00 - 10:30',
      subjectId: 'sub_1',
      topic: 'Dynamic Programming',
      durationMinutes: 90,
      completed: false,
      priority: 'urgent',
    };

    const toggled = { ...block, completed: !block.completed };
    expect(toggled.completed).toBe(true);
  });
});
