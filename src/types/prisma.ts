import { Prisma } from '@prisma/client';

// User types
export type User = Prisma.UserGetPayload<{ select: null }>;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

// Organization types
export type Organization = Prisma.OrganizationGetPayload<{ select: null }>;
export type OrganizationCreateInput = Prisma.OrganizationCreateInput;
export type OrganizationUpdateInput = Prisma.OrganizationUpdateInput;

// OrganizationMember types
export type OrganizationMember = Prisma.OrganizationMemberGetPayload<{
  select: null;
}>;
export type OrganizationMemberCreateInput =
  Prisma.OrganizationMemberCreateInput;
export type OrganizationMemberUpdateInput =
  Prisma.OrganizationMemberUpdateInput;
