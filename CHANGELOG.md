# Changelog

All notable changes to the Expense Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

-   Email notification system
-   OCR receipt scanning full integration
-   Mobile app (React Native)
-   Advanced analytics dashboard
-   Budget management module

## [1.0.0] - 2025-10-04

### Added

-   🎉 **Initial Release**
-   Complete authentication system with JWT
-   Role-based access control (Admin, Manager, Employee)
-   Company auto-creation on first signup
-   User management (CRUD operations)
-   Expense submission with multi-currency support
-   Real-time currency conversion using Exchange Rate API
-   Intelligent approval workflow engine with multiple rule types:
    -   Sequential approval
    -   Percentage-based approval
    -   Specific approver approval
    -   Hybrid approval rules
-   Manager-first approval option
-   Multi-level approval chains
-   Approval history tracking
-   Dashboard for all user roles
-   Expense filtering and search
-   Bulk approval/rejection
-   Admin override capabilities
-   Receipt upload functionality
-   Export to Excel/CSV
-   Responsive UI design

### Backend Features

-   Express.js REST API
-   MongoDB with Mongoose ODM
-   Modular controller structure
-   Approval flow utility service
-   Currency conversion utility
-   Error handling middleware
-   Session management
-   File upload with Multer
-   Cron jobs for scheduled tasks
-   Email service integration (Nodemailer)

### Frontend Features

-   React 19.1.1 with Vite
-   PrimeReact UI components
-   TailwindCSS styling
-   React Router v7 for navigation
-   Formik + Yup for form validation
-   Chart.js and Recharts for visualizations
-   Context API for state management
-   Protected routes
-   Role-specific layouts

### Documentation

-   Comprehensive README.md
-   API documentation
-   Approval flow detailed documentation
-   Contributing guidelines
-   Code of conduct
-   License (MIT)

### Database Models

-   User model with role management
-   Company model with currency support
-   Expense model with approval tracking
-   ApprovalRule model for workflow configuration
-   ApprovalFlow model for runtime tracking

### API Endpoints

-   Authentication routes (`/auth`)
-   Employee routes (`/employee`)
-   Manager routes (`/manager`)
-   Admin routes (`/admin`)
-   Currency routes (`/currency`)

### Security

-   Password hashing with bcrypt
-   JWT token authentication
-   Session-based auth
-   Role-based route protection
-   Input validation and sanitization

## [0.2.0] - 2025-09-15 (Beta)

### Added

-   Basic expense submission
-   Simple approval workflow
-   User authentication
-   Dashboard prototypes

### Fixed

-   Login session persistence
-   Expense list pagination
-   Currency display formatting

## [0.1.0] - 2025-08-01 (Alpha)

### Added

-   Project initialization
-   Basic project structure
-   Database schema design
-   Initial UI mockups
-   Development environment setup

---

## Version History Summary

| Version | Release Date | Status | Highlights           |
| ------- | ------------ | ------ | -------------------- |
| 1.0.0   | 2025-10-04   | Stable | Full feature release |
| 0.2.0   | 2025-09-15   | Beta   | Core features        |
| 0.1.0   | 2025-08-01   | Alpha  | Initial setup        |

---

## Upgrade Guide

### From 0.2.0 to 1.0.0

1. **Database Migration Required**

    ```bash
    # Backup your database first
    mongodump --db expense-tracker --out ./backup

    # Update dependencies
    npm install

    # Run migration script
    npm run migrate
    ```

2. **Environment Variables**

    - Add new variables to `.env`:
        - `JWT_EXPIRE=7d`
        - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
        - `MAX_FILE_SIZE=5242880`

3. **API Changes**

    - `/api/expenses/create` → `/employee/create-expense`
    - `/api/approvals` → `/manager/pending-approvals`
    - Added new currency endpoints under `/currency`

4. **Frontend Updates**
    - Clear browser cache
    - Update local storage structure
    - Re-authenticate all users

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## Support

-   📧 Email: support@expensetracker.com
-   🐛 Issues: [GitHub Issues](https://github.com/jackey-22/Expense-tracker/issues)
-   💬 Discussions: [GitHub Discussions](https://github.com/jackey-22/Expense-tracker/discussions)
