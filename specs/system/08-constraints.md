SYSTEM CONSTRAINTS

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. Technical Constraints
ORM restricted to: Prisma
Database restricted to: PostgreSQL (via Supabase Docker or hosted)
State management restricted to:
React Server Components
useState / useReducer
Zustand (only if necessary)
Styling restricted to: TailwindCSS + shadcn/ui
Component library restricted to: shadcn/ui
Language restricted to: TypeScript (strict mode enabled)
Strictly forbidden:
Usage of any in TypeScript
Direct SQL outside Prisma (unless justified and isolated)
Global mutable in-memory state
External SaaS dependencies (except future controlled integrations like WhatsApp)
Supabase JS SDK in domain/application layers
Server-side session storage
2. Architectural Constraints
Must follow Clean Architecture
Must be a Modular Monolith
Domain layer must be framework-agnostic
No business logic in controllers or route handlers
All modules must be isolated and self-contained
Database access only via repository pattern
Dependency direction must always point inward
Additional constraints (NEW)
Authentication and authorization must be enforced at application layer
Domain must model:
enrollment lifecycle
capacity constraints
approval workflows
No cross-module domain leakage
No shared mutable state between modules
3. Operational Constraints
System is online-first (web-based)
Must support deployment in:
local environment (Docker)
cloud environment (future)
Requirements:
Must run via Node.js
Must support Linux environments
Must support HTTPS in production
Must not rely on offline-only assumptions
Removed constraints (IMPORTANT)
❌ No longer local-only
❌ No longer offline-only
❌ Must support real users over network
4. Security Constraints
Passwords must be hashed (bcrypt or equivalent)
JWT must be used for authentication
Role-based access control must be enforced
Additional rules:
No sensitive data in logs
No stack traces in API responses
Environment variables must not be committed
CPF must be handled carefully (masking where needed)
5. Performance Constraints
Must support:
~5,000 enrollments/year
10–20 concurrent users
Rules:
Avoid N+1 queries
Must use pagination for lists
Must not load unnecessary data
ID card generation must be efficient
Updated constraint:
❌ Batch processing is no longer the core performance driver
✅ Workflow operations (enrollment, approval) are the priority
6. Domain Constraints (NEW - CRITICAL)

These are hard rules of the system:

Enrollment:
Must not allow duplicate enrollment for same schedule
Must respect capacity limits
Must require admin approval
Student:
Must be validated before full participation
Must have unique CPF
Schedule:
Must enforce capacity
Must belong to an activity
Activity:
Must define type of modality
Can have multiple schedules
7. Data Constraints
All IDs must be UUIDs
CPF must be unique
Foreign key relationships must be enforced
No orphan records allowed
8. File & ID Card Constraints
ID card must be generated only after enrollment approval
Files must not be publicly exposed directly
File access must be controlled via API
9. Future Constraints (Forward Compatibility)

The system must allow:

Background job processing (queue)
Notification system (WhatsApp)
Migration to cloud infrastructure
Extraction of ID card generation
Scaling without domain rewrite