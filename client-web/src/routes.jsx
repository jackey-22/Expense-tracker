import { createBrowserRouter, useParams } from 'react-router-dom';
import { loginLoader, verifyLoader } from './loaders/verify.loader';
import ErrorElement from './components/ErrorElement';
// import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApprovalRule from './pages/admin/ApprovalRule';
import ManageExpenses from './pages/admin/ManageExpenses';
import UserManagement from './pages/admin/UserManagement';
// import ProducerDashboard from './pages/Producers/Dashboard';
// import Registration from './pages/Producers/Registration';

const routes = createBrowserRouter([
	{
		path: '/',
		// loader: loginLoader,
		element: <Login />,
	},
	{
		path: '/login',
		// loader: loginLoader,
		element: <Login />,
	},
	{
		path: '/Signup',
		// loader: loginLoader,
		element: <Signup />,
	},
	{
		path: '/forgot-password',
		loader: loginLoader,
		element: <ForgotPassword />,
	},
	{
		path: '/admin',
		errorElement: <ErrorElement />,
		children: [
			{ path: 'dashboard', element: <AdminDashboard /> },
			{ path: 'approve-rules', element: <ApprovalRule /> },
			{ path: 'manage-expenses', element: <ManageExpenses /> },
			{ path: 'manage-users', element: <UserManagement /> },
		],
	},
	// Catch all
	{
		path: '*',
		element: <ErrorElement />,
	},
]);

export default routes;
