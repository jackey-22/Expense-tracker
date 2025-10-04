# 💰 Expense Tracker Management System

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green.svg)
![React](https://img.shields.io/badge/React-19.1.1-blue.svg)

**A comprehensive enterprise-level expense management system with intelligent approval workflows,
multi-currency support, and role-based access control.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) •
[Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

-   [Overview](#-overview)
-   [Key Features](#-features)
-   [Tech Stack](#-tech-stack)
-   [System Architecture](#-system-architecture)
-   [Installation](#-installation)
-   [Configuration](#-configuration)
-   [Usage](#-usage)
-   [API Documentation](#-api-documentation)
-   [Approval Flow](#-approval-flow)
-   [Database Schema](#-database-schema)
-   [Screenshots](#-screenshots)
-   [Roadmap](#-roadmap)
-   [Contributing](#-contributing)
-   [License](#-license)

---

## 🌟 Overview

**Expense Tracker** is a modern, full-stack expense management solution designed to streamline the
reimbursement process for organizations of any size. It eliminates manual processes, reduces errors,
and provides complete transparency in expense approvals.

### Problem Statement

Companies struggle with:

-   ⏱️ **Time-consuming manual processes** for expense reimbursement
-   ❌ **Error-prone tracking** and lack of audit trails
-   🔍 **No transparency** in approval status
-   📊 **Complex multi-level approvals** without proper workflow management
-   💱 **Multi-currency handling** across global teams

### Solution

Our system provides:

-   ✅ **Automated approval workflows** with configurable rules
-   🔄 **Multi-level approval support** with percentage-based and specific approver logic
-   💰 **Real-time currency conversion** for global expense tracking
-   📱 **Role-based dashboards** for Employees, Managers, and Admins
-   📧 **Email notifications** for approval requests and status updates
-   📄 **OCR receipt scanning** for automated expense entry

---

## ✨ Features

### 🔐 Authentication & User Management

-   **Auto-Company Creation**: First signup automatically creates a company with selected country's
    currency
-   **Role-Based Access**: Three distinct roles - Admin, Manager, Employee
-   **User Management**: Admins can create, edit, and manage users
-   **Manager Relationships**: Assign employees to specific managers
-   **Bulk User Import**: Import multiple users via CSV/Excel

### 💸 Expense Submission (Employee)

-   **Multi-Currency Support**: Submit expenses in any currency
-   **Automatic Conversion**: Real-time conversion to company's default currency
-   **Receipt Upload**: Attach receipts and supporting documents
-   **OCR Integration**: Auto-extract data from receipt images
-   **Draft & Submit**: Save expenses as drafts or submit for approval
-   **Expense History**: View all submitted expenses with status tracking

### ✅ Approval Workflow (Manager/Admin)

-   **Smart Routing**: Automatic routing to appropriate approvers
-   **Manager-First Approval**: Optional manager approval before escalation
-   **Multi-Level Approvals**: Support for sequential approval chains
-   **Conditional Rules**: Flexible approval logic based on:
    -   **Percentage Rule**: Auto-approve when X% of approvers approve
    -   **Specific Approver**: Auto-approve when specific person approves (e.g., CFO)
    -   **Hybrid Rule**: Combination of percentage OR specific approver
-   **Bulk Actions**: Approve/reject multiple expenses at once
-   **Comments & Remarks**: Add notes during approval/rejection
-   **Approval History**: Complete audit trail of all decisions

### 🎯 Advanced Approval Rules

```
Example 1: Sequential Approval
Manager → Finance → Director → Approved

Example 2: Percentage Rule (60%)
5 Approvers → 3 approve (60%) → Auto-approved

Example 3: Specific Approver
Any approver + CFO → Auto-approved

Example 4: Hybrid Rule
60% of approvers OR CFO approval → Auto-approved
```

### 👨‍💼 Admin Capabilities

-   **Company Configuration**: Set default currency and country
-   **User Management**: Create, update, delete users
-   **Role Assignment**: Change user roles dynamically
-   **Approval Rules**: Configure approval workflows
-   **Override Approvals**: Admin can override any decision
-   **Analytics Dashboard**: View expense statistics and trends
-   **Bulk Operations**: Mass approve/reject expenses

### 📊 Dashboard & Reporting

-   **Real-time Statistics**: Live expense metrics and trends
-   **Visual Charts**: Interactive graphs for expense analysis
-   **Filtering & Search**: Advanced filters by date, category, status
-   **Export Options**: Download reports in Excel/CSV
-   **Department-wise Analysis**: Expense breakdown by department

### 🌍 Multi-Currency Support

-   **200+ Currencies**: Support for all major currencies
-   **Real-time Rates**: Live exchange rate fetching
-   **Automatic Conversion**: Display in company's default currency
-   **Historical Tracking**: Maintain original currency and converted amount

---

## 🛠️ Tech Stack

### Backend

-   **Runtime**: Node.js (v18+)
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT + Express Session
-   **Validation**: Custom middleware
-   **File Upload**: Multer
-   **Email**: Nodemailer
-   **Scheduling**: Node-cron
-   **APIs**:
    -   [Exchange Rate API](https://exchangerate-api.com/) - Currency conversion
    -   [REST Countries](https://restcountries.com/) - Country/currency data

### Frontend

-   **Framework**: React 19.1.1
-   **Routing**: React Router DOM v7
-   **UI Library**: PrimeReact, TailwindCSS
-   **Forms**: Formik + Yup validation
-   **Charts**: Chart.js, Recharts
-   **Icons**: Lucide React, React Icons
-   **OCR**: Tesseract.js
-   **Build Tool**: Vite

### DevOps & Tools

-   **Version Control**: Git
-   **Package Manager**: npm
-   **API Testing**: Postman (collection included)
-   **Code Quality**: ESLint
-   **Environment**: dotenv

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Employee │  │ Manager  │  │  Admin   │  │   Auth   │    │
│  │Dashboard │  │Dashboard │  │Dashboard │  │  Pages   │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API
┌───────────────────────────┴─────────────────────────────────┐
│                      Backend (Express.js)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Authentication Middleware                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐              │
│  │ Employee  │  │ Manager   │  │  Admin    │              │
│  │Controller │  │Controller │  │Controller │              │
│  └───────────┘  └───────────┘  └───────────┘              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Approval Flow Engine (Utils)                │   │
│  │  • initializeApprovalFlow()                           │   │
│  │  • processApprovalDecision()                          │   │
│  │  • evaluateApprovalRule()                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Currency Conversion Service (Utils)           │   │
│  │  • convertCurrency()                                  │   │
│  │  • getAllCurrencies()                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                    MongoDB Database                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Companies │  │  Users   │  │ Expenses │  │Approval  │   │
│  │          │  │          │  │          │  │  Rules   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                               │
│  │Approval  │                                               │
│  │  Flows   │                                               │
│  └──────────┘                                               │
└───────────────────────────────────────────────────────────┘
```

---

## 📥 Installation

### Prerequisites

-   **Node.js** (v18.0.0 or higher)
-   **MongoDB** (v5.0 or higher)
-   **npm** or **yarn**
-   **Git**

### Clone Repository

```bash
git clone https://github.com/jackey-22/Expense-tracker.git
cd Expense-tracker
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Frontend Setup

```bash
cd client-web

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret-key

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=Expense Tracker <noreply@expensetracker.com>

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# API Keys (Optional)
OPENAI_API_KEY=your-openai-key-for-ocr
```

### Frontend Environment Variables

Create a `.env` file in the `client-web` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=Expense Tracker
VITE_APP_VERSION=1.0.0
```

---

## 🚀 Usage

### Start MongoDB

```bash
# If using local MongoDB
mongod

# Or start MongoDB service
sudo systemctl start mongod
```

### Start Backend Server

```bash
cd server

# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

### Start Frontend

```bash
cd client-web

# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Frontend will run on `http://localhost:5173`

### Access the Application

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **First Time Setup**:
    - Click "Sign Up"
    - Enter your details
    - Select your country (auto-sets currency)
    - Your company and admin account are created automatically
3. **Create Users**: As admin, create managers and employees
4. **Configure Approval Rules**: Set up approval workflows
5. **Submit Expenses**: Employees can now submit expenses

---

## 📚 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

```http
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
GET  /auth/verify-token
```

### Employee Endpoints

```http
POST   /employee/create-expense
GET    /employee/expenses
GET    /employee/expenses/:id
GET    /employee/pending-approval
GET    /employee/all-users
```

### Manager Endpoints

```http
GET    /manager/pending-approvals
GET    /manager/expenses
POST   /manager/approve-expense/:id
GET    /manager/approval-stats
GET    /manager/expense-details/:id
```

### Admin Endpoints

```http
# User Management
GET    /admin/users
POST   /admin/users
PATCH  /admin/users/:userId
DELETE /admin/users/:userId
PATCH  /admin/users/:userId/toggle-status
PATCH  /admin/users/:userId/reset-password
POST   /admin/users/bulk-import

# Expense Management
GET    /admin/expenses
GET    /admin/expenses/:expenseId
PATCH  /admin/expenses/:expenseId/approve
PATCH  /admin/expenses/:expenseId/reject
PATCH  /admin/expenses/:expenseId/override
POST   /admin/expenses/bulk-approve
GET    /admin/expenses-statistics

# Approval Rules
GET    /admin/users-dropdown
POST   /admin/approval-rule
```

### Currency Endpoints

```http
GET    /currency/currencies
GET    /currency/currency/:country
GET    /currency/exchange-rate?from=USD&to=EUR
POST   /currency/convert
```

### Example Request

```javascript
// Create Expense
POST /employee/create-expense
Content-Type: application/json

{
  "amount": 150.50,
  "currency": "USD",
  "category": "Travel",
  "description": "Client meeting taxi fare",
  "date": "2025-10-04",
  "submitForApproval": true
}

// Response
{
  "success": true,
  "message": "Expense created and submitted for approval",
  "expense": {
    "_id": "67...",
    "employee": {...},
    "amount": 150.50,
    "currency": "USD",
    "convertedAmount": 135.45,
    "category": "Travel",
    "approvalStatus": "InProgress",
    "currentApprover": {...}
  }
}
```

---

## 🔄 Approval Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Expense Submitted                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Check Approval Rules                             │
│  • Is Manager Approval Required First?                       │
│  • What type of rule? (Sequential/Percentage/Specific)       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│             Initialize Approval Flow                          │
│  • Create approval steps                                     │
│  • Assign first approver                                     │
│  • Set currentApprover in Expense                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Approver Makes Decision                          │
│  ┌────────────────┐         ┌────────────────┐             │
│  │   Approved     │         │    Rejected    │             │
│  └────────┬───────┘         └────────┬───────┘             │
└───────────┼──────────────────────────┼─────────────────────┘
            │                          │
            ▼                          ▼
┌──────────────────────┐    ┌──────────────────────┐
│  Evaluate Rule       │    │   End Flow           │
│  • Sequential?       │    │   Status: Rejected   │
│  • Percentage met?   │    └──────────────────────┘
│  • Specific approved?│
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│ More    │  │ Final   │
│Approvals│  │Approval │
│Needed   │  │         │
└────┬────┘  └────┬────┘
     │            │
     ▼            ▼
┌─────────┐  ┌─────────┐
│Move to  │  │ Status: │
│Next     │  │Approved │
│Approver │  └─────────┘
└─────────┘
```

### Rule Types Explained

#### 1. **Sequential Approval**

All approvers must approve in order.

```
Step 1: Manager → Step 2: Finance → Step 3: Director → Approved
```

#### 2. **Percentage Rule**

Auto-approve when X% of approvers approve.

```
60% of 5 approvers = 3 approvals needed
Approver A ✓, B ✓, C ✓ (60% reached) → Auto-approved
```

#### 3. **Specific Approver Rule**

Auto-approve when specific person(s) approve.

```
If CFO approves → Auto-approved (regardless of others)
```

#### 4. **Hybrid Rule**

Combination of percentage OR specific approver.

```
(60% of approvers) OR (CFO approves) → Auto-approved
```

For detailed approval flow documentation, see
[APPROVAL_FLOW_DOCUMENTATION.md](server/APPROVAL_FLOW_DOCUMENTATION.md)

---

## 🗄️ Database Schema

### Collections

#### Users

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "Admin" | "Manager" | "Employee",
  company: ObjectId (ref: Company),
  manager: ObjectId (ref: User),
  isManagerApprover: Boolean,
  department: String,
  phone: String,
  location: String,
  jobTitle: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Companies

```javascript
{
  _id: ObjectId,
  country: String,
  defaultCurrency: String,
  admin: ObjectId (ref: User),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Expenses

```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  employee: ObjectId (ref: User),
  amount: Number,
  currency: String,
  convertedAmount: Number,
  category: String,
  description: String,
  date: Date,
  paidBy: ObjectId (ref: User),
  receipt: String,
  approvalStatus: "Draft" | "InProgress" | "Approved" | "Rejected",
  currentApprover: ObjectId (ref: User),
  remarks: String,
  approvalRule: ObjectId (ref: ApprovalRule),
  approvalFlow: ObjectId (ref: ApprovalFlow),
  history: [{
    approver: ObjectId,
    action: String,
    remarks: String,
    decidedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### ApprovalRules

```javascript
{
  _id: ObjectId,
  company: ObjectId (ref: Company),
  name: String,
  approvalSteps: [{
    stepOrder: Number,
    approverUser: ObjectId (ref: User)
  }],
  ruleType: "Percentage" | "SpecificApprover" | "Hybrid",
  isManagerApproverRequired: Boolean,
  percentage: Number,
  specificApprover: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### ApprovalFlows

```javascript
{
  _id: ObjectId,
  expense: ObjectId (ref: Expense),
  company: ObjectId (ref: Company),
  steps: [{
    stepOrder: Number,
    approver: ObjectId (ref: User),
    role: String,
    required: Boolean,
    decision: "Pending" | "Approved" | "Rejected",
    decidedAt: Date,
    remarks: String
  }],
  overallStatus: "InProgress" | "Approved" | "Rejected",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📸 Screenshots

### Employee Dashboard

![Employee Dashboard](docs/screenshots/employee-dashboard.png)

### Manager Approvals

![Manager Approvals](docs/screenshots/manager-approvals.png)

### Admin Panel

![Admin Panel](docs/screenshots/admin-panel.png)

### Approval Rules Configuration

![Approval Rules](docs/screenshots/approval-rules.png)

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅

-   [x] User authentication and authorization
-   [x] Role-based access control
-   [x] Expense submission
-   [x] Multi-currency support
-   [x] Approval workflow engine
-   [x] Dashboard and reporting

### Phase 2: Enhanced Features 🚧

-   [ ] Email notifications
-   [ ] OCR receipt scanning (UI integration)
-   [ ] Mobile app (React Native)
-   [ ] Advanced analytics
-   [ ] Budget management
-   [ ] Expense categories customization

### Phase 3: Enterprise Features 📋

-   [ ] Multi-company support
-   [ ] SSO integration (SAML, OAuth)
-   [ ] Advanced reporting (custom reports)
-   [ ] API rate limiting
-   [ ] Audit logs
-   [ ] Compliance reports

### Phase 4: AI & Automation 🤖

-   [ ] AI-powered fraud detection
-   [ ] Smart categorization
-   [ ] Predictive analytics
-   [ ] Chatbot support
-   [ ] Auto-receipt matching

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3. **Commit your changes**
    ```bash
    git commit -m 'Add some AmazingFeature'
    ```
4. **Push to the branch**
    ```bash
    git push origin feature/AmazingFeature
    ```
5. **Open a Pull Request**

### Code Style Guidelines

-   Follow ESLint configuration
-   Write meaningful commit messages
-   Add comments for complex logic
-   Update documentation for API changes
-   Write tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

-   **Project Lead**: [Your Name]
-   **Backend Developer**: [Your Name]
-   **Frontend Developer**: [Your Name]
-   **UI/UX Designer**: [Your Name]

---

## 📞 Support

For support, email support@expensetracker.com or join our Slack channel.

### Bug Reports

Please use the [GitHub Issues](https://github.com/jackey-22/Expense-tracker/issues) page to report
bugs.

### Feature Requests

We love feature requests! Please open an issue with the `enhancement` label.

---

## 🙏 Acknowledgments

-   [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
-   [React](https://react.dev/) - UI library
-   [MongoDB](https://www.mongodb.com/) - Database
-   [PrimeReact](https://primereact.org/) - UI components
-   [TailwindCSS](https://tailwindcss.com/) - CSS framework
-   [Exchange Rate API](https://exchangerate-api.com/) - Currency data
-   [REST Countries](https://restcountries.com/) - Country data

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/jackey-22/Expense-tracker?style=social)
![GitHub forks](https://img.shields.io/github/forks/jackey-22/Expense-tracker?style=social)
![GitHub issues](https://img.shields.io/github/issues/jackey-22/Expense-tracker)
![GitHub pull requests](https://img.shields.io/github/issues-pr/jackey-22/Expense-tracker)

---

<div align="center">

**Made with ❤️ by the Team Echo_spark**

[⬆ Back to Top](#-expense-tracker-management-system)

</div>
