import { Prisma } from '@prisma/client';

// User types
export type User = Prisma.UserGetPayload<{}>;
export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;

// Post types
export type Post = Prisma.PostGetPayload<{}>;
export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;
