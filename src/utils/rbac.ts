// utils/rbac.ts
export const ROLES = {
    ADMIN: 'ADMIN',
    STAFF: 'STAFF',
    CUSTOMER: 'CUSTOMER',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const hasRole = (userRole: string | undefined, allowedRoles: Role[]) => {
    return userRole ? allowedRoles.includes(userRole as Role) : false;
};