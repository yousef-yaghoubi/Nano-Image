export const Role = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const status = {
  True: 'True',
  False: 'False',
  Pending: 'Pending',
} as const;

export type statusType = (typeof status)[keyof typeof status];
