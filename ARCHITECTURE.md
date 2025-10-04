# 🎨 System Architecture & Flow Diagrams

Visual representation of the Expense Tracker system architecture and data flows.

---

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           USER LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   Employee   │  │   Manager    │  │    Admin     │              │
│  │   Browser    │  │   Browser    │  │   Browser    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
└─────────┼──────────────────┼──────────────────┼─────────────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             │ HTTPS/REST API
                             │
┌─────────────────────────────▼─────────────────────────────────────────┐
│                      FRONTEND (React + Vite)                           │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                     React Router (v7)                             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Employee   │  │   Manager    │  │    Admin     │               │
│  │    Pages     │  │    Pages     │  │    Pages     │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │            Shared Components & Context API                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────┬───────────────────────────────────────────┘
                             │ HTTP Requests
                             │
┌────────────────────────────▼───────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Authentication Layer                           │  │
│  │            JWT + Session + Role-Based Access Control             │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│  │   Employee   │  │   Manager    │  │    Admin     │                │
│  │  Controller  │  │  Controller  │  │  Controller  │                │
│  └──────────────┘  └──────────────┘  └──────────────┘                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    Business Logic Layer                          │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                    │  │
│  │  │ Approval Flow    │  │ Currency         │                    │  │
│  │  │ Engine (Utils)   │  │ Converter (Utils)│                    │  │
│  │  └──────────────────┘  └──────────────────┘                    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    Data Access Layer (Mongoose)                  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬───────────────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────────────┐
│                    DATABASE (MongoDB)                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │Companies │  │  Users   │  │ Expenses │  │Approval  │              │
│  │          │  │          │  │          │  │  Rules   │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐                                                          │
│  │Approval  │                                                          │
│  │  Flows   │                                                          │
│  └──────────┘                                                          │
└────────────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                    │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Exchange Rate API│  │ REST Countries   │  │  Email Service   │    │
│  │  (Currency)      │  │    (Countries)   │  │   (Nodemailer)   │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Expense Submission Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Employee Fills Expense Form                             │
└────────┬────────────────────────────────────────────────────────┘
         │
         │ {amount, currency, category, description, date, receipt}
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend Validation (Formik + Yup)                      │
│  ✓ Required fields                                               │
│  ✓ Amount > 0                                                    │
│  ✓ Valid date                                                    │
└────────┬────────────────────────────────────────────────────────┘
         │
         │ POST /employee/create-expense
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Processing                                       │
│  1. Get company details                                          │
│  2. Currency conversion (if different from company currency)     │
│  3. Create expense document                                      │
│  4. Call initializeApprovalFlow()                                │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Initialize Approval Flow                                 │
│  1. Fetch active approval rule                                   │
│  2. Determine first approver:                                    │
│     • Manager (if isManagerApproverRequired)                     │
│     • First step approver                                        │
│  3. Build approval steps array                                   │
│  4. Create ApprovalFlow document                                 │
│  5. Set expense.currentApprover                                  │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Save to Database                                         │
│  • Expense: {status: "InProgress", currentApprover: userId}     │
│  • ApprovalFlow: {steps: [...], overallStatus: "InProgress"}   │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Response to Employee                                     │
│  {                                                               │
│    success: true,                                                │
│    message: "Expense submitted for approval",                    │
│    expense: { /* populated expense */ }                          │
│  }                                                               │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 7: Notification (Optional)                                  │
│  • Email to currentApprover                                      │
│  • "New expense awaiting your approval"                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✅ Approval Processing Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ APPROVER RECEIVES NOTIFICATION                                   │
│  • Email alert                                                   │
│  • Dashboard notification badge                                  │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ APPROVER REVIEWS EXPENSE                                         │
│  • Views expense details                                         │
│  • Checks amount (in company currency)                           │
│  • Reviews category, description, receipt                        │
│  • Sees approval history                                         │
└────────┬────────────────────────────────────────────────────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌─────────┐
    │ APPROVE │      │ REJECT  │      │  DEFER  │
    └────┬────┘      └────┬────┘      └─────────┘
         │                │
         │                │
         ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: processApprovalDecision()                               │
│  1. Validate approver authorization                              │
│  2. Update step decision in ApprovalFlow                         │
│  3. Add to expense history                                       │
└────────┬────────────────────────────────────────────────────────┘
         │
         ├───────────────────┬────────────────────┐
         │                   │                    │
    If APPROVED         If REJECTED         If DEFERRED
         │                   │                    │
         ▼                   ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ evaluateRule()   │  │ End Flow         │  │ Keep Current     │
