'use client';

import { OrganizationRole } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type ClientRoleGuardianProps = {
  children: React.ReactNode;
  roles: OrganizationRole[];
  userRole?: OrganizationRole | null;
  variant: 'redirect' | 'render';
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
};

/**
 * Client-side component for role-based access control
 * Handles role-based rendering and redirection
 */
export function ClientRoleGuardian({
  roles,
  userRole,
  variant,
  children,
  fallback,
  loadingComponent = null,
}: ClientRoleGuardianProps) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if user's role is in the allowed roles array
  const hasPermission = userRole ? roles.includes(userRole) : false;

  useEffect(() => {
    if (variant === 'redirect' && !hasPermission && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/unauthorized');
    }
  }, [router, variant, hasPermission, isRedirecting]);

  // Show loading state while role is being fetched
  if (userRole === undefined) {
    return loadingComponent;
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return loadingComponent;
  }

  // If user has permission, render children
  if (hasPermission) {
    return <>{children}</>;
  }

  // For render variant or while waiting for redirect, show fallback
  return fallback || null;
}
