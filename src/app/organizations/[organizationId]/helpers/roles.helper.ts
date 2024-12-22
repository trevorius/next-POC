import { OrganizationRole } from '@prisma/client';

export const orderedRoles: OrganizationRole[] = [
  OrganizationRole.OWNER,
  OrganizationRole.ADMIN,
  OrganizationRole.USER,
] as const;

/**
 * Checks if a role can manage another role based on hierarchy
 * @param managerRole - The role attempting to manage
 * @param targetRole - The role being managed
 * @returns boolean indicating if management is allowed
 */
export function canManageRole(
  managerRole: OrganizationRole,
  targetRole: OrganizationRole
): boolean {
  return (
    managerRole === OrganizationRole.OWNER ||
    orderedRoles.indexOf(managerRole) < orderedRoles.indexOf(targetRole)
  );
}

/**
 * Gets all roles that can be managed by the given role
 * @param currentRole - The role to check management permissions for
 * @returns Array of roles that can be managed
 */
export function getManageableRoles(
  currentRole: OrganizationRole
): OrganizationRole[] {
  return orderedRoles.filter((role) => canManageRole(currentRole, role));
}

/**
 * Validates if a role change operation is allowed
 * @param currentUserRole - Role of the user attempting the change
 * @param targetUserCurrentRole - Current role of the user being modified
 * @param targetUserNewRole - Proposed new role for the user
 * @returns boolean indicating if the role change is allowed
 */
export function isRoleChangeAllowed(
  currentUserRole: OrganizationRole,
  targetUserCurrentRole: OrganizationRole,
  targetUserNewRole: OrganizationRole
): boolean {
  // Can't modify your own role
  if (targetUserCurrentRole === currentUserRole) return false;

  // Must be able to manage both the current and new role
  return (
    canManageRole(currentUserRole, targetUserCurrentRole) &&
    canManageRole(currentUserRole, targetUserNewRole)
  );
}

/**
 * Gets the role level in the hierarchy (lower number = higher privilege)
 * @param role - The role to get the level for
 * @returns number indicating the role's level in the hierarchy
 */
export function getRoleLevel(role: OrganizationRole): number {
  return orderedRoles.indexOf(role);
}
