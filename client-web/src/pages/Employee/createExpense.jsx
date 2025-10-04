// pages/CreateExpense.js
import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { ProgressBar } from 'primereact/progressbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchPost, fetchGet } from '../../utils/fetch.utils';
import PageLayout from '../../components/employeelayout/PageLayout';
// Add to your existing imports
import { Dropdown } from 'primereact/dropdown';
import {
	Upload,
	Camera,
	DollarSign,
	Calendar as CalendarIcon,
	Tag as TagIcon,
	FileText,
	User,
	Globe,
	CheckCircle,
	AlertCircle,
	Loader2,
	Receipt,
	Scan,
	X,
	ArrowLeft,
	Building,
	CreditCard,
} from 'lucide-react';

const CreateExpense = () => {
	const [formData, setFormData] = useState({
		amount: null,
		currency: 'USD',
		category: '',
		description: '',
		date: new Date(),
		paidBy: '',
	});
	const [suggestedCategories, setSuggestedCategories] = useState([]);
	const [uploadedReceipt, setUploadedReceipt] = useState(null);
	const [ocrProcessing, setOcrProcessing] = useState(false);
	const [ocrResult, setOcrResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const toast = useRef(null);
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const commonCategories = [
		'Travel',
		'Meals',
		'Office Supplies',
		'Equipment',
		'Software',
		'Training',
		'Transportation',
		'Accommodation',
		'Entertainment',
		'Other',
	];

	// Add this state near other useState declarations
	const [currencies, setCurrencies] = useState([]);
	const [loadingCurrencies, setLoadingCurrencies] = useState(false);

	// Add this useEffect to fetch currencies
	useEffect(() => {
		fetchCurrencies();
	}, []);

	// Add this function to fetch currencies from API
	const fetchCurrencies = async () => {
		setLoadingCurrencies(true);
		try {
			const response = await fetch(
				'https://restcountries.com/v3.1/all?fields=name,currencies'
			);
			const data = await response.json();

			const currencySet = new Set();
			data.forEach((country) => {
				if (country.currencies) {
					Object.keys(country.currencies).forEach((currencyCode) => {
						const currency = country.currencies[currencyCode];
						if (currency.name && currencyCode) {
							currencySet.add(
								JSON.stringify({
									code: currencyCode,
									name: currency.name,
									symbol: currency.symbol || '',
								})
							);
						}
					});
				}
			});

			const uniqueCurrencies = Array.from(currencySet)
				.map((item) => JSON.parse(item))
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((currency) => ({
					label: `${currency.code} - ${currency.name} ${
						currency.symbol ? `(${currency.symbol})` : ''
					}`,
					value: currency.code,
				}));

			setCurrencies(uniqueCurrencies);
		} catch (error) {
			console.error('Error fetching currencies:', error);
			// Fallback to common currencies if API fails
			setCurrencies([
				{ label: 'USD - US Dollar ($)', value: 'USD' },
				{ label: 'EUR - Euro (€)', value: 'EUR' },
				{ label: 'GBP - British Pound (£)', value: 'GBP' },
				{ label: 'INR - Indian Rupee (₹)', value: 'INR' },
				{ label: 'CAD - Canadian Dollar (C$)', value: 'CAD' },
				{ label: 'AUD - Australian Dollar (A$)', value: 'AUD' },
				{ label: 'JPY - Japanese Yen (¥)', value: 'JPY' },
				{ label: 'CNY - Chinese Yuan (¥)', value: 'CNY' },
			]);
		}
		setLoadingCurrencies(false);
	};
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	const fetchUsers = async () => {
		setLoadingUsers(true);
		try {
			const result = await fetchGet({ pathName: 'employee/all-users' });

			if (result?.success) {
				setUsers(
					result.users.map((u) => ({
						label: u.name,
						value: u._id,
					}))
				);
			} else {
				console.error('Failed to fetch users:', result?.message);
			}
		} catch (err) {
			console.error('Error fetching users:', err);
		}
		setLoadingUsers(false);
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const searchCategories = (event) => {
		setTimeout(() => {
			let filteredCategories;
			if (!event.query.trim().length) {
				filteredCategories = [...commonCategories];
			} else {
				filteredCategories = commonCategories.filter((category) => {
					return category.toLowerCase().includes(event.query.toLowerCase());
				});
			}
			setSuggestedCategories(filteredCategories);
		}, 250);
	};

	const simulateOCRProcessing = (file) => {
		setOcrProcessing(true);
		// Simulate OCR processing
		setTimeout(() => {
			const mockOcrData = {
				totalAmount: Math.random() * 500 + 50,
				date: new Date(),
				merchant: 'Sample Merchant',
				items: ['Item 1', 'Item 2'],
			};

			setOcrResult(mockOcrData);
			setFormData((prev) => ({
				...prev,
				amount: mockOcrData.totalAmount,
				date: mockOcrData.date,
				description: `Expense from ${mockOcrData.merchant}`,
			}));
			setOcrProcessing(false);

			toast.current.show({
				severity: 'success',
				summary: 'Receipt Processed',
				detail: 'Amount and details extracted from receipt',
				life: 4000,
			});
		}, 2000);
	};

	const handleFileUpload = (event) => {
		const file = event.files[0];
		if (file) {
			setUploadedReceipt(file);
			simulateOCRProcessing(file);
		}
	};

	const removeReceipt = () => {
		setUploadedReceipt(null);
		setOcrResult(null);
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.description?.trim()) newErrors.description = 'Description is required';
		if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Valid amount is required';
		if (!formData.category?.trim()) newErrors.category = 'Category is required';
		if (!formData.date) newErrors.date = 'Date is required';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) {
			toast.current.show({
				severity: 'error',
				summary: 'Validation Error',
				detail: 'Please fill all required fields correctly',
				life: 5000,
			});
			return;
		}

		setLoading(true);
		try {
			const submitData = {
				...formData,
				date: formData.date.toISOString(),
				submitForApproval: true,
			};

			const result = await fetchPost({
				pathName: 'employee/create-expense',
				body: JSON.stringify(submitData),
			});

			if (result.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Expense Created',
					detail: 'Expense submitted for approval successfully',
					life: 4000,
				});
				// setTimeout(() => navigate('/dashboard'), 1500);
			} else {
				throw new Error(result.message || 'Failed to create expense');
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Submission Failed',
				detail: error.message,
				life: 5000,
			});
		}
		setLoading(false);
	};

	return (
		<PageLayout>
			<Toast ref={toast} position="top-right" />

			{/* Header */}
			<div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 mb-6 shadow-xl border border-white/20">
				<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
					<div className="flex items-center gap-4">
						<div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white">
							<Receipt size={32} />
						</div>
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								Create New Expense
							</h1>
							<p className="text-gray-600 text-lg mt-1">
								Upload receipt or fill details manually
							</p>
						</div>
					</div>
					<Button
						label="Back to Dashboard"
						icon={<ArrowLeft size={16} />}
						className="p-button-outlined p-button-secondary border-gray-300 text-gray-700 hover:bg-gray-50"
						onClick={() => navigate('/')}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1  w-full">
				{/* Main Form */}
				<div className="xl:col-span-2">
					<Card className="shadow-xl border-0 rounded-2xl bg-white/90 backdrop-blur-sm">
						<div className="p-6">
							{/* Receipt Upload Section */}
							<div className="mb-8">
								<div className="flex items-center gap-3 mb-4">
									<div className="bg-blue-100 p-2 rounded-lg">
										<Camera className="text-blue-600" size={20} />
									</div>
									<h2 className="text-xl font-semibold text-gray-800">
										Upload Receipt
									</h2>
								</div>
								<p className="text-gray-600 mb-4">
									Take a photo or upload receipt for automatic data extraction
								</p>

								{!uploadedReceipt ? (
									<div
										className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer"
										onClick={() =>
											document.querySelector('.p-fileupload-choose').click()
										}
									>
										<Upload className="mx-auto text-gray-400 mb-3" size={48} />
										<p className="text-gray-600 font-medium mb-2">
											Drag & drop receipt here
										</p>
										<p className="text-gray-500 text-sm">
											or click to browse files
										</p>
										<p className="text-gray-400 text-xs mt-2">
											Supports JPG, PNG, PDF (Max 5MB)
										</p>
										<FileUpload
											mode="basic"
											name="receipt"
											accept="image/*,.pdf"
											maxFileSize={5000000}
											customUpload
											uploadHandler={handleFileUpload}
											chooseOptions={{ style: { display: 'none' } }}
										/>
									</div>
								) : (
									<div className="border border-green-200 rounded-2xl p-6 bg-green-50">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-3">
												<CheckCircle className="text-green-600" size={24} />
												<span className="font-semibold text-green-800">
													Receipt Uploaded
												</span>
											</div>
											<Button
												icon={<X size={16} />}
												className="p-button-text p-button-danger"
												onClick={removeReceipt}
											/>
										</div>
										<div className="flex items-center gap-3 text-sm text-green-700">
											<FileText size={16} />
											<span>{uploadedReceipt.name}</span>
										</div>
									</div>
								)}

								{ocrProcessing && (
									<div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
										<div className="flex items-center gap-3">
											<Loader2
												className="text-blue-600 animate-spin"
												size={20}
											/>
											<span className="text-blue-800 font-medium">
												Processing receipt with OCR...
											</span>
										</div>
										<ProgressBar mode="indeterminate" className="mt-2 h-2" />
									</div>
								)}

								{ocrResult && (
									<Message
										severity="success"
										text="Receipt processed successfully! Amount and details auto-filled."
										className="mt-4 border-green-200 bg-green-50"
									/>
								)}
							</div>

							<Divider />

							{/* Expense Details */}
							<div className="mb-8">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-purple-100 p-2 rounded-lg">
										<CreditCard className="text-purple-600" size={20} />
									</div>
									<h2 className="text-xl font-semibold text-gray-800">
										Expense Details
									</h2>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Description */}
									<div className="md:col-span-2">
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<FileText size={16} />
											Description <span className="text-red-500">*</span>
										</label>
										<InputText
											value={formData.description}
											onChange={(e) =>
												setFormData({
													...formData,
													description: e.target.value,
												})
											}
											placeholder="Enter expense description"
											className={`w-full ${
												errors.description ? 'p-invalid' : ''
											}`}
										/>
										{errors.description && (
											<small className="p-error block mt-1">
												{errors.description}
											</small>
										)}
									</div>

									{/* Amount */}
									<div>
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<DollarSign size={16} />
											Amount <span className="text-red-500">*</span>
										</label>
										<InputNumber
											value={formData.amount}
											onValueChange={(e) =>
												setFormData({ ...formData, amount: e.value })
											}
											mode="currency"
											currency="USD"
											locale="en-US"
											className={`w-full ${errors.amount ? 'p-invalid' : ''}`}
										/>
										{errors.amount && (
											<small className="p-error block mt-1">
												{errors.amount}
											</small>
										)}
									</div>

									{/* Currency */}
									<div>
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<Globe size={16} />
											Currency
										</label>
										<Dropdown
											value={formData.currency}
											options={currencies}
											onChange={(e) =>
												setFormData({ ...formData, currency: e.value })
											}
											optionLabel="label"
											placeholder={
												loadingCurrencies
													? 'Loading currencies...'
													: 'Select Currency'
											}
											className="w-full"
											filter
											showClear
											loading={loadingCurrencies}
										/>
									</div>

									{/* Category */}
									<div>
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<TagIcon size={16} />
											Category <span className="text-red-500">*</span>
										</label>
										<AutoComplete
											value={formData.category}
											suggestions={suggestedCategories}
											completeMethod={searchCategories}
											onChange={(e) =>
												setFormData({ ...formData, category: e.value })
											}
											placeholder="Type category..."
											className={`w-full ${
												errors.category ? 'p-invalid' : ''
											}`}
										/>
										{errors.category && (
											<small className="p-error block mt-1">
												{errors.category}
											</small>
										)}
									</div>

									{/* Date */}
									<div>
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<CalendarIcon size={16} />
											Date <span className="text-red-500">*</span>
										</label>
										<Calendar
											value={formData.date}
											onChange={(e) =>
												setFormData({ ...formData, date: e.value })
											}
											dateFormat="dd/mm/yy"
											showIcon
											className={`w-full ${errors.date ? 'p-invalid' : ''}`}
										/>
										{errors.date && (
											<small className="p-error block mt-1">
												{errors.date}
											</small>
										)}
									</div>

									{/* Paid By */}
									<div>
										<label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
											<User size={16} />
											Paid By
										</label>
										<Dropdown
											value={formData.paidBy}
											options={users}
											onChange={(e) =>
												setFormData({ ...formData, paidBy: e.value })
											}
											placeholder={
												loadingUsers ? 'Loading users...' : 'Select user'
											}
											className="w-full"
											filter
											showClear
											loading={loadingUsers}
										/>
									</div>
								</div>
							</div>

							<Divider />

							{/* Submit Section */}
							<div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-4">
								<div className="flex items-center gap-3 text-gray-600">
									<Building size={18} />
									<span className="text-sm">
										Company: {currentUser?.company?.name || 'Your Company'}
									</span>
								</div>
								<div className="flex gap-3">
									<Button
										label="Cancel"
										icon={<X size={16} />}
										className="p-button-outlined p-button-secondary border-gray-300 text-gray-700 px-6"
										onClick={() => navigate('/')}
										disabled={loading}
									/>
									<Button
										label={loading ? 'Submitting...' : 'Submit Expense'}
										icon={
											loading ? (
												<Loader2 className="animate-spin" size={16} />
											) : (
												<CheckCircle size={16} />
											)
										}
										onClick={handleSubmit}
										disabled={loading}
										className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-6 hover:from-blue-600 hover:to-purple-700"
									/>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</PageLayout>
	);
};

export default CreateExpense;
