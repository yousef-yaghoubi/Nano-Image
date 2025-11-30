export {};

declare global {
  interface UserPublicMetadata {
    role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN'; // Your role types
  }

  interface SessionPublicMetadata {
    role: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN';
  }
}
