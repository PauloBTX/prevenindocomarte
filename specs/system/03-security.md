SECURITY SPECIFICATION

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. Authentication Model

The system uses custom authentication.

Strategy:
Login via CPF + password
Passwords must be securely hashed (bcrypt or equivalent)
Authentication via JWT (JSON Web Token)
Tokens stored in HTTP-only cookies
Requirements:
Passwords must never be stored in plain text
Minimum password strength must be enforced
JWT must include:
userId
role (STUDENT | ADMIN)
Session Handling:
Stateless authentication via JWT
Token expiration required
Refresh token mechanism (optional for future)
2. Authorization Model

The system implements role-based access control (RBAC).

Roles:
STUDENT
ADMIN
Rules:
STUDENT:
Can only access their own data
Can create enrollment requests
Cannot access admin endpoints
ADMIN:
Full access to:
students
activities
schedules
enrollments
Can approve/reject enrollments
Can manage system data
Enforcement:
Authorization must be enforced in application layer
Middleware may validate authentication only (not business rules)
3. Access Scope

The system is:

Fully online and accessible via web
Protected via authentication
Requirements:
All protected routes must require valid JWT
Public routes limited to:
login
registration
public activity listing (optional)
CORS:
Restrict to known frontend domains
Avoid wildcard (*) in production
4. Input Validation

All inputs must be validated using Zod before reaching use cases.

Rules:
Reject unknown fields
Reject invalid types
Reject missing required fields
Normalize CPF input (remove formatting)
Validate CPF format (structure, not necessarily external verification)
Error Response:

Must follow standard format:

{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
5. API Security
Requirements:
No stack traces exposed
Consistent error responses
Use correct HTTP status codes
Rate Limiting:

Must be implemented for:

Login endpoint
Registration endpoint
Brute-force Protection:
Limit failed login attempts
Optional temporary lockout (future)
6. Sensitive Data Handling

The system stores personal student data.

Rules:
Never log passwords
Never log full sensitive records
Mask sensitive fields when needed:
CPF (partial masking)
Avoid exposing internal IDs unnecessarily
7. File & ID Card Security
ID Card Generation:
Generated only after enrollment approval
Must not expose file paths directly
Files must be served through controlled endpoints
File Storage:
Store in controlled directories
Prevent path traversal
Validate file names
8. Database Security
Database via PostgreSQL (Supabase or local Docker)
Access restricted to backend only
Rules:
Use Prisma exclusively
No raw SQL unless necessary
Prevent injection via ORM usage
9. Environment Variables

Must include:

DATABASE_URL
JWT_SECRET
NEXT_PUBLIC_APP_URL
Rules:
Never commit .env.local
JWT secret must be strong and random
No secrets in code
10. Transport Security
Requirements:
HTTPS required in production
Secure cookies:
httpOnly
secure (in production)
sameSite (lax or strict)
11. Audit & Traceability (IMPORTANT)

Admin actions must be traceable.

Must log:
Enrollment approvals/rejections
Student validation
Activity creation/editing
Admin actions
Logs must include:
actor (admin id)
action
timestamp
target entity id
12. Future Security Considerations

Planned improvements:

WhatsApp notification security
Email verification (optional)
Two-factor authentication (optional)
Background job security
File storage migration (S3 or similar)
Advanced audit logs