# 🚀 Quick Start Guide

Get your Expense Tracker up and running in 5 minutes!

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

-   [ ] **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
-   [ ] **MongoDB** v5.0 or higher ([Download](https://www.mongodb.com/try/download/community))
-   [ ] **Git** ([Download](https://git-scm.com/downloads))
-   [ ] A code editor (VS Code recommended)
-   [ ] Terminal/Command Prompt

## ⚡ 5-Minute Setup

### Step 1: Clone and Install (2 min)

```bash
# Clone the repository
git clone https://github.com/jackey-22/Expense-tracker.git
cd Expense-tracker

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client-web
npm install
```

### Step 2: Configure Environment (1 min)

#### Backend Configuration

```bash
# In the server directory
cd server
cp .env.example .env
```

Edit `.env` with minimum required config:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-secret-key-change-this
SESSION_SECRET=your-session-secret
```

#### Frontend Configuration

```bash
# In the client-web directory
cd ../client-web
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB (30 sec)

```bash
# Start MongoDB service
# Windows (PowerShell as Admin):
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Step 4: Run the Application (1 min)

Open **two terminals**:

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd client-web
npm run dev
```

### Step 5: Access the App (30 sec)

Open your browser and go to:

```
http://localhost:5173
```

🎉 **You're ready to go!**

---

## 🎯 First-Time User Flow

### 1. Create Your Account

1. Click **"Sign Up"**
2. Fill in the form:
    - Name: `Admin User`
    - Email: `admin@company.com`
    - Password: `SecurePass123!`
    - Country: `United States` (or your country)
3. Click **"Create Account"**

✅ Your company is automatically created with USD currency!

### 2. Create Your First Users

As an admin, create some users:

**Manager:**

-   Name: `John Manager`
-   Email: `john@company.com`
-   Role: `Manager`
-   Department: `Finance`

**Employee:**

-   Name: `Jane Employee`
-   Email: `jane@company.com`
-   Role: `Employee`
-   Manager: `John Manager`
-   Department: `Sales`

### 3. Set Up Approval Rules

1. Go to **"Approval Rules"**
2. Click **"Create New Rule"**
3. Configure:
    - **Rule Name**: `Standard Approval`
    - **Manager First**: ✅ (checked)
    - **Add Approvers**: Select `John Manager`
    - **Rule Type**: `Sequential`
4. Click **"Save Rule"**

### 4. Submit Your First Expense

Login as `jane@company.com`:

1. Go to **"Submit Expense"**
2. Fill in:
    - Amount: `150.00`
    - Currency: `USD`
    - Category: `Travel`
    - Description: `Client meeting taxi`
    - Date: Today's date
3. Upload a receipt (optional)
4. Click **"Submit for Approval"**

### 5. Approve the Expense

Login as `john@company.com`:

1. Go to **"Pending Approvals"**
2. Click on Jane's expense
3. Review details
4. Click **"Approve"**
5. Add remarks: `Approved - Valid expense`
6. Submit

✅ **Expense approved! Jane will see it in her history.**

---

## 🛠️ Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solutions:**

```bash
# Check if MongoDB is running
# Windows:
net start | findstr "MongoDB"

# macOS/Linux:
sudo systemctl status mongod
# or
brew services list | grep mongodb

# If not running, start it:
# Windows:
net start MongoDB

# macOS/Linux:
sudo systemctl start mongod
# or
brew services start mongodb-community
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**

```bash
# Find and kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the port in .env:
PORT=5001
```

### Frontend Build Errors

**Error:** `Module not found` or dependencies issues

**Solutions:**

```bash
# Clear cache and reinstall
cd client-web
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:** Check that frontend .env has correct backend URL:

```env
VITE_API_URL=http://localhost:5000
```

And restart both servers.

---

## 🔧 Development Tips

### Hot Reload

Both servers support hot reload:

-   Backend: `nodemon` watches for file changes
-   Frontend: `Vite` provides instant HMR

### Useful Commands

```bash
# Backend
npm run dev          # Start with nodemon
npm start            # Start production mode
npm run lint         # Check code style

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code style
```

### Database Management

```bash
# View MongoDB data
mongo
use expense-tracker
db.users.find().pretty()
db.expenses.find().pretty()

# Or use MongoDB Compass (GUI)
# Download: https://www.mongodb.com/products/compass
```

### API Testing

Use the provided Postman collection:

1. Import `Expense-Tracker.postman_collection.json`
2. Set environment variables:
    - `base_url`: `http://localhost:5000`
    - `token`: (will be set after login)
3. Start with `/auth/signup` and `/auth/login`

### VS Code Extensions

Recommended extensions:

-   ESLint
-   Prettier
-   MongoDB for VS Code
-   REST Client
-   Tailwind CSS IntelliSense
-   React Developer Tools

---

## 📚 Next Steps

Now that you're up and running:

1. 📖 Read the [full README](README.md) for detailed features
2. 🔄 Check the [Approval Flow Documentation](server/APPROVAL_FLOW_DOCUMENTATION.md)
3. 🤝 Read [Contributing Guidelines](CONTRIBUTING.md) to contribute
4. 📊 Explore the admin dashboard and analytics
5. 🧪 Test different approval rule configurations

---

## 🆘 Need Help?

-   📧 Email: support@expensetracker.com
-   🐛 Issues: [GitHub Issues](https://github.com/jackey-22/Expense-tracker/issues)
-   💬 Discord: [Join our community](#)
-   📖 Docs: [Full Documentation](README.md)

---

## 🎓 Learning Resources

-   [Express.js Guide](https://expressjs.com/en/guide/routing.html)
-   [React Documentation](https://react.dev/)
-   [MongoDB Manual](https://docs.mongodb.com/manual/)
-   [PrimeReact Components](https://primereact.org/)
-   [TailwindCSS Docs](https://tailwindcss.com/docs)

---

**Happy Coding! 🚀**

[⬆ Back to README](README.md)
