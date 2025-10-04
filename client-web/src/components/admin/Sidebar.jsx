import React from 'react';
import { Button } from 'primereact/button';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, CheckCircle, LogOut } from 'lucide-react';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export default function Sidebar({ isVisible, onClose }) {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const navigationItems = [
		{
			label: 'Dashboard',
			icon: <LayoutDashboard size={20} />,
			route: '/admin/dashboard',
		},
		{
			label: 'Manage Users',
			icon: <Users size={20} />,
			route: '/admin/manage-users',
		},
		{
			label: 'Approval Rules',
			icon: <CheckCircle size={20} />,
			route: '/admin/approval-rules',
		},
		{
			label: 'Manage Expenses',
			icon: <FileText size={20} />,
			route: '/admin/manage-expenses',
		},
	];

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	const handleLogoutConfirm = () => {
		confirmDialog({
			message: 'Are you sure you want to logout?',
			header: 'Logout Confirmation',
			icon: 'pi pi-sign-out',
			acceptClassName: 'p-button-danger',
			rejectClassName: 'p-button-secondary p-button-text',
			acceptLabel: 'Yes',
			rejectLabel: 'No',
			accept: () => handleLogout(),
		});
	};

	return (
		<>
			<ConfirmDialog />
			<div className="h-full space-y-2">
				{navigationItems.map(({ label, icon, route }) => (
					<NavLink
						key={label}
						to={route}
						className={({ isActive }) =>
							`w-full text-base font-medium flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
								isActive
									? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
									: 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
							}`
						}
						onClick={onClose}
					>
						<span className="flex-shrink-0">{icon}</span>
						<span>{label}</span>
					</NavLink>
				))}

				<div className="pt-4 mt-4 border-t border-gray-200">
					<Button
						label="Logout"
						icon={<LogOut size={18} />}
						className="w-full p-button-text text-left text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-300 gap-3 px-4 py-3 rounded-lg justify-start"
						onClick={handleLogoutConfirm}
					/>
				</div>
			</div>
		</>
	);
}
