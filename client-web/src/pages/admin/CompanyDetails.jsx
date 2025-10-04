import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'lucide-react';
import PageLayout from '../../components/admin/PageLayout';

const CompanyDetails = () => {
	// Mock initial data; in real app, fetch from backend
	const [companyInfo, setCompanyInfo] = useState({
		name: 'My Company',
		country: 'India',
		currency: 'INR',
		email: 'contact@mycompany.com',
		phone: '+91 98765 43210',
		address: '123 Business Street, Mumbai, Maharashtra 400001',
	});

	const [editMode, setEditMode] = useState(false);
	const [formData, setFormData] = useState({ ...companyInfo });

	// Handle input changes
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Save updates
	const handleSave = () => {
		setCompanyInfo({ ...formData });
		setEditMode(false);
		// TODO: Send formData to backend API to update company info
		console.log('Updated company info:', formData);
	};

	const header = (
		<div className="flex justify-between items-center p-4">
			<div>
				<h2 className="text-2xl font-bold text-gray-800">Company Details</h2>
				<p className="text-gray-600 mt-1">Manage your company information and settings</p>
			</div>
			<Button
				label={editMode ? 'Cancel' : 'Edit Details'}
				icon={editMode ? 'pi pi-times' : 'pi pi-pencil'}
				className={editMode ? 'p-button-outlined p-button-secondary' : 'p-button-primary'}
				onClick={() => {
					if (editMode) setFormData({ ...companyInfo }); // Reset if cancel
					setEditMode(!editMode);
				}}
			/>
		</div>
	);

	return (
		<PageLayout>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
				<div className="max-w-4xl mx-auto">
					<Card
						header={header}
						className="shadow-xl border-0 rounded-2xl overflow-hidden"
					>
						<div className="p-4 md:p-6">
							{/* Basic Information Section */}
							<div className="mb-8">
								<h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
									<i className="pi pi-building mr-2 text-blue-500"></i>
									Basic Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Company Name */}
									<div className="space-y-2">
										<label className="block font-medium text-slate-700">
											Company Name *
										</label>
										{editMode ? (
											<InputText
												name="name"
												value={formData.name}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												placeholder="Enter company name"
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
										{editMode ? (
											<InputText
												name="country"
												value={formData.country}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
												disabled
											/>
										) : (
											<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
												<p className="text-slate-800 font-medium">
													{companyInfo.country}
												</p>
											</div>
										)}
										{editMode && (
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
										{editMode ? (
											<InputText
												name="currency"
												value={formData.currency}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
												disabled
											/>
										) : (
											<div className="p-3 bg-slate-50 rounded-lg border border-transparent">
												<p className="text-slate-800 font-medium">
													{companyInfo.currency}
												</p>
											</div>
										)}
										{editMode && (
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
										{editMode ? (
											<InputText
												name="email"
												value={formData.email}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												placeholder="company@email.com"
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

							{/* Contact Information Section */}
							<div className="mb-8">
								<h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
									<i className="pi pi-phone mr-2 text-green-500"></i>
									Contact Information
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Phone */}
									<div className="space-y-2">
										<label className="block font-medium text-slate-700">
											Phone Number
										</label>
										{editMode ? (
											<InputText
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												placeholder="+91 00000 00000"
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
										{editMode ? (
											<InputText
												name="address"
												value={formData.address}
												onChange={handleChange}
												className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
												placeholder="Enter your business address"
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

							{/* Save button */}
							{editMode && (
								<div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
									<Button
										label="Cancel"
										icon="pi pi-times"
										className="p-button-outlined p-button-secondary"
										onClick={() => {
											setFormData({ ...companyInfo });
											setEditMode(false);
										}}
									/>
									<Button
										label="Save Changes"
										icon="pi pi-check"
										className="p-button-primary bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg"
										onClick={handleSave}
									/>
								</div>
							)}
						</div>
					</Card>
				</div>
			</div>
		</PageLayout>
	);
};

export default CompanyDetails;
