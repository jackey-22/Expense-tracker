import React, { useState } from 'react';
import { Mail, Building, Phone, User, Calendar, Lock } from 'lucide-react';
import PageLayout from '../../components/employeelayout/PageLayout';

const EmployeeProfile = () => {
	const [employee, setEmployee] = useState({
		name: 'Bansi Patel',
		email: 'bansi@gmail.com',
		phone: '+1 (555) 987-6543',
		department: 'IT',
		designation: 'Software Engineer',
		joiningDate: '2022-06-15',
		company: { name: 'Odoo' },
		profilePic:
			'https://ui-avatars.com/api/?name=Bansi+Patel&background=22c55e&color=ffffff&size=150',
	});

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setEmployee({
					...employee,
					profilePic: e.target.result,
				});
			};
			reader.readAsDataURL(file);
		}
	};

	const handleResetPassword = () => {
		alert('Reset password functionality triggered');
	};

	return (
		<PageLayout>
			<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
					<p className="text-gray-600 mt-2">
						Manage your personal information and account settings
					</p>
				</div>

				<div className="rounded-2xl shadow-lg w-full max-w-4xl overflow-hidden flex flex-col md:flex-row mx-auto">
					{/* Left Side - Profile Picture */}
					<div className="p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 md:w-1/3 bg-white">
						<div className="relative mb-6">
							<img
								src={employee.profilePic}
								alt={employee.name}
								className="w-32 h-32 rounded-full object-cover border-4 border-green-100 shadow-md"
							/>
							<label
								htmlFor="profile-upload"
								className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg"
							>
								<User size={16} />
								<input
									id="profile-upload"
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="hidden"
								/>
							</label>
						</div>

						<div className="text-center mb-6">
							<h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
							<p className="text-gray-600 mt-1">{employee.designation}</p>
							<p className="text-gray-500 text-sm mt-1">
								{employee.department} Department
							</p>
						</div>

						<button
							onClick={handleResetPassword}
							className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2"
						>
							<Lock size={18} />
							Reset Password
						</button>
					</div>

					{/* Right Side - Details */}
					<div className="p-8 flex-1">
						<h3 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-200">
							Contact & Work Information
						</h3>
						<div className="space-y-6">
							{/* Email */}
							<div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
								<div className="p-3 bg-blue-100 rounded-lg shadow-sm">
									<Mail size={22} className="text-blue-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">
										Email Address
									</p>
									<p className="text-gray-900 font-semibold">{employee.email}</p>
								</div>
							</div>

							{/* Phone */}
							<div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
								<div className="p-3 bg-green-100 rounded-lg shadow-sm">
									<Phone size={22} className="text-green-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">
										Phone Number
									</p>
									<p className="text-gray-900 font-semibold">{employee.phone}</p>
								</div>
							</div>

							{/* Company */}
							<div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
								<div className="p-3 bg-purple-100 rounded-lg shadow-sm">
									<Building size={22} className="text-purple-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">Company</p>
									<p className="text-gray-900 font-semibold">
										{employee.company.name}
									</p>
								</div>
							</div>

							{/* Joining Date */}
							<div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
								<div className="p-3 bg-yellow-100 rounded-lg shadow-sm">
									<Calendar size={22} className="text-yellow-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">
										Joining Date
									</p>
									<p className="text-gray-900 font-semibold">
										{new Date(employee.joiningDate).toLocaleDateString(
											'en-US',
											{
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											}
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default EmployeeProfile;