│                  │  │ Status: Rejected │  │ Status: Pending  │
└────────┬─────────┘  └──────────────────┘  └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ RULE EVALUATION                                                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SEQUENTIAL RULE                                           │  │
│  │  → Move to next approver                                  │  │
│  │  → If last approver → APPROVE                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PERCENTAGE RULE                                           │  │
│  │  → Calculate: (approved / total) * 100                    │  │
│  │  → If >= threshold% → APPROVE                             │  │
│  │  → Else → Continue to next                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ SPECIFIC APPROVER RULE                                    │  │
│  │  → Check if all required approved                         │  │
│  │  → If yes → APPROVE                                        │  │
│  │  → Else → Continue to next required                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ HYBRID RULE                                               │  │
│  │  → If (percentage >= threshold) OR (required approved)    │  │
│  │     → APPROVE                                              │  │
│  │  → Else → Continue                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬──────────────────────────────────────────────────────────┘
         │
         ├───────────────┬────────────────┐
         ▼               ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ FINAL        │  │ MOVE TO NEXT │  │ KEEP PENDING │
│ APPROVAL     │  │ APPROVER     │  │ (Percentage) │
└──────┬───────┘  └──────┬───────┘  └──────────────┘
       │                 │
       │                 │
       ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ UPDATE DATABASE                                                   │
│  • expense.approvalStatus                                        │
│  • expense.currentApprover                                       │
│  • approvalFlow.steps[i].decision                                │
│  • approvalFlow.overallStatus                                    │
│  • expense.history.push(newEntry)                                │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ SEND NOTIFICATIONS                                                │
│  • Employee: Status update                                       │
│  • Next Approver: New pending approval (if applicable)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💱 Currency Conversion Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Employee submits expense in EUR (€100)                           │
│ Company default currency: USD                                    │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Check if conversion needed                               │
│  if (expenseCurrency !== companyCurrency) {                     │
│    // Conversion required                                        │
│  }                                                               │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Call Exchange Rate API                                   │
│  GET https://api.exchangerate-api.com/v4/latest/EUR             │
│                                                                   │
│  Response: {                                                     │
│    base: "EUR",                                                  │
│    rates: {                                                      │
│      USD: 1.18,                                                  │
│      GBP: 0.86,                                                  │
│      ...                                                         │
│    }                                                             │
│  }                                                               │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Calculate Conversion                                     │
│  convertedAmount = amount * rate                                 │
│  convertedAmount = 100 * 1.18                                    │
│  convertedAmount = 118.00 USD                                    │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Save Both Amounts                                        │
│  expense: {                                                      │
│    amount: 100,            // Original                           │
│    currency: "EUR",        // Original                           │
│    convertedAmount: 118,   // Converted                          │
│  }                                                               │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Display to Approvers                                     │
│  "Employee submitted €100.00"                                    │
│  "Equivalent: $118.00 (Company currency)"                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Rule-Based Approval Examples

### Example 1: Sequential Approval

```
Rule: { ruleType: "Sequential", steps: [Manager, Finance, Director] }

Expense Flow:
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Employee │────▶│ Manager  │────▶│ Finance  │────▶│ Director │
│ Submits  │     │ Approves │     │ Approves │     │ Approves │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                          │
                                                          ▼
                                                    ┌──────────┐
                                                    │ APPROVED │
                                                    └──────────┘
```

### Example 2: Percentage Rule (60%)

```
Rule: { ruleType: "Percentage", percentage: 60, approvers: 5 }

Required: 3 out of 5 (60%)

Approval Tracking:
┌────────┬────────┬────────┬────────┬────────┐
│   A    │   B    │   C    │   D    │   E    │
├────────┼────────┼────────┼────────┼────────┤
│   ✓    │   ✓    │   ✓    │   -    │   -    │
│Approved│Approved│Approved│Pending │Pending │
└────────┴────────┴────────┴────────┴────────┘
         ↓
    60% Reached!
         ↓
   ┌──────────┐
   │ APPROVED │
   │  (Auto)  │
   └──────────┘

D and E don't need to review
```

### Example 3: Specific Approver (CFO)

```
Rule: { ruleType: "SpecificApprover", specificApprover: [CFO] }

Flow:
┌────────┬────────┬────────┬────────┐
│Manager │Finance │  CFO   │Director│
├────────┼────────┼────────┼────────┤
│   ✓    │   -    │   ✓    │   -    │
│Approved│Pending │Approved│Pending │
└────────┴────────┴────────┴────────┘
                    ↓
            CFO Approved!
                    ↓
              ┌──────────┐
              │ APPROVED │
              │  (Auto)  │
              └──────────┘

Finance and Director skipped
```

### Example 4: Hybrid Rule

