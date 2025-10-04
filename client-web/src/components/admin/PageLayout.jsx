import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function PageLayout({ children }) {
	const [sidebarVisible, setSidebarVisible] = useState(false);

	return (
		<div className="bg-gray-50">
			{/* Fixed Header */}
			<Header onToggleSidebar={() => setSidebarVisible((prev) => !prev)} />

			{/* Sidebar (Fixed) */}
			<Sidebar isVisible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

			{/* Main Content */}
			<div className="ml-60 pt-24 px-4 md:px-10 pb-6 min-h-screen">
				{/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 min-h-[80vh] overflow-auto"> */}
					{children}
				{/* </div> */}
			</div>
		</div>
	);
}
