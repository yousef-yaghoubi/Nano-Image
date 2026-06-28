export {};

declare global {
  interface UserPublicMetadata {
    role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN'; // Your role types
  }

  interface SessionPublicMetadata {
    role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN';
  }
}

import '@tanstack/react-table';
import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    translationKey?: string;
  }
}
