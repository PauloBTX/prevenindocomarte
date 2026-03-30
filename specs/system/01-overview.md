SYSTEM OVERVIEW

Version: 2.0
Status: Active
Last Updated: 2026-03-30

1. System Identity

Name: Sistema de Gestão de Alunos e Matrículas

This system is a web-based platform designed to manage student registration, activity enrollment (matrículas), and administrative operations for a social project.

It allows students to self-register, browse available activities (modalidades), enroll in scheduled classes, and track their enrollment status. Administrators manage students, activities, enrollments, and generate student ID cards.

The system operates fully online and supports multiple concurrent users.

Target users:

Students (public users):

Register and manage their profile
Browse available activities
Request enrollment in activities
Track enrollment status

Administrators (internal users):

Validate student registrations
Manage student data
Create and manage activities (modalidades)
Approve or reject enrollments
Generate student ID cards
Manage system operations
2. Business Objectives
Primary goal:
Provide a complete digital system for managing student registrations and enrollments in social project activities.
Secondary goals:
Eliminate manual enrollment processes
Centralize student and activity data
Ensure controlled approval workflow for enrollments
Automate generation of student ID cards
Improve operational visibility for administrators
Success metrics:
Student registration completion rate > 90%
Enrollment approval workflow processed within 48 hours
Zero duplicate enrollments for the same activity schedule
System supports at least 5,000 enrollments per year
Admin operations performed without manual data duplication
3. Scope Definition
In Scope
Online student registration (CPF + password)
Student profile management
Admin validation of student data
Activity (modalidade) management
Scheduling of recurring classes (days and times)
Enrollment request by students
Admin approval/rejection of enrollments
Capacity control per activity schedule
Enrollment status tracking
Automatic generation of student ID cards after enrollment approval
Admin panel for full system management
Role-based access (STUDENT / ADMIN)
Out of Scope (initial version)
Multi-tenant support (single project only)
Payment processing
Integration with external identity providers
Mobile application
WhatsApp notifications (planned future feature)
Advanced reporting/analytics dashboards
Real-time messaging between users
External API integrations
4. Core Value Proposition

This system replaces fragmented and manual processes of student enrollment with a centralized, structured, and controlled digital workflow.

Instead of managing registrations through paper forms, spreadsheets, or messaging apps, the system enables:

Students to self-register and request enrollment
Administrators to control and validate all operations
Automatic enforcement of business rules (capacity, approval, uniqueness)
Immediate generation of student ID cards after approval

The system ensures data integrity, operational efficiency, and scalability for the social project.

5. High-Level Capabilities
Student self-service registration and profile management
Authentication via CPF and password
Activity (modalidade) creation and scheduling
Recurring class schedules with defined days and times
Enrollment request and approval workflow
Capacity management per activity schedule
Prevention of duplicate enrollments
Administrative control panel
Automatic student ID card generation
Structured validation and error handling
6. Core Domain Concepts
Student

Represents a user enrolled in the system.

Must have a valid account
Must be approved by an administrator before full access
Can request enrollments
Admin

Represents an internal authorized user.

Can manage all system data
Responsible for validation and approvals
Activity (Modalidade)

Represents a type of activity (e.g., jiu-jitsu, boxing, football).

Defines the category of the class
Can have multiple schedules
Schedule (Turma / Agenda)

Represents a specific instance of an activity.

Has defined days and times
Has limited capacity
Accepts enrollments
Enrollment (Matrícula)

Represents a student's participation request in a schedule.

Created by student
Must be approved by admin
Has status lifecycle:
PENDING
APPROVED
REJECTED
CANCELED
Student ID Card (Carteirinha)
Generated automatically after enrollment approval
Contains student identification data
Used for physical or digital validation
7. System Context
External systems:
Future integration with WhatsApp (notifications)
Optional image processing tools for ID card photo handling
User Interaction Channels:
Web interface (primary)
Authentication via CPF + password
Dashboard interfaces (student and admin)
Enrollment workflow UI
Administrative management panels
8. Key Business Rules (High-Level)
A student must be validated by an admin before full participation
Enrollment requires:
valid student
valid schedule
available capacity
Enrollment must be approved by an admin
Duplicate enrollment in the same schedule is not allowed
Capacity limits must be enforced strictly
ID card is generated only after enrollment approval
9. System Constraints
Single organization (no multi-tenant)
Moderate scale (~5,000 enrollments/year)
Low concurrency (10–20 simultaneous users)
Must prioritize data consistency over performance shortcuts
Must be auditable (especially admin actions)
10. Evolution Path

Planned future expansions:

WhatsApp notifications (approval, reminders)
Reporting dashboards (admin insights)
Attendance tracking
Batch operations for admins
Integration with external services
11. Operational Model
Student Flow:
Browse activities and schedules
Select desired schedule
Register account (CPF + password)
Complete profile
Request enrollment
Wait for admin approval
Admin Flow:
Validate student registration
Manage activities and schedules
Review enrollment requests
Approve/reject enrollments
System generates ID card automatically