export interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number; // The correct option index (for scoring)
  explanation: string; // Used for the results review
}

// Data structure to hold the user's selected answers in the MCQ component
// Example: { 1: 0, 2: 1, 3: 2 } => Question 1 answer is option 0, etc.
export type McqAnswers = Record<number, number | undefined>;

// Interface for the detailed results calculated after the MCQ phase
export interface McqResult {
  score: number; // Overall percentage score (0-100)
  correctCount: number;
  totalQuestions: number;
  // Detailed breakdown of each question's outcome
  results: {
    questionId: number;
    questionText: string;
    correct: boolean;
    explanation: string;
  }[];
}