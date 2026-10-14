import { AIResponse, Subtask } from '../types';

export interface AIServiceOptions {
  mode: 'explain' | 'summarize' | 'quiz' | 'breakdown' | 'revision';
  prompt: string;
  context?: string;
  subjectName?: string;
}

export const AIService = {
  /**
   * Process an AI request. In Demo Mode, uses high-fidelity deterministic academic logic
   * clearly labeled as Local AI / Demo Mode.
   */
  async requestStudyHelp(options: AIServiceOptions): Promise<AIResponse> {
    // Artificial small delay for realistic UX and loading indicator
    await new Promise((resolve) => setTimeout(resolve, 800));

    const { mode, prompt, context, subjectName } = options;

    if (!prompt.trim() && !context?.trim()) {
      throw new Error('Please provide a question, topic, or note content for the AI assistant.');
    }

    switch (mode) {
      case 'explain':
        return this.generateExplanation(prompt, subjectName);
      case 'summarize':
        return this.generateSummary(prompt || (context || ''));
      case 'quiz':
        return this.generateQuiz(prompt, subjectName);
      case 'breakdown':
        return this.generateTaskBreakdown(prompt);
      case 'revision':
        return this.generateRevisionPlan(prompt, subjectName);
      default:
        return {
          answer: `Here is a helpful overview for **${prompt}**:\n\nFocus on core principles, solve representative practice exercises, and verify edge conditions.`,
          isDemo: true,
        };
    }
  },

  generateExplanation(topic: string, subject?: string): AIResponse {
    const cleanTopic = topic.trim();
    return {
      answer: `### 🧠 Academic Explanation: **${cleanTopic}**
${subject ? `*Subject Context: ${subject}*\n` : ''}
#### 1. Core Concept Overview
**${cleanTopic}** is a fundamental concept designed to address specific trade-offs between efficiency, correctness, and resource utilization. At its core, it enables systems or algorithms to scale predictably.

#### 2. How It Works (Step-by-Step)
1. **Input & Invariant Formulation**: Define the starting state and the invariant rule that must remain true at each iteration.
2. **State Transition**: Apply the recursive relation or transfer function to move from step $k$ to step $k+1$.
3. **Termination & Convergence**: The algorithm or proof concludes once boundary conditions are reached.

#### 3. Real-World Applications
- **Distributed Systems & Computing**: High-concurrency operations and consensus.
- **Data Engineering**: Indexing, query optimization, and memory hierarchy caching.
- **Machine Learning**: Backpropagation graphs and parameter optimization.

#### 4. Common Exam Pitfalls
> ⚠️ **Watch out for:**
> - Edge cases where input $n = 0$ or negative boundaries exist.
> - Conflating asymptotic worst-case bounds $\\mathcal{O}(n)$ with average-case bounds $\\Theta(n)$.
> - Off-by-one errors in pointer manipulation and array indices.`,
      suggestedActions: [
        'Generate 3 practice questions on this topic',
        'Break down this topic into a 3-day revision plan',
        'Save explanation to your Subject Notes',
      ],
      isDemo: true,
    };
  },

  generateSummary(text: string): AIResponse {
    const preview = text.slice(0, 150).replace(/(\r\n|\n|\r)/gm, ' ');
    return {
      answer: `### 📝 Key Insights & Executive Summary

#### 🎯 Central Thesis
The source material explores fundamental theoretical principles and practical execution patterns: *"${preview}..."*

#### 📌 High-Yield Takeaways
- **Key Definition**: Clarified the primary abstraction and mathematical definitions needed for exam recall.
- **Operational Workflow**: Highlighted the standard step-by-step procedure to solve related numerical or coding problems.
- **Comparative Trade-offs**: Summarized performance implications, memory overheads, and time complexities.

#### ⚡ Quick Formula / Rule Sheet
- **Primary Rule**: Ensure boundary checks and base cases are satisfied first.
- **Recurrence Relation**: Check if overlapping subproblems can be cached.
- **Verification Criterion**: Always validate against sample corner inputs.`,
      suggestedActions: [
        'Create flashcards from this summary',
        'Add to Revision Notes',
      ],
      isDemo: true,
    };
  },

  generateQuiz(topic: string, subject?: string): AIResponse {
    return {
      answer: `### 🎯 Practice Quiz: ${topic}
${subject ? `*Subject: ${subject}*\n` : ''}
Test your active recall with these exam-style questions:

---

**Question 1: Conceptual Understanding**
What is the primary condition required before applying this technique?
- A) All inputs must be uniformly distributed
- B) Optimal substructure and valid boundary constraints *(Correct)*
- C) The algorithm must operate in constant memory $\\mathcal{O}(1)$
- D) Only acyclic inputs are permitted

*Explanation*: Without optimal substructure, solutions to subproblems cannot be combined to form a globally optimal solution.

---

**Question 2: Complexity Analysis**
What is the worst-case time complexity under standard assumptions?
- A) $\\mathcal{O}(\\log n)$
- B) $\\mathcal{O}(n \\log n)$ *(Correct)*
- C) $\\mathcal{O}(n^2)$
- D) $\\mathcal{O}(2^n)$

*Explanation*: With a balanced partitioning scheme or priority queue, tree height is bounded by $\\log n$ across $n$ operations.

---

**Question 3: Problem Solving Application**
Which scenario would cause performance degradation to degenerate?
- A) When input data is already sorted in reverse order
- B) When recursion depth exceeds available stack frames
- C) Both A and B *(Correct)*

*Explanation*: Degenerate pivot choices or unchecked recursion depth degrade performance and cause stack overflows.`,
      suggestedActions: [
        'Take another quiz on related concepts',
        'Review weak areas with AI Explainer',
      ],
      isDemo: true,
    };
  },

  generateTaskBreakdown(assignmentTitle: string): AIResponse {
    return {
      answer: `### 📋 Intelligent Task Decomposition for: "${assignmentTitle}"

To prevent last-minute procrastination, here is an actionable 4-step milestone breakdown:

1. **Phase 1: Research & Problem Scoping (20% of effort)**
   - Review assignment guidelines, rubric, and test cases.
   - Set up project repository, skeleton files, and unit test harness.

2. **Phase 2: Core Implementation & Algorithm Logic (45% of effort)**
   - Implement the core business logic / mathematical formulas.
   - Validate against basic sample inputs and baseline data.

3. **Phase 3: Edge Case Testing & Optimization (20% of effort)**
   - Test extreme boundaries: empty inputs, maximum constraints, malformed data.
   - Refactor code for readability and runtime efficiency.

4. **Phase 4: Documentation & Submission Check (15% of effort)**
   - Write lab report / executive summary.
   - Double-check file naming conventions and export formats.`,
      suggestedActions: [
        'Add these milestones directly to Assignment Subtasks',
        'Schedule Pomodoro sessions for Phase 1 & 2',
      ],
      isDemo: true,
    };
  },

  generateRevisionPlan(examTitle: string, subject?: string): AIResponse {
    return {
      answer: `### 📅 Spaced Repetition Revision Schedule for: ${examTitle}
${subject ? `*Target Subject: ${subject}*\n` : ''}
Based on cognitive science and forgetting curves:

| Day | Focus Topic | Activity | Recommended Duration |
| :--- | :--- | :--- | :--- |
| **Day 1** | Foundations & Definitions | Flashcards & active recall review | 60 mins |
| **Day 2** | Core Theorems & Proofs | Whiteboard derivations from scratch | 90 mins |
| **Day 3** | Past Exam Paper 1 | Timed problem solving without notes | 120 mins |
| **Day 4** | Weakness Remediation | Review missed questions with AI | 75 mins |
| **Day 5** | Formula Sheet & Mind Map | Final high-level synthesis | 45 mins |`,
      suggestedActions: [
        'Add schedule blocks to Study Planner',
        'Set daily focus targets',
      ],
      isDemo: true,
    };
  },

  /**
   * Parse suggested subtasks into structured objects
   */
  suggestSubtasks(assignmentTitle: string): Subtask[] {
    return [
      { id: `st_${Date.now()}_1`, title: `Review rubric & requirements for ${assignmentTitle}`, completed: false },
      { id: `st_${Date.now()}_2`, title: 'Implement core model / draft initial outline', completed: false },
      { id: `st_${Date.now()}_3`, title: 'Test edge cases & verify numerical outputs', completed: false },
      { id: `st_${Date.now()}_4`, title: 'Format citations, proofread, and final export', completed: false },
    ];
  },
};
