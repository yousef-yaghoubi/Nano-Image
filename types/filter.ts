export interface FilterOption {
  id: number;
  label: string;
  options: string[];
}

export interface ActiveFilter {
  type: 'tag' | 'search';
  value: string;
  displayValue: string;
}