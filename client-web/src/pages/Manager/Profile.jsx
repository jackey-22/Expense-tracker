import React, { useState } from 'react';
import { Mail, Building, Phone, Camera } from 'lucide-react';
import PageLayout from '../../components/manager/PageLayout';

const ManagerProfilePage = () => {
	const [manager, setManager] = useState({
		name: 'Alice',
		email: 'alice.manager@example.com',
		phone: '+1 (555) 123-4567',
		role: 'Manager',
		company: { name: 'TechCorp Inc.' },
		profilePic:
			'https://ui-avatars.com/api/?name=Alice+Manager&background=6366f1&color=ffffff&size=150',
	});

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setManager({
					...manager,
					profilePic: e.target.result,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<PageLayout>
			<div className="min-h-screen bg-gray-50 flex justify-center items-start p-4 sm:p-8">
				<div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
					{/* Profile Header */}
					<div className="p-8 flex flex-col items-center border-b border-gray-100">
						<div className="relative">
							<img
								src={manager.profilePic}
								alt={manager.name}
								className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
							/>
							<label
								htmlFor="profile-upload"
								className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg"
							>
								<Camera size={16} />
								<input
									id="profile-upload"
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="hidden"
								/>
							</label>
						</div>
						<h2 className="text-2xl font-bold text-gray-900 mt-4">{manager.name}</h2>
						<p className="text-gray-600">{manager.role}</p>
					</div>

					{/* Details Section */}
					<div className="p-8">
						<h3 className="text-xl font-semibold text-gray-900 mb-6">
							Contact Information
						</h3>

						<div className="space-y-6">
							{/* Email */}
							<div className="flex items-start space-x-4">
								<div className="p-2 bg-blue-100 rounded-lg">
									<Mail size={20} className="text-blue-600" />
								</div>
								<div>
									<p className="text-sm font-medium text-gray-600">Email</p>
									<p className="text-gray-900">{manager.email}</p>
								</div>
							</div>

							{/* Phone */}
							<div className="flex items-start space-x-4">
								<div className="p-2 bg-green-100 rounded-lg">
									<Phone size={20} className="text-green-600" />
								</div>
								<div>
									<p className="text-sm font-medium text-gray-600">Phone</p>
									<p className="text-gray-900">{manager.phone}</p>
								</div>
							</div>

							{/* Company */}
							<div className="flex items-start space-x-4">
								<div className="p-2 bg-purple-100 rounded-lg">
									<Building size={20} className="text-purple-600" />
								</div>
								<div>
									<p className="text-sm font-medium text-gray-600">Company</p>
									<p className="text-gray-900">{manager.company.name}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default ManagerProfilePage;
