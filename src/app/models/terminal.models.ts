export interface TerminalTask {
  id: number;
  description: string;
  task: string;
  expectedCommand: string;
}

export interface TaskResult {
  command: string;
  correct: boolean;
}

export interface TerminalLine {
  type: 'text' | 'task' | 'command' | 'output' | 'error' | 'success' | 'warning';
  content: string;
}