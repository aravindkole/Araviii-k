import { Subject, Assignment, TimetableEvent, Exam, Note, FocusSession, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_demo_123',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  academicYear: 'Year 2 (Sophomore)',
  major: 'Computer Science & AI',
  institution: 'Global Institute of Technology',
  targetDailyStudyHours: 4.5,
  theme: 'light',
  demoMode: true,
  notificationsEnabled: true,
  aiApiKeyConfigured: false,
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub_cs301',
    name: 'Data Structures & Algorithms',
    code: 'CS301',
    color: '#4F46E5', // Indigo
    icon: 'Code2',
    instructor: 'Dr. Alan Turing',
    room: 'Hall B, Rm 304',
    credits: 4,
  },
  {
    id: 'sub_math205',
    name: 'Linear Algebra & Matrices',
    code: 'MATH205',
    color: '#0EA5E9', // Sky blue
    icon: 'Binary',
    instructor: 'Prof. Katherine Johnson',
    room: 'Science Complex 102',
    credits: 3,
  },
  {
    id: 'sub_ai401',
    name: 'Introduction to Machine Learning',
    code: 'AI401',
    color: '#8B5CF6', // Purple
    icon: 'Brain',
    instructor: 'Dr. Geoffrey Hinton',
    room: 'Turing Lab 01',
    credits: 4,
  },
  {
    id: 'sub_phy102',
    name: 'Electromagnetism & Waves',
    code: 'PHY102',
    color: '#10B981', // Emerald
    icon: 'Zap',
    instructor: 'Dr. Richard Feynman',
    room: 'Physics Wing 210',
    credits: 4,
  },
  {
    id: 'sub_eng210',
    name: 'Technical Writing & Ethics',
    code: 'ENG210',
    color: '#F59E0B', // Amber
    icon: 'BookOpen',
    instructor: 'Prof. Maya Angelou',
    room: 'Humanities 405',
    credits: 2,
  },
];

// Helper to calculate dates relative to today
const getRelativeDateStr = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Implement Dijkstra & A* Graph Pathfinding',
    subjectId: 'sub_cs301',
    dueDate: getRelativeDateStr(2),
    dueTime: '23:59',
    priority: 'urgent',
    status: 'in_progress',
    description: 'Build adjacency list representation, implement Min-Heap priority queue, and benchmark execution time against dense grids.',
    estimatedHours: 6,
    subtasks: [
      { id: 'st_1', title: 'Graph adjacency list representation', completed: true },
      { id: 'st_2', title: 'Min-heap priority queue implementation', completed: true },
      { id: 'st_3', title: 'A* heuristic function with Euclidean distance', completed: false },
      { id: 'st_4', title: 'Performance benchmark charts', completed: false },
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'asg_2',
    title: 'Eigenvalues & Diagonalization Problem Set #4',
    subjectId: 'sub_math205',
    dueDate: getRelativeDateStr(4),
    dueTime: '17:00',
    priority: 'high',
    status: 'todo',
    description: 'Solve questions 1 through 14 in Chapter 6. Prove orthogonality of eigenvectors for symmetric matrices.',
    estimatedHours: 4,
    subtasks: [
      { id: 'st_21', title: 'Questions 1-5 (Determinant method)', completed: false },
      { id: 'st_22', title: 'Questions 6-10 (Diagonal matrices)', completed: false },
      { id: 'st_23', title: 'Questions 11-14 (Proofs & Orthogonality)', completed: false },
    ],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'asg_3',
    title: 'Train Convolutional Neural Network on CIFAR-10',
    subjectId: 'sub_ai401',
    dueDate: getRelativeDateStr(7),
    dueTime: '23:59',
    priority: 'medium',
    status: 'todo',
    description: 'Implement PyTorch model with batch normalization, dropout, data augmentation, and achieve > 85% validation accuracy.',
    estimatedHours: 8,
    subtasks: [
      { id: 'st_31', title: 'Data loading and augmentation pipeline', completed: false },
      { id: 'st_32', title: 'Residual block architecture', completed: false },
      { id: 'st_33', title: 'Hyperparameter tuning & validation graphs', completed: false },
    ],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'asg_4',
    title: 'Maxwell Equations & Electromagnetic Wave Propagation Lab',
    subjectId: 'sub_phy102',
    dueDate: getRelativeDateStr(-1), // Overdue for demo demonstration
    dueTime: '12:00',
    priority: 'urgent',
    status: 'overdue',
    description: 'Calculate Poynting vector, analyze polarization reflections from dielectric boundary, and write 3-page lab report.',
    estimatedHours: 3.5,
    subtasks: [
      { id: 'st_41', title: 'Derive Poynting energy flow equation', completed: true },
      { id: 'st_42', title: 'Experimental dielectric error margin table', completed: true },
      { id: 'st_43', title: 'Conclusion and summary synthesis', completed: false },
    ],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'asg_5',
    title: 'AI Ethics in Autonomous Vehicles Research Paper',
    subjectId: 'sub_eng210',
    dueDate: getRelativeDateStr(10),
    dueTime: '20:00',
    priority: 'low',
    status: 'todo',
    description: 'Examine moral dilemmas in trolley problem implementations in production autonomous driving software.',
    estimatedHours: 5,
    subtasks: [
      { id: 'st_51', title: 'Find 5 peer-reviewed sources', completed: true },
      { id: 'st_52', title: 'Draft outline & thesis statement', completed: true },
      { id: 'st_53', title: 'Write 1500-word draft', completed: false },
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'asg_6',
    title: 'Binary Search Tree & Red-Black Tree Quiz Prep',
    subjectId: 'sub_cs301',
    dueDate: getRelativeDateStr(0), // Today
    dueTime: '16:00',
    priority: 'high',
    status: 'completed',
    description: 'Complete mock quiz on tree rotations and asymptotic insertion complexities.',
    estimatedHours: 2,
    subtasks: [
      { id: 'st_61', title: 'Review AVL vs Red-Black rotation rules', completed: true },
      { id: 'st_62', title: 'Solve 10 practice quiz questions', completed: true },
    ],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_TIMETABLE: TimetableEvent[] = [
  // Monday (1)
  {
    id: 'tt_1',
    subjectId: 'sub_cs301',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:30',
    location: 'Hall B, Rm 304',
    type: 'lecture',
  },
  {
    id: 'tt_2',
    subjectId: 'sub_math205',
    dayOfWeek: 1,
    startTime: '11:00',
    endTime: '12:30',
    location: 'Science Complex 102',
    type: 'lecture',
  },
  {
    id: 'tt_3',
    subjectId: 'sub_ai401',
    dayOfWeek: 1,
    startTime: '14:00',
    endTime: '16:00',
    location: 'Turing Lab 01',
    type: 'lab',
  },

  // Tuesday (2)
  {
    id: 'tt_4',
    subjectId: 'sub_phy102',
    dayOfWeek: 2,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Physics Wing 210',
    type: 'lecture',
  },
  {
    id: 'tt_5',
    subjectId: 'sub_eng210',
    dayOfWeek: 2,
    startTime: '13:00',
    endTime: '14:30',
    location: 'Humanities 405',
    type: 'seminar',
  },

  // Wednesday (3)
  {
    id: 'tt_6',
    subjectId: 'sub_cs301',
    dayOfWeek: 3,
    startTime: '09:00',
    endTime: '11:00',
    location: 'CS Lab 3',
    type: 'lab',
  },
  {
    id: 'tt_7',
    subjectId: 'sub_math205',
    dayOfWeek: 3,
    startTime: '11:30',
    endTime: '13:00',
    location: 'Science Complex 102',
    type: 'tutorial',
  },

  // Thursday (4)
  {
    id: 'tt_8',
    subjectId: 'sub_ai401',
    dayOfWeek: 4,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Turing Hall A',
    type: 'lecture',
  },
  {
    id: 'tt_9',
    subjectId: 'sub_phy102',
    dayOfWeek: 4,
    startTime: '14:00',
    endTime: '16:30',
    location: 'Physics Lab 04',
    type: 'lab',
  },

  // Friday (5)
  {
    id: 'tt_10',
    subjectId: 'sub_cs301',
    dayOfWeek: 5,
    startTime: '10:00',
    endTime: '11:30',
    location: 'Hall B, Rm 304',
    type: 'tutorial',
  },
  {
    id: 'tt_11',
    subjectId: 'sub_eng210',
    dayOfWeek: 5,
    startTime: '13:30',
    endTime: '15:00',
    location: 'Humanities 405',
    type: 'workshop',
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'ex_1',
    subjectId: 'sub_cs301',
    title: 'Midterm Exam: Algorithms & Complexity',
    examDate: getRelativeDateStr(6),
    startTime: '10:00',
    durationMinutes: 120,
    location: 'Main Examination Hall A',
    preparationStatus: 'revising',
    priority: 'urgent',
    targetScore: 90,
    topics: [
      { id: 'tp_1', title: 'Asymptotic Analysis & Big-O Notation', done: true },
      { id: 'tp_2', title: 'Divide and Conquer: Master Theorem', done: true },
      { id: 'tp_3', title: 'Dynamic Programming: Knapsack & LCS', done: false },
      { id: 'tp_4', title: 'Greedy Algorithms: Kruskal & Prim', done: false },
      { id: 'tp_5', title: 'Graph Traversals: BFS, DFS, Dijkstra', done: true },
    ],
    notes: 'Formula sheet will NOT be provided. Remember Master Theorem edge cases.',
  },
  {
    id: 'ex_2',
    subjectId: 'sub_math205',
    title: 'Linear Algebra Mid-Semester Test',
    examDate: getRelativeDateStr(14),
    startTime: '14:00',
    durationMinutes: 90,
    location: 'Science Complex Auditorium',
    preparationStatus: 'revising',
    priority: 'high',
    targetScore: 85,
    topics: [
      { id: 'tp_21', title: 'Gaussian Elimination & Matrix Inverses', done: true },
      { id: 'tp_22', title: 'Vector Spaces & Subspaces', done: true },
      { id: 'tp_23', title: 'Eigenvalues and Eigenvectors', done: false },
      { id: 'tp_24', title: 'Gram-Schmidt Orthonormalization', done: false },
    ],
    notes: 'Bring scientific calculator without programmable memory.',
  },
  {
    id: 'ex_3',
    subjectId: 'sub_ai401',
    title: 'Machine Learning Theory & Foundations',
    examDate: getRelativeDateStr(24),
    startTime: '09:00',
    durationMinutes: 150,
    location: 'Turing Computer Lab 01',
    preparationStatus: 'not_started',
    priority: 'medium',
    targetScore: 92,
    topics: [
      { id: 'tp_31', title: 'Linear & Logistic Regression derivations', done: false },
      { id: 'tp_32', title: 'Gradient Descent variants (SGD, Adam)', done: false },
      { id: 'tp_33', title: 'Loss functions: Cross-entropy, MSE', done: false },
      { id: 'tp_34', title: 'Overfitting, Regularization (L1/L2), Dropout', done: false },
    ],
    notes: 'Practical coding section will be on JupyterHub environment.',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: 'Dynamic Programming: Core Memoization Patterns',
    subjectId: 'sub_cs301',
    content: `# Dynamic Programming: Core Memoization Patterns

Dynamic programming solves complex problems by breaking them down into simpler subproblems and storing intermediate solutions.

## Two Essential Properties
1. **Optimal Substructure**: An optimal solution to any problem contains optimal solutions to subproblems.
2. **Overlapping Subproblems**: The same subproblems are solved repeatedly.

## Standard Template (Top-Down with Memoization)
\`\`\`python
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
\`\`\`

## Classic Problem Classes to Practice:
- **0/1 Knapsack Problem** (Pick or skip decision tree)
- **Longest Common Subsequence (LCS)**
- **Matrix Chain Multiplication**
- **Coin Change Problem**
`,
    tags: ['Algorithms', 'ExamPrep', 'CheatSheet', 'Python'],
    pinned: true,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'note_2',
    title: 'Matrix Eigenvalues & Diagonalization Quick Ref',
    subjectId: 'sub_math205',
    content: `# Matrix Eigenvalues & Diagonalization

## Definition
For an $n \\times n$ matrix $A$, a scalar $\\lambda$ is an **eigenvalue** if there exists a non-zero vector $v$ such that:
$$A v = \\lambda v$$

## Finding Eigenvalues:
1. Form the characteristic equation: $\\det(A - \\lambda I) = 0$
2. Solve the polynomial roots for $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$
3. For each $\\lambda_i$, find basis of nullspace: $(A - \\lambda_i I)v = 0$

> **Key Rule**: A matrix is diagonalizable if and only if the sum of dimensions of its eigenspaces equals $n$.
`,
    tags: ['Math', 'LinearAlgebra', 'Formulas'],
    pinned: true,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'note_3',
    title: 'Gradient Descent & Learning Rate Schedulers',
    subjectId: 'sub_ai401',
    content: `# Gradient Descent Optimizers in Deep Learning

## Optimizer Comparison
- **SGD (Stochastic Gradient Descent)**: Fast per step, noisy trajectory, prone to saddle points.
- **Momentum**: Adds fraction of previous update: $v_t = \\beta v_{t-1} + (1-\\beta) g_t$.
- **Adam (Adaptive Moment Estimation)**: Combines Momentum with RMSProp.

\`\`\`python
# PyTorch Cosine Annealing Scheduler
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)
\`\`\`
`,
    tags: ['MachineLearning', 'PyTorch', 'Optimization'],
    pinned: false,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  {
    id: 'foc_1',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_cs301',
    taskTitle: 'Dijkstra Priority Queue Implementation',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'foc_2',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_cs301',
    taskTitle: 'A* Pathfinding Debugging',
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: 'foc_3',
    durationMinutes: 5,
    type: 'short_break',
    timestamp: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 'foc_4',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_math205',
    taskTitle: 'Eigenvector Problem Set',
    timestamp: new Date(Date.now() - 26 * 3600000).toISOString(), // Yesterday
  },
  {
    id: 'foc_5',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_math205',
    taskTitle: 'Diagonalization proofs',
    timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'foc_6',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_ai401',
    taskTitle: 'PyTorch CIFAR-10 data loader',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'foc_7',
    durationMinutes: 25,
    type: 'pomodoro',
    subjectId: 'sub_phy102',
    taskTitle: 'Poynting vector calculations',
    timestamp: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];
