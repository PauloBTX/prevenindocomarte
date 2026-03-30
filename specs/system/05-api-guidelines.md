API DESIGN GUIDELINES

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. API Style
RESTful
JSON only
Stateless (JWT-based)
Resource-oriented endpoints

Base URL:

/api/v1/
Core Resources:
/api/v1/auth
/api/v1/students
/api/v1/activities
/api/v1/schedules
/api/v1/enrollments
/api/v1/id-cards
Rules:
All endpoints must be versioned
No server-side session state
Authentication via JWT (HTTP-only cookies)
2. Response Format Standard

All responses must follow the envelope:

Success:
{
  "data": {},
  "error": null
}
Error:
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
Rules:
Always include data and error
Never expose stack traces
Never return raw Prisma objects directly
Error codes must be UPPER_SNAKE_CASE
3. Status Codes
200 OK → Successful retrieval
201 Created → Resource created
204 No Content → Successful deletion
400 Bad Request → Validation error
401 Unauthorized → Not authenticated
403 Forbidden → Not allowed
404 Not Found → Resource not found
409 Conflict → Business rule violation
422 Unprocessable Entity → Semantic validation
500 Internal Server Error → Unexpected failure
Updated Rules:
Enrollment conflicts → 409
Capacity exceeded → 409
Unauthorized access → 403 (if logged) / 401 (if not logged)
4. Versioning Strategy
URL-based versioning:
/api/v1/resource
Rules:
Breaking changes → new version
Old versions must remain temporarily supported
Non-breaking changes do not require version bump
5. Pagination Standard

Required for all list endpoints.

Query params:
?page=1
?limit=20
?sort=createdAt
?order=desc
Limits:
Default: 20
Max: 100
Response:
{
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  },
  "error": null
}
Rules:
Page starts at 1
Empty page returns empty items
Default sort: createdAt DESC
6. Validation Rules
All inputs validated with Zod
Reject unknown fields
Normalize CPF before validation
Example:
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CPF is invalid"
  }
}
7. Authentication Endpoints (NEW)
Routes:
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
Rules:
Login returns JWT via HTTP-only cookie
/me returns current user
Logout invalidates session (client-side cookie removal)
8. Authorization Rules
STUDENT endpoints:
GET    /students/me
PUT    /students/me
POST   /enrollments
GET    /enrollments/me
ADMIN endpoints:
GET    /students
PATCH  /students/:id
POST   /activities
POST   /schedules
PATCH  /enrollments/:id/approve
PATCH  /enrollments/:id/reject
Rules:
Students can only access their own data
Admins have full access
Authorization enforced in application layer
9. Enrollment Workflow Endpoints (CRITICAL)
Create enrollment:
POST /api/v1/enrollments
Approve:
PATCH /api/v1/enrollments/:id/approve
Reject:
PATCH /api/v1/enrollments/:id/reject
Rules:
Must validate:
capacity
duplicate enrollment
Approval triggers ID card generation
10. File & ID Card Endpoints
Generate (internal trigger)
Not public by default
Access:
GET /api/v1/id-cards/:id
Rules:
Must validate ownership (student) or admin access
Do not expose raw file paths
11. Security Considerations
All protected routes require authentication
No sensitive data exposed
CPF must not be fully exposed unnecessarily
Use UUIDs for public IDs
12. Naming Conventions
Endpoints: plural nouns
JSON: camelCase
DB: snake_case
Error codes: UPPER_SNAKE_CASE
13. Idempotency Rules
GET → idempotent
DELETE → idempotent
POST → not idempotent
PATCH → idempotent when possible
Special case:

Enrollment:

Prevent duplicate requests for same schedule
14. Removed Concepts (IMPORTANT)

The following are no longer core:

❌ batch endpoints
❌ spreadsheet upload as primary flow

They may exist as secondary/admin features only.

15. Future Extensions
Rate limiting (expanded)
OpenAPI/Swagger generation
Webhooks
Notification endpoints (WhatsApp)