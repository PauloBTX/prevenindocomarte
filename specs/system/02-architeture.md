ARCHITECTURE SPECIFICATION

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. Architectural Style
Clean Architecture
Modular Monolith
REST-based internal API (Next.js Route Handlers)
Server-side rendering capable
Transactional system (request-driven)
Event-oriented domain triggers (internal, synchronous)

The system is designed as a modular monolith focused on managing students, activities, and enrollments in an online environment.

All business logic must remain isolated from framework-specific code.

2. Technology Stack
Frontend
Framework: Next.js (App Router)
Language: TypeScript
State management:
React Server Components (default)
Minimal client state (useState)
Zustand (only if necessary)
Styling: TailwindCSS + shadcn/ui
Form handling: React Hook Form + Zod
Authentication handling: HTTP-only cookies (JWT)
Backend
Runtime: Node.js (Next.js server runtime)
Framework: Next.js Route Handlers
Validation: Zod
ORM: Prisma
Database: PostgreSQL (via Supabase Docker or hosted)

The backend is embedded in Next.js but must strictly follow Clean Architecture boundaries.

Infrastructure
Containerization: Docker + Docker Compose
Database: PostgreSQL via Supabase (DB only)
File storage (initial): Local filesystem
Future: External storage (optional)
CI/CD: GitHub Actions (future)
3. Authentication Architecture

The system uses custom authentication.

Strategy:
Login: CPF + password
Password hashing (bcrypt or equivalent)
JWT-based authentication
Token stored in HTTP-only cookies
Roles:
STUDENT
ADMIN
Rules:
Authorization enforced in application layer
Middleware used only for token validation (not business rules)
No Supabase Auth usage
4. Module Structure

All features must follow:

src/modules/<module-name>/
domain/
application/
infrastructure/
presentation/

Core Modules:
auth
student
activity
schedule
enrollment
id-card
5. Layer Responsibilities
Domain
Entities
Value Objects
Business rules
Status machines (ex: enrollment lifecycle)
No external dependencies
Application
Use cases
Authorization checks
Transaction orchestration
Domain event triggering (synchronous)
Infrastructure
Prisma repositories
JWT service
Password hashing service
File storage
ID card generator (PDF/image)
Presentation
Route handlers
Controllers
Input validation (Zod)
Response formatting
6. Dependency Rules

(permanece — está correto)

Domain → nada
Application → Domain
Infrastructure → Domain
Presentation → Application

Nunca inverter isso.

7. Cross-Cutting Concerns
Logging
Logar:
autenticação
ações administrativas
mudanças de status (enrollment)
Nunca logar:
senha
dados sensíveis completos
Error Handling

Adicionar novos erros:

UnauthorizedError
ForbiddenError

(resto mantém)

8. Enrollment Workflow Architecture (NOVO - CRÍTICO)

Core flow:

Student creates enrollment → status = PENDING
Admin approves → status = APPROVED
System triggers:

👉 Generate ID Card

This must be:

Inside application layer
Synchronous for now
Future-ready for async (queue)
9. File & ID Card Processing

Agora muda:

ID Card Generation
Triggered AFTER enrollment approval
Generated per enrollment (not batch-first)
Stored locally (initially)

Batch generation becomes secondary feature, not core.

10. Scalability Considerations
Designed for:
~5,000 enrollments/year
low concurrency

Future:

Extract ID card generation
Add background jobs
Add notification service (WhatsApp)
11. System Constraints
Single organization (no multi-tenant)
No Supabase Auth
No direct DB access outside Prisma
No business logic in UI layer
Must be auditable (admin actions)