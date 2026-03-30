AGENT OPERATING MANUAL

Project: Sistema de Gestão de Alunos e Matrículas
Version: 2.0
Status: Active

This document defines how AI agents must behave when generating, modifying or reviewing code in this repository.

1. Source of Truth Hierarchy

When making decisions, follow this priority order:

specs/system/*
specs/features/*
This agents.md
.agents/skills
Local code context

If conflicts occur, higher priority documents override lower ones.

Never assume behavior outside defined specifications.

2. Architectural Enforcement Rules

The agent must:

Follow Clean Architecture strictly.
Respect modular monolith structure.
Keep domain layer framework-agnostic.
Avoid placing business logic in route handlers.
Use Prisma as the only ORM.
Use PostgreSQL (Supabase Docker or hosted) as database.
Support online multi-user system.
Implement authentication and authorization.
Separate public (student) and private (admin) contexts.

The agent must not:

Introduce microservices.
Introduce unnecessary abstractions.
Overengineer.
Bypass domain rules for convenience.

3. System Context

This system is:

Online and multi-user
Used by students (public users) and administrators (internal users)
Student Capabilities
Self-register account
Login/logout
Update personal data
Enroll in activities (matrículas)
View enrolled activities
Track status (active, pending, canceled)
Admin Capabilities
Manage student records
Edit or deactivate students
Create and manage activities
Manage enrollments (approve, cancel, update)
View system data

4. Code Generation Standards
4.1 Language & Typing
Use TypeScript strict mode.
Never use any.
Prefer explicit types.
Use Zod for validation.
4.2 Module Structure

Every feature must follow:

src/modules/<feature>/
domain/
application/
infrastructure/
presentation/

No deviation allowed.

4.3 Core Modules (Expected)
student
auth
activity
enrollment
4.4 Layer Boundaries
Domain cannot import Prisma or external libs.
Domain contains entities, value objects, and rules.
Application contains use cases.
Infrastructure implements repositories and services.
Presentation handles HTTP and calls application layer only.

5. API Rules Enforcement
All responses must use envelope format:
{
  data: ...,
  error: null,
  meta?: {}
}
Use correct HTTP status codes.
Do not expose stack traces.
Validate all input using Zod before executing use cases.
All protected routes must require authentication.

6. Authentication & Authorization

The system MUST include:

JWT-based authentication
Secure password hashing
Session validation
Roles
STUDENT
ADMIN
Rules
Students can only access their own data
Admins can access all data
Authorization must be enforced at application layer

7. Performance Discipline
Avoid N+1 queries.
Use Prisma relations properly.
Paginate list endpoints.
Avoid loading unnecessary data.
Handle batch operations safely.

8. Security Discipline
Validate all inputs (Zod)
Sanitize user data when needed
Hash passwords (never store plain text)
Protect routes with middleware
Avoid leaking sensitive data in responses

9. Code Modification Policy

When modifying code:

Do not break module boundaries.
Do not refactor unrelated modules.
Preserve architecture consistency.
Maintain separation between student and admin logic.

10. Skill Usage

Skills are located in:

specs/skills/

Rules:

If a skill exists, it must be used.
Skills must respect architecture.
Skills cannot override system constraints.
If no skill exists, follow architecture rules directly.

Available skills:

create-module
create-usecase
create-repository
create-route
generate-tests
create-zod-schema

11. Refactoring Rules

Allowed:

Improve readability
Improve typing
Improve performance within constraints

Not allowed:

Change architecture
Replace Prisma
Remove authentication
Break role separation

12. Error Handling Standard

Use structured errors:

DomainError
ValidationError
NotFoundError
ConflictError
UnauthorizedError
ForbiddenError

Errors must be mapped in presentation layer only.

13. Logging Rules
Log authentication events
Log admin actions (important operations)
Do not log passwords or sensitive data
Do not log full student records unnecessarily

14. Domain Rules (Critical)
A student must have a valid account before enrolling
Enrollment must reference valid student and activity
Prevent duplicate enrollments (if not allowed)
Activities must define capacity (optional rule)
Enrollment status must be controlled via domain logic

15. Anti-Patterns to Avoid
Fat controllers
Business rules in routes
Direct Prisma usage in presentation
Mixing student and admin logic
Cross-module violations
Authorization checks outside application layer

16. Future-Proofing Rules

Prepare for:

Scaling number of users
Background jobs (e.g., enrollment processing)
Notification system
Reporting dashboards

Do not implement prematurely.

17. Agent Behavior Mode

Default behavior mode:

Conservative
Minimal
Deterministic
Specification-driven
Security-aware

Always prioritize:

Correctness
Data integrity
Clear separation of responsibilities

Never introduce features not explicitly required.