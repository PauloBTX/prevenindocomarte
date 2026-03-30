PERFORMANCE SPECIFICATION

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. Performance Targets

The system is designed for online multi-user operation with low concurrency.

Average response time
Standard API operations: < 200ms
Authentication (login): < 300ms
Enrollment operations: < 300ms
Max response time (p95)
Standard endpoints: < 500ms
Enrollment approval (with ID card generation): < 1 second
Concurrent users supported
10–20 concurrent users
Low contention expected
2. Scalability Strategy

The system is designed as a modular monolith with vertical scalability.

Horizontal scaling
Not required initially
Architecture must allow future extraction of services (e.g., ID card generation)
Vertical scaling
Primary scaling strategy
Increase CPU/RAM as needed
Database indexing strategy

Indexes must be created for:

Primary keys (UUID)
Foreign keys:
studentId
activityId
scheduleId
Frequently queried fields:
cpf (unique index)
enrollment status
createdAt
Caching policy
No caching layer initially
No Redis
No global in-memory cache

👉 Optimize queries instead of caching

3. Database Optimization
Query discipline
Avoid N+1 queries
Use Prisma include and select strategically
Fetch only required fields
Relationships
Use proper relational queries for:
student → enrollments
activity → schedules
schedule → enrollments
Pagination
Required for:
student lists
enrollments
activities
Connection pooling
Default Prisma pooling is sufficient
No external pooling required
4. Enrollment & Workflow Performance (CRITICAL)

This system is workflow-driven, not batch-driven.

Key operations:
Enrollment creation
Must be fast (< 300ms)
Validate:
capacity
duplicate enrollment
student status
Enrollment approval
Must:
update status
trigger ID card generation
Rule:
ID card generation must be efficient and lightweight
Avoid blocking operations longer than necessary
Strategy:
Synchronous generation (v1)
Must be easily replaceable with async processing (future)
5. ID Card Generation Performance
Requirements:
Generate per student (not batch-first)
Keep generation lightweight
Avoid loading unnecessary assets repeatedly
Optimization:
Reuse templates
Avoid heavy image processing per request
Cache static assets in memory (allowed if safe and small)
6. Load Handling
Rate limiting

Must be applied to:

Login endpoint
Registration endpoint
Backpressure
Not required for v1
Must be considered if:
enrollment spikes occur
ID generation becomes heavy
7. Memory Usage Constraints
Do not load large datasets unnecessarily
Avoid global mutable state
Clean temporary files if used
Avoid memory leaks in long-running processes
8. File & Media Handling
ID card generation must not:
load entire dataset in memory
process large images unnecessarily
9. Future Performance Considerations

Planned improvements:

Background job queue (BullMQ / similar)
Async ID card generation
Caching layer (Redis)
CDN for static assets
Database read optimizations
Horizontal scaling if user base grows