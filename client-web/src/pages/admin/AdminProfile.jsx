import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Users, Mail, Phone, Building } from 'lucide-react';
import PageLayout from '../../components/admin/PageLayout';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard({ onToggleSidebar }) {
	const { currentUser } = useAuth();

	// Admin Profile
	const [editAdmin, setEditAdmin] = useState(false);
	const [adminInfo, setAdminInfo] = useState({
		name: currentUser?.name || 'Khushi Patel',
		role: currentUser?.role || 'IT Department',
		email: currentUser?.email || 'khushipatela@gmail.com',
		phone: currentUser?.phone || '+91 98765 43210',
		profilePic: currentUser?.avatar || '',
	});
	const [adminForm, setAdminForm] = useState({ ...adminInfo });

	const handleAdminChange = (e) => {
		setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
	};
	const handleAdminSave = () => {
		setAdminInfo({ ...adminForm });
		setEditAdmin(false);
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => setAdminInfo({ ...adminInfo, profilePic: e.target.result });
			reader.readAsDataURL(file);
		}
	};

	// Company Details
	const [editCompany, setEditCompany] = useState(false);
	const [companyInfo, setCompanyInfo] = useState({
		name: 'Odoo',
		country: 'India',
		currency: 'INR',
		email: 'odoo@gmail.com',
		phone: '+91 98765 43210',
		address: '123 Business Street, Ahmedabad, 400001',
	});
	const [companyForm, setCompanyForm] = useState({ ...companyInfo });

	const handleCompanyChange = (e) => {
		setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
	};
	const handleCompanySave = () => {
		setCompanyInfo({ ...companyForm });
		setEditCompany(false);
	};

	const companyHeader = (
		<div className="flex justify-between items-center p-4">
			<div>
				<h2 className="text-2xl font-bold text-gray-800">Company Details</h2>
				<p className="text-gray-600 mt-1">Manage your company information and settings</p>
			</div>
			<Button
				label={editCompany ? 'Cancel' : 'Edit Details'}
				icon={editCompany ? 'pi pi-times' : 'pi pi-pencil'}
				className={
					editCompany ? 'p-button-outlined p-button-secondary' : 'p-button-primary'
				}
				onClick={() => {
					if (editCompany) setCompanyForm({ ...companyInfo });
					setEditCompany(!editCompany);
				}}
			/>
		</div>
	);

	return (
		<PageLayout>
			<div className="min-h-screen bg-gray-50 p-4 sm:p-8">
				<div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
					{/* Left Side - Company Details */}
					<div className="flex-1">
						<Card
							header={companyHeader}
							className="shadow-xl border-0 rounded-2xl overflow-hidden"
						>
							<div className="p-4 md:p-6">
								{/* Basic Information */}
								<div className="mb-8">
									<h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
										<Building className="mr-2 text-blue-500" /> Basic
										Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Company Name */}
										<div className="space-y-2">
											<label className="block font-medium text-slate-700">
												Company Name *
											</label>
											{editCompany ? (
												<InputText
													name="name"
													value={companyForm.name}
													onChange={handleCompanyChange}
													className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												/>
											) : (
												<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
													<p className="text-slate-800 font-medium">
														{companyInfo.name}
													</p>
												</div>
											)}
										</div>

										{/* Country */}
										<div className="space-y-2">
											<label className="block font-medium text-slate-700">
												Country
											</label>
											<InputText
												name="country"
												value={companyInfo.country}
												disabled
												className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
											/>
											{editCompany && (
												<p className="text-xs text-slate-500">
													Country cannot be changed
												</p>
											)}
										</div>

										{/* Currency */}
										<div className="space-y-2">
											<label className="block font-medium text-slate-700">
												Currency
											</label>
											<InputText
												name="currency"
												value={companyInfo.currency}
												disabled
												className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
											/>
											{editCompany && (
												<p className="text-xs text-slate-500">
													Currency cannot be changed
												</p>
											)}
										</div>

										{/* Email */}
										<div className="space-y-2">
											<label className="block font-medium text-slate-700">
												Email Address
											</label>
											{editCompany ? (
												<InputText
													name="email"
													value={companyForm.email}
													onChange={handleCompanyChange}
													className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												/>
											) : (
												<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
													<p className="text-slate-800 font-medium">
														{companyInfo.email}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								<Divider />

								{/* Contact Information */}
								<div className="mb-8">
									<h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
										<Phone className="mr-2 text-green-500" /> Contact
										Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{/* Phone */}
										<div className="space-y-2">
											<label className="block font-medium text-slate-700">
												Phone Number
											</label>
											{editCompany ? (
												<InputText
													name="phone"
													value={companyForm.phone}
													onChange={handleCompanyChange}
													className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												/>
											) : (
												<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
													<p className="text-slate-800 font-medium">
														{companyInfo.phone}
													</p>
												</div>
											)}
										</div>

										{/* Address */}
										<div className="space-y-2 md:col-span-2">
											<label className="block font-medium text-slate-700">
												Business Address
											</label>
											{editCompany ? (
												<InputText
													name="address"
													value={companyForm.address}
													onChange={handleCompanyChange}
													className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												/>
											) : (
												<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
													<p className="text-slate-800 font-medium">
														{companyInfo.address}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* Save Buttons */}
								{editCompany && (
									<div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
										<Button
											label="Cancel"
											icon="pi pi-times"
											className="p-button-outlined p-button-secondary"
											onClick={() => {
												setCompanyForm({ ...companyInfo });
												setEditCompany(false);
											}}
										/>
										<Button
											label="Save Changes"
											icon="pi pi-check"
											className="p-button-primary bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg"
											onClick={handleCompanySave}
										/>
									</div>
								)}
							</div>
						</Card>
					</div>

					{/* Right Side - Admin Profile */}
					<div className="w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-lg">
						<div className="flex flex-col items-center mb-6">
							<div className="relative mb-4">
								<Avatar
									shape="circle"
									size="xlarge"
									className="bg-gradient-to-br from-blue-500 to-purple-600 text-white w-32 h-32 shadow-md"
									icon={<Users size={28} />}
									image={adminInfo.profilePic}
								/>
								{editAdmin && (
									<label
										htmlFor="profile-upload"
										className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 text-white"
									>
										<Users size={16} />
										<input
											id="profile-upload"
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</label>
								)}
							</div>
							<h2 className="text-2xl font-bold text-gray-900">{adminInfo.name}</h2>
							<p className="text-gray-500">{adminInfo.role}</p>
						</div>

						<div className="space-y-4">
							{/* Email */}
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
								<div className="p-3 bg-blue-100 rounded-lg shadow-sm">
									<Mail size={20} className="text-blue-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">Email</p>
									{editAdmin ? (
										<InputText
											name="email"
											value={adminForm.email}
											onChange={handleAdminChange}
											className="w-full p-2 border border-gray-300 rounded-lg"
										/>
									) : (
										<p className="text-gray-900 font-semibold">
											{adminInfo.email}
										</p>
									)}
								</div>
							</div>

							{/* Phone */}
							<div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all">
								<div className="p-3 bg-green-100 rounded-lg shadow-sm">
									<Phone size={20} className="text-green-600" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">Phone</p>
									{editAdmin ? (
										<InputText
											name="phone"
											value={adminForm.phone}
											onChange={handleAdminChange}
											className="w-full p-2 border border-gray-300 rounded-lg"
										/>
									) : (
										<p className="text-gray-900 font-semibold">
											{adminInfo.phone}
										</p>
									)}
								</div>
							</div>

							{/* Save/Edit Buttons */}
							<div className="flex justify-center mt-4 space-x-2">
								<Button
									label={editAdmin ? 'Save Changes' : 'Edit Profile'}
									icon={editAdmin ? 'pi pi-check' : 'pi pi-pencil'}
									className={`w-full ${
										editAdmin
											? 'bg-gradient-to-r from-blue-500 to-blue-600'
											: 'p-button-primary'
									}`}
									onClick={editAdmin ? handleAdminSave : () => setEditAdmin(true)}
								/>
								{editAdmin && (
									<Button
										label="Cancel"
										icon="pi pi-times"
										className="w-full p-button-outlined"
										onClick={() => {
											setAdminForm({ ...adminInfo });
											setEditAdmin(false);
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageLayout>
	);
}
