# 💰 Expense Tracker - Frontend

Modern React-based frontend for the Expense Tracker Management System.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 19.1.1** - UI Framework
- **Vite** - Build tool
- **React Router v7** - Routing
- **PrimeReact** - UI Components
- **TailwindCSS** - Styling
- **Formik + Yup** - Form validation
- **Chart.js & Recharts** - Data visualization
- **Tesseract.js** - OCR for receipt scanning
- **Lucide React** - Icons

## 📁 Project Structure

```
client-web/
├── src/
│   ├── assets/          # Images, logos
│   ├── components/      # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── manager/     # Manager-specific components
│   │   ├── employeelayout/ # Employee-specific components
│   │   └── layout/      # Common layout components
│   ├── contexts/        # React contexts (Auth, etc.)
│   ├── loaders/         # Route loaders
│   ├── pages/           # Page components
│   │   ├── Admin/       # Admin pages
│   │   ├── Manager/     # Manager pages
│   │   ├── Employee/    # Employee pages
│   │   └── auth/        # Auth pages (Login, Signup)
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── routes.jsx       # Route definitions
│   └── main.jsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies

```

## 🎨 Features

### Employee Features
- Submit expenses with receipt upload
- View expense history and status
- Track approval progress
- OCR receipt scanning

### Manager Features
- Review pending approvals
- Approve/reject expenses with comments
- View team expenses
- Dashboard with statistics

### Admin Features
- User management (CRUD)
- Approval rule configuration
- Expense oversight
- Analytics and reports
- Bulk operations

## ⚙️ Configuration

Create `.env` file in the root:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Expense Tracker
```

## 🔧 Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Key Dependencies

```json
{
  "react": "^19.1.1",
  "react-router-dom": "^7.8.2",
  "primereact": "^10.9.7",
  "chart.js": "^4.5.0",
  "formik": "^2.4.6",
  "yup": "^1.7.0",
  "tesseract.js": "^6.0.1",
  "axios": "^1.11.0"
}
```

## 🌐 API Integration

All API calls go through the fetch utility in `src/utils/fetch.utils.js`:

```javascript
import { apiRequest } from './utils/fetch.utils';

// Example usage
const expenses = await apiRequest('/employee/expenses');
```

## 📱 Responsive Design

Built with mobile-first approach using TailwindCSS. Fully responsive across:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 🎯 Role-Based Routing

Routes are protected based on user roles:

```javascript
// Protected routes example
<Route path="/admin/*" element={<AdminLayout />}>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<UserManagement />} />
</Route>
```

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details.

---

For full documentation, see the [main README](../README.md) in the root directory.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
