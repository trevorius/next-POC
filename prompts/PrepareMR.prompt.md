# Preparation for Merge Request

in the preprompt message you were given the branch to merge and the branch to merge into.

# confirm work is ready to merge

prepare your self by analysing what scripts are available in project.json

1. run prettier

- if prettier is installed and has a config file, run it
- if the prettier fails, fix the issues and repeat step 1
- if the prettier succeeds, move to next step

2. run eslint

- if eslint is installed and has a config file, run it
- if the eslint fails, fix the issues and repeat step 2
- if the eslint succeeds, move to next step

3. run tests

- if there is a test script, run it
- if the tests fail, fix the issues and repeat step 2
- if the tests succeed, move to next step

4. attempt a build of the project

- if the build fails, fix the issues and repeat step 4
- if the build succeeds, move to next step

5. REPEAT STEPS 1-4 until the build succeeds

# prepare merge request message

1. analyse commit messages
2. analyse code differences
3. write a merge request message in a mark down code block so it is copyable and pasteable into the merge request message on github or gitlab

- use gitmojis to describe the changes use (gitmoji.dev as a reference website)
- use markdown to format the message
- use bullet points to list the changes
- use emojis to highlight the changes
- include a checkbox tests section for the reviewer elements that they need to test.

# Merge request message examples

## example 1 :

```markdown
# 🔧 Test Infrastructure Setup and Authentication Tests

## 🚀 Core Features

- ✨ Implemented comprehensive test infrastructure
- 🧪 Added authentication flow tests
- 🔒 Added user creation and sign-in test coverage
- 🛠️ Configured Jest with TypeScript and ESM support

## 📝 Detailed Changes

### Test Infrastructure

- 🔧 Added Jest configuration with TypeScript and ESM support
- 🎯 Configured SWC for optimized test execution
- 🔄 Set up test environment with proper mocking
- 📚 Added necessary testing dependencies

### Test Implementation

- ✅ Added authentication flow tests:
  - User creation test
  - Sign-in functionality test
- 🔍 Implemented proper mocking for:
  - Prisma client
  - NextAuth.js
- 🧹 Fixed ESLint issues and type safety

### Development Infrastructure

- 📦 Added test-related dependencies
- 🔧 Configured proper TypeScript support
- 🚀 Set up fast test execution with SWC

## 🧪 Reviewer Checklist

- [ ] Verify test coverage for user creation
- [ ] Check sign-in test implementation
- [ ] Verify Prisma mocking setup
- [ ] Review NextAuth.js mocking approach
- [ ] Run the test suite locally
- [ ] Check ESLint compliance
- [ ] Verify build process completes successfully

## 📋 Technical Notes

- Uses Jest with SWC for fast execution
- Implements proper TypeScript types
- Follows testing best practices
- All linting checks pass
- Build succeeds without warnings

## 🔄 Migration Notes

- Run `npm install` to install new dependencies
- Run `npm test` to verify test setup
```

### example 2 :

```markdown
Ctrl+K to generate a command

# 🔒 Authentication Strategy Implementation and Project Setup

## 🚀 Core Features

- ✨ Implemented complete authentication flow with NextAuth.js
- 🗃️ Enhanced Prisma schema with User, Organization, and OrganizationMember models
- 🎨 Added comprehensive UI component library with Radix UI integration
- 🔐 Implemented secure password hashing system

## 📝 Detailed Changes

### Authentication & Security

- 🔒 Refactored authentication logic with enhanced user login experience
- 🔑 Added password hashing utility for secure credential storage
- 📤 Implemented LogoutButton component
- 🏗️ Enhanced User model with password and salt fields

### Database & Models

- 🗃️ Enhanced Prisma schema with Organization support
- 🌱 Added Prisma seeding script
- 📊 Implemented OrganizationMember relationships

### UI Components

- 🎨 Added core UI components:
  - Alert component
  - Button component
  - Card component
  - Input component
  - Label component
- 🔧 Integrated Radix UI components for better accessibility

### Development Infrastructure

- 📚 Updated project dependencies
- 🔧 Fixed linting and build errors
- 📝 Enhanced development guidelines
- 🚀 Added merge request preparation guide

## 🧪 Reviewer Checklist

- [ ] Test complete authentication flow (login/logout)
- [ ] Verify password hashing functionality
- [ ] Check Organization-User relationships in Prisma
- [ ] Test UI components in different scenarios
- [ ] Run database migrations and seed script
- [ ] Verify build process completes successfully
- [ ] Check responsive design of UI components
- [ ] Test error handling and validation
- [ ] Review security measures implementation

## 📋 Technical Notes

- Uses NextAuth.js v5 with App Router
- Implements server-side authentication
- Follows TypeScript best practices
- Uses Prisma for database management
- Integrates Radix UI for accessible components
- All linting checks pass
- Build succeeds without warnings

## 🔄 Migration Notes

- Run Prisma migrations
- Execute seed script for initial data
- Update environment variables for auth configuration
```

### example 3 :

```markdown

```
