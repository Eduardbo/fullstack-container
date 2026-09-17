---
name: nestjs-api-workflow
description: "Use when working on NestJS backend bugs, auth flows, DTO validation, controllers, services, DAO logic, or API changes in this repository. Follow a step-by-step debug-and-fix workflow: inspect the request path, reproduce the issue, patch the root cause, and verify with focused tests or lint/build checks."
---

# NestJS API Workflow

## Purpose

Use this skill when the task is to fix or implement backend behavior in this NestJS project. It is optimized for the repository structure under `src/`, especially authentication, DTO validation, and database-bound service code.

## Required workflow

### 1. Establish the request path
Before editing code, identify the actual flow the bug travels through:
- controller entry point
- service logic
- DAO/database layer
- auth guard or JWT checks
- DTO validation or transformation

Typical checks in this repo:
- `src/app.module.ts` for module wiring
- `src/auth/**` for login, registration, and guard behavior
- `src/users/**` for persistence and user operations
- DTO files in `src/auth/dto/**` for payload validation

### 2. Reproduce or localize the issue
Use the smallest possible verification command that exercises the failing behavior.

Project checks:
- `npm test -- --runInBand`
- `npm run test:e2e`
- `npm run lint`
- `npm run build`

When the bug is not already covered by tests:
- add a focused failing test first
- keep the failing case limited to the smallest relevant behavior
- do not broaden scope while debugging

### 3. Trace the root cause
Follow the code path without guessing.

Decision points:
- If the issue is in authentication, inspect guards, decorators, and JWT token handling first.
- If the issue is in data access, inspect DAO/service interaction and query logic next.
- If the issue is request validation, inspect DTO definitions and validation pipes before changing business logic.
- If the issue is a runtime exception, check the exact service/controller line where the error originates and trace backward to the source data.

Check the smallest number of files needed to confirm the root cause.

### 4. Make the minimal fix
Apply one root-cause fix at the correct layer:
- controller logic only when it is the actual fault
- service logic when business logic is wrong
- DAO or query code when persistence or data mapping is wrong
- DTOs or validation only when schema or input rules are wrong
- auth guards or decorators when the access problem is in authentication

Avoid unrelated refactors, opportunistic cleanup, or broad style changes in the same patch.

### 5. Verify with evidence
After the fix:
- rerun the focused failing test or minimal reproduction
- if relevant, run the related suite or lint/build check
- confirm the fix addresses the original symptom without widening regressions

## Quality bar

A change is ready when all of the following are true:
- the root cause is identified and explained in the code path
- the fix is scoped to the actual fault
- behavior is validated with a targeted test or command
- no unrelated files are modified
- the patch remains understandable to the next developer

## Repo-specific guidance

This project is a NestJS API with a modular structure and a MySQL-backed user/auth flow. Keep the following in mind while working here:
- prefer explicit module boundaries and clear dependency flow
- validate payload shapes before trusting incoming requests
- verify auth and user operations at the service layer, not only in controllers
- trace database interaction carefully; query bugs often hide in DAO/service integration
- keep test coverage focused on real behavior instead of mock-only assertions

## Useful commands

```bash
npm install
npm run start:dev
npm run test -- --runInBand
npm run test:e2e
npm run lint
npm run build
```

## Example prompts

- "Diagnose the login failure and trace it from controller to auth service and DB logic."
- "Add a failing test for the registration flow and then fix the root cause in the auth code."
- "Review the JWT guard flow and confirm whether the user is being attached correctly in the request context."
- "Find the root cause of the invalid user payload handling and patch the DTO/service boundary only."

## Related customizations to create next

- a repository-specific instruction file for NestJS API code quality and authentication conventions
- a prompt for generating DTOs, services, and DAO layers consistent with this project
- a debugging skill focused on database-backed API issues
- a test-writing skill for NestJS unit and e2e coverage in this repo