```
Rule: {
  ruleType: "Hybrid",
  percentage: 60,
  specificApprover: [CFO],
  approvers: 5
}

Condition: (60% of approvers) OR (CFO approves)

Scenario A - Percentage Route:
┌───┬───┬───┬───┬───┐
│ A │ B │ C │ D │CFO│
├───┼───┼───┼───┼───┤
│ ✓ │ ✓ │ ✓ │ - │ - │
└───┴───┴───┴───┴───┘
     ↓
  60% Met → APPROVED

Scenario B - CFO Route:
┌───┬───┬───┬───┬───┐
│ A │ B │ C │ D │CFO│
├───┼───┼───┼───┼───┤
│ ✓ │ - │ - │ - │ ✓ │
└───┴───┴───┴───┴───┘
     ↓
CFO Approved → APPROVED
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ USER ACCESS                                                       │
└────────┬────────────────────────────────────────────────────────┘
         │
         ├─────────────┬────────────────┐
         ▼             ▼                ▼
    ┌────────┐   ┌────────┐      ┌────────┐
    │ LOGIN  │   │ SIGNUP │      │ FORGOT │
    └───┬────┘   └───┬────┘      └───┬────┘
        │            │               │
        ▼            ▼               ▼
┌────────────────────────────────────────────────────────────────┐
│ BACKEND AUTHENTICATION                                          │
│                                                                  │
│  LOGIN:                  SIGNUP:                FORGOT:         │
│   1. Verify email         1. Validate input     1. Check email  │
│   2. Check password       2. Hash password      2. Gen token    │
│   3. Generate JWT         3. Create company     3. Send email   │
│   4. Create session       4. Create admin user  4. Reset link   │
│   5. Return token         5. Generate JWT                       │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ STORE AUTH STATE                                                  │
│  • Frontend: Context API + LocalStorage                          │
│  • Backend: Session + JWT                                        │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ PROTECTED ROUTES                                                  │
│                                                                   │
│  Every API request:                                              │
│   1. Check JWT token in header                                   │
│   2. Verify token validity                                       │
│   3. Extract user info (id, role)                                │
│   4. Check role permissions                                      │
│   5. Allow/Deny access                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXPENSE LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

    DRAFT → IN_PROGRESS → APPROVED
                ↓
            REJECTED

Detailed State Transitions:

1. DRAFT
   ├─ Employee saves without submitting
   └─ Can edit and delete

2. IN_PROGRESS (After submit)
   ├─ Approval flow initialized
   ├─ Current approver assigned
   ├─ Approvers can view and decide
   └─ Cannot be edited by employee

3. APPROVED (Final state)
   ├─ All approval conditions met
   ├─ Read-only for all
   └─ Can be exported/reported

4. REJECTED (Final state)
   ├─ Any approver rejected
   ├─ Flow stopped
   └─ Employee can view rejection reason
```

---

## 🗄️ Database Relationships Diagram

```
                    ┌─────────────┐
                    │   Company   │
                    │ ─────────── │
                    │ _id         │◀──────────┐
                    │ country     │           │
                    │ currency    │           │ Many-to-One
                    │ admin       │           │
                    └──────┬──────┘           │
                           │                  │
                           │ One-to-Many      │
                           ▼                  │
                    ┌─────────────┐           │
              ┌─────│    User     │           │
              │     │ ─────────── │           │
              │     │ _id         │           │
              │     │ name        │           │
              │     │ email       │           │
              │     │ role        │           │
              │     │ company     │───────────┘
              │     │ manager     │◀──┐ Self-reference
              │     │isManagerAppr│   │
              │     └──────┬──────┘   │
              │            │          │
              │            └──────────┘
              │ One-to-Many
              ▼
       ┌─────────────┐
       │   Expense   │
       │ ─────────── │
       │ _id         │
       │ employee    │─────────────────┐
       │ amount      │                 │ Many-to-One
       │ currency    │                 │
       │ convertedAmt│                 │
       │ category    │                 ▼
       │ description │          ┌─────────────┐
       │ status      │          │    User     │
       │currentApprv │◀─────────│ (employee)  │
       │approvalRule │──┐       └─────────────┘
       │approvalFlow │──┼┐
       │ history[]   │  ││
       └─────────────┘  ││
                        ││
         ┌──────────────┘│
         │               │
         ▼               ▼
┌─────────────┐   ┌─────────────┐
│ApprovalRule │   │ApprovalFlow │
│─────────────│   │─────────────│
│ _id         │   │ _id         │
│ company     │   │ expense     │
│ name        │   │ company     │
│ steps[]     │   │ steps[]     │
│ ruleType    │   │ overallStat │
│ percentage  │   │             │
│ specificAppr│   │             │
└─────────────┘   └─────────────┘
```

---

**Visual Documentation Complete ✓**

For more details, see:

-   [README.md](README.md) - Full documentation
-   [APPROVAL_FLOW_DOCUMENTATION.md](server/APPROVAL_FLOW_DOCUMENTATION.md) - Approval logic
-   [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Implementation summary
