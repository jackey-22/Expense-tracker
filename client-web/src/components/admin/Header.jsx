import React from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Receipt } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	function handleProfileClick() {
		// Navigate to admin profile page
		navigate('/admin/profile');
	}

	return (
		<header className="flex items-center justify-between px-6 py-4 bg-white shadow-md z-50 w-full">
			<div className="flex items-center gap-3 min-w-0">
				<Button
					icon="pi pi-bars"
					className="p-button-text md:hidden my-auto"
					onClick={onToggleSidebar}
					aria-label="Toggle Menu"
				/>
				<div className="flex items-center gap-3">
					<div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl text-white">
						<Receipt size={28} />
					</div>
					<div>
						<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Expense Tracker
						</h1>
						<p className="text-sm text-gray-600">Manage your expenses efficiently</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				{/* Admin Profile */}
				<div
					className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
					onClick={handleProfileClick}
				>
					<div className="text-right hidden sm:block">
						<div className="font-semibold text-gray-800 text-sm">
							{currentUser?.name || 'Khushi Patel'}
						</div>
						<div className="text-xs text-gray-500">
							{currentUser?.role || 'IT Department'}
						</div>
					</div>
					<Avatar
						shape="circle"
						className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-10 h-10"
						icon={<Users size={20} />}
						image={currentUser?.avatar}
					/>
				</div>
			</div>
		</header>
	);
}
