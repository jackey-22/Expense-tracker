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
	Save,
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
	const [draftLoading, setDraftLoading] = useState(false);
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

	const [currencies, setCurrencies] = useState([]);
	const [loadingCurrencies, setLoadingCurrencies] = useState(false);
	const [users, setUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	// Fetch currencies
	useEffect(() => {
		fetchCurrencies();
	}, []);

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

	// Fetch users
	useEffect(() => {
		fetchUsers();
	}, []);

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

	// Real OCR Processing Function
	const processOCR = async (file) => {
		setOcrProcessing(true);
		try {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append('file', file);
			formData.append('language', 'eng');
			formData.append('isOverlayRequired', 'false');

			// Using Tesseract.js for OCR - Client-side processing
			const { createWorker } = await import('tesseract.js');
			const worker = await createWorker('eng');

			const { data } = await worker.recognize(file);
			await worker.terminate();

			// Parse the extracted text
			const extractedText = data.text;
			const parsedData = parseReceiptText(extractedText);

			setOcrResult({
				...parsedData,
				rawText: extractedText,
			});

			// Auto-fill form with extracted data
			setFormData((prev) => ({
				...prev,
				amount: parsedData.amount || prev.amount,
				date: parsedData.date || prev.date,
				description: parsedData.merchant
					? `Expense from ${parsedData.merchant}`
					: prev.description,
				category: parsedData.category || prev.category,
			}));

			toast.current.show({
				severity: 'success',
				summary: 'Receipt Processed',
				detail: 'Text extracted from receipt successfully',
				life: 4000,
			});
		} catch (error) {
			console.error('OCR Processing Error:', error);
			toast.current.show({
				severity: 'error',
				summary: 'OCR Failed',
				detail: 'Failed to process receipt. Please enter details manually.',
				life: 5000,
			});
		}
		setOcrProcessing(false);
	};

	// Parse extracted text to find relevant information
	const parseReceiptText = (text) => {
		const result = {
			amount: null,
			date: null,
			merchant: null,
			category: null,
		};

		// Extract amount (look for currency patterns)
		const amountMatches = text.match(/(\d+[.,]\d{2})/g);
		if (amountMatches) {
			// Take the largest number as the total amount
			const amounts = amountMatches.map((amt) => parseFloat(amt.replace(',', '.')));
			result.amount = Math.max(...amounts);
		}

		// Extract date (various date formats)
		const dateFormats = [
			/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/, // DD/MM/YY or DD-MM-YYYY
			/\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}/, // YYYY/MM/DD
			/\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}/i, // DD MMM YYYY
		];

		for (const format of dateFormats) {
			const dateMatch = text.match(format);
			if (dateMatch) {
				try {
					result.date = new Date(dateMatch[0]);
					if (!isNaN(result.date.getTime())) break;
				} catch (e) {
					// Continue to next format
				}
			}
		}

		// Extract merchant (look for common store names or text at beginning)
		const merchantKeywords = [
			'walmart',
			'target',
			'amazon',
			'starbucks',
			'mcdonalds',
			'uber',
			'lyft',
			'hotel',
			'restaurant',
			'cafe',
			'store',
			'market',
			'gas',
			'fuel',
		];

		const lines = text.split('\n').filter((line) => line.trim().length > 0);
		if (lines.length > 0) {
			// First non-empty line is often the merchant name
			result.merchant = lines[0].substring(0, 50); // Limit length
		}

		// Try to determine category from text content
		const categoryKeywords = {
			'Travel': ['uber', 'lyft', 'taxi', 'flight', 'hotel', 'airbnb', 'train', 'bus'],
			'Meals': ['restaurant', 'cafe', 'starbucks', 'mcdonalds', 'food', 'lunch', 'dinner'],
			'Office Supplies': ['office', 'stationery', 'pen', 'paper', 'printer'],
			'Equipment': ['computer', 'laptop', 'phone', 'tablet', 'camera'],
			'Software': ['software', 'subscription', 'license', 'app'],
			'Transportation': ['gas', 'fuel', 'parking', 'toll', 'car'],
			'Accommodation': ['hotel', 'motel', 'lodging', 'airbnb'],
		};

		const lowerText = text.toLowerCase();
		for (const [category, keywords] of Object.entries(categoryKeywords)) {
			if (keywords.some((keyword) => lowerText.includes(keyword))) {
				result.category = category;
				break;
			}
		}

		return result;
	};

	const handleFileUpload = (event) => {
		const file = event.files[0];
		if (file) {
			setUploadedReceipt(file);
			processOCR(file);
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

	// Save as Draft function
	// Save as Draft function
	const saveAsDraft = async () => {
		// For drafts, we don't validate all fields
		const hasMinimumData = formData.description?.trim() && formData.amount > 0;

		if (!hasMinimumData) {
			toast.current.show({
				severity: 'warn',
				summary: 'Minimum Data Required',
				detail: 'Please add at least description and amount to save as draft',
				life: 4000,
			});
			return;
		}

		setDraftLoading(true);
		try {
			const draftData = {
				...formData,
				date: formData.date.toISOString(),
				submitForApproval: false,
			};

			const result = await fetchPost({
				pathName: 'employee/create-expense',
				body: JSON.stringify(draftData),
			});

			if (result.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Draft Saved',
					detail: 'Expense saved as draft successfully',
					life: 4000,
				});

				// Clear the form and stay on the same page
				setFormData({
					amount: null,
					currency: 'USD',
					category: '',
					description: '',
					date: new Date(),
					paidBy: '',
				});

				// Clear uploaded receipt and OCR results
				setUploadedReceipt(null);
				setOcrResult(null);
			} else {
				throw new Error(result.message || 'Failed to save draft');
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Draft Save Failed',
				detail: error.message,
				life: 5000,
			});
		}
		setDraftLoading(false);
	};
	// Add this function near your other functions
	const clearForm = () => {
		setFormData({
			amount: null,
			currency: 'USD',
			category: '',
			description: '',
			date: new Date(),
			paidBy: '',
		});
		setUploadedReceipt(null);
		setOcrResult(null);
		setErrors({});

		toast.current.show({
			severity: 'info',
			summary: 'Form Cleared',
			detail: 'All form fields have been reset',
			life: 3000,
		});
	};
	// Submit expense for approval
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
				setTimeout(() => navigate('/dashboard'), 1500);
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

			<div className="grid grid-cols-1 w-full">
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
									<div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300">
										<Scan className="mx-auto text-gray-400 mb-3" size={48} />
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
											auto
											chooseLabel="Browse Files"
											style={{ display: 'block', marginTop: '1rem' }}
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
												Extracting text from receipt...
											</span>
										</div>
										<ProgressBar mode="indeterminate" className="mt-2 h-2" />
									</div>
								)}

								{ocrResult && (
									<div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
										<div className="flex items-center gap-3 mb-3">
											<CheckCircle className="text-green-600" size={20} />
											<span className="text-green-800 font-medium">
												Text Extracted Successfully
											</span>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
											{ocrResult.amount && (
												<div className="flex justify-between">
													<span className="text-gray-600">Amount:</span>
													<span className="font-medium">
														${ocrResult.amount}
													</span>
												</div>
											)}
											{ocrResult.date && (
												<div className="flex justify-between">
													<span className="text-gray-600">Date:</span>
													<span className="font-medium">
														{new Date(
															ocrResult.date
														).toLocaleDateString()}
													</span>
												</div>
											)}
											{ocrResult.merchant && (
												<div className="flex justify-between md:col-span-2">
													<span className="text-gray-600">Merchant:</span>
													<span className="font-medium">
														{ocrResult.merchant}
													</span>
												</div>
											)}
											{ocrResult.category && (
												<div className="flex justify-between">
													<span className="text-gray-600">Category:</span>
													<span className="font-medium">
														{ocrResult.category}
													</span>
												</div>
											)}
										</div>
									</div>
								)}
							</div>
							<Divider />
							{/* Rest of your form remains the same */}
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
										label="Clear Form"
										icon={<X size={16} />}
										className="p-button-outlined p-button-secondary border-gray-300 text-gray-700 px-6"
										onClick={clearForm}
										disabled={loading || draftLoading}
									/>
									<Button
										label="Cancel"
										icon={<ArrowLeft size={16} />}
										className="p-button-outlined p-button-secondary border-gray-300 text-gray-700 px-6"
										onClick={() => navigate('/')}
										disabled={loading || draftLoading}
									/>
									<Button
										label={draftLoading ? 'Saving Draft...' : 'Save Draft'}
										icon={
											draftLoading ? (
												<Loader2 className="animate-spin" size={16} />
											) : (
												<Save size={16} />
											)
										}
										onClick={saveAsDraft}
										disabled={draftLoading || loading}
										className="p-button-outlined p-button-help border-purple-300 text-purple-700 px-6 hover:bg-purple-50"
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
										disabled={loading || draftLoading}
										className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-6 hover:from-blue-600 hover:to-purple-700"
									/>
								</div>
							</div>{' '}
						</div>
					</Card>
				</div>
			</div>
		</PageLayout>
	);
};

export default CreateExpense;
