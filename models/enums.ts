export const Role = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

export const IsPublic = {
  True: 'True',
  False: 'False',
  Pending: 'Pending',
} as const;

export type IsPublicType = (typeof IsPublic)[keyof typeof IsPublic];
