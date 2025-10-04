// components/PageLayout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function PageLayout({ children }) {
	const [sidebarVisible, setSidebarVisible] = useState(false);

	const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
	const closeSidebar = () => setSidebarVisible(false);

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
			<div className="fixed top-0 left-0 right-0 z-50">
				<Header onToggleSidebar={toggleSidebar} />
			</div>

			<div className="flex flex-1 pt-16">
				{/* Mobile Overlay */}
				{sidebarVisible && (
					<div
						className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
						onClick={closeSidebar}
					/>
				)}

				{/* Sidebar */}
				<div
					className={`fixed z-40 top-16 bottom-0 left-0 w-64 p-4 pt-10 bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out
                        ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'}
                        md:static md:translate-x-0 md:z-auto md:shadow-none overflow-y-auto`}
				>
					<Sidebar isVisible={sidebarVisible} onClose={closeSidebar} />
				</div>

				{/* Main Content */}
				<main
					className="flex-1 p-6 overflow-y-auto transition-all duration-300 w-full"
					style={{ height: 'calc(100vh - 4rem)' }}
				>
					<div className="max-w-7xl mx-auto">{children}</div>
				</main>
			</div>
		</div>
	);
}
