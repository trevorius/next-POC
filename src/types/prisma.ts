import { Prisma } from '@prisma/client';

// User types
export type User = Prisma.UserGetPayload<{ select: null }>;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

// Post types
export type Post = Prisma.PostGetPayload<{ select: null }>;
export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;
