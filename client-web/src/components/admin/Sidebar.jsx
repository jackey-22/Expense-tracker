import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function Sidebar({ isVisible, onClose }) {
	const navigate = useNavigate();
	const role = localStorage.getItem('role')?.toLowerCase();

	const roleRoutes = {
		admin: [
			{ name: 'Dashboard', route: '/admin/dashboard', icon: 'pi pi-home' },
			{ name: 'Users', route: '/admin/manage-users', icon: 'pi pi-users' },
			{ name: 'Rules', route: '/admin/approval-rules', icon: 'pi pi-list-check' },
			{ name: 'Expenses', route: '/admin/manage-expenses', icon: 'pi pi-wallet' },
			
		],
	};

	const logout = () => {
		localStorage.clear();
		navigate('/login');
	};

	const links = roleRoutes[role] || [];

	return (
		<aside
			className={`bg-white border-r border-gray-200 shadow-lg 
    w-60 flex-shrink-0 flex flex-col justify-between 
    transition-transform duration-300 ease-in-out 
    fixed top-16 left-0 z-30 h-[calc(100vh-4rem)]
    ${isVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
		>
			<nav className="px-6 py-8 space-y-4 overflow-y-auto flex-1">
				{links.map((link) => (
					<NavLink
						key={link.name}
						to={link.route}
						onClick={onClose}
						className={({ isActive }) =>
							`flex items-center gap-4 px-5 py-3 rounded-xl font-semibold text-lg transition-all ${
								isActive
									? 'bg-blue-600 text-white shadow'
									: 'text-gray-700 hover:bg-blue-100'
							}`
						}
					>
						<i className={`${link.icon} text-xl`}></i>
						<span>{link.name}</span>
					</NavLink>
				))}
			</nav>

			<div className="px-6 py-6 border-t border-gray-200">
				<Button
					icon="pi pi-sign-out"
					label="Logout"
					onClick={logout}
					className="w-full p-button-text text-lg text-red-600 dark:text-red-400 hover:bg-red-100 transition-all"
				/>
			</div>
		</aside>
	);
}
