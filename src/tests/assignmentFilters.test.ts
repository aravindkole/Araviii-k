import { describe, it, expect } from 'vitest';
import { Assignment } from '../types';

describe('Assignment Filtering & Subtasks', () => {
  const sampleAssignments: Assignment[] = [
    {
      id: 'asg_1',
      title: 'Graph Algorithms Problem Set',
      subjectId: 'sub_cs301',
      dueDate: '2026-10-20',
      priority: 'urgent',
      status: 'in_progress',
      estimatedHours: 4,
      subtasks: [
        { id: 'st_1', title: 'Part 1', completed: true },
        { id: 'st_2', title: 'Part 2', completed: false },
      ],
      createdAt: '2026-10-10',
    },
    {
      id: 'asg_2',
      title: 'Linear Algebra Matrix Quiz',
      subjectId: 'sub_math205',
      dueDate: '2026-10-22',
      priority: 'medium',
      status: 'todo',
      estimatedHours: 2,
      subtasks: [],
      createdAt: '2026-10-11',
    },
    {
      id: 'asg_3',
      title: 'Machine Learning Term Paper',
      subjectId: 'sub_ai401',
      dueDate: '2026-10-25',
      priority: 'high',
      status: 'completed',
      estimatedHours: 8,
      subtasks: [{ id: 'st_3', title: 'Draft outline', completed: true }],
      createdAt: '2026-10-08',
    },
  ];

  it('filters assignments by search keyword', () => {
    const query = 'matrix';
    const filtered = sampleAssignments.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('asg_2');
  });

  it('filters assignments by priority', () => {
    const urgentTasks = sampleAssignments.filter((a) => a.priority === 'urgent');
    expect(urgentTasks.length).toBe(1);
    expect(urgentTasks[0].id).toBe('asg_1');
  });

  it('filters assignments by status', () => {
    const completedTasks = sampleAssignments.filter((a) => a.status === 'completed');
    expect(completedTasks.length).toBe(1);
    expect(completedTasks[0].id).toBe('asg_3');
  });

  it('marks assignment as completed when all subtasks are finished', () => {
    const asg = { ...sampleAssignments[0] };
    const updatedSubtasks = asg.subtasks.map((st) => ({ ...st, completed: true }));
    const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
    const newStatus = allDone ? 'completed' : asg.status;

    expect(newStatus).toBe('completed');
  });
});
