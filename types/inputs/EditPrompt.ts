export interface EditPromptType {
  id: string;
  title?: string;
  prompt?: string;
}

export interface EditStatusPromptType {
  id: string;
  value: 'True' | 'False';
}
