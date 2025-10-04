import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import PageLayout from '../../components/manager/PageLayout';
import { fetchGet, fetchPost } from '../../utils/fetch.utils';

const statusOptions = [
	{ label: 'All', value: null },
	{ label: 'Pending', value: 'InProgress' },
	{ label: 'Approved', value: 'Approved' },
	{ label: 'Rejected', value: 'Rejected' },
];

const categoryOptions = [
	{ label: 'All', value: null },
	{ label: 'Travel', value: 'Travel' },
	{ label: 'Meals', value: 'Meals' },
	{ label: 'Office Supplies', value: 'Office Supplies' },
	{ label: 'Equipment', value: 'Equipment' },
	{ label: 'Software', value: 'Software' },
	{ label: 'Training', value: 'Training' },
	{ label: 'Transportation', value: 'Transportation' },
	{ label: 'Accommodation', value: 'Accommodation' },
	{ label: 'Entertainment', value: 'Entertainment' },
	{ label: 'Other', value: 'Other' },
];

const sortOptions = [
	{ label: 'Amount (Low to High)', value: 'amountAsc' },
	{ label: 'Amount (High to Low)', value: 'amountDesc' },
	{ label: 'Date (Newest First)', value: 'dateDesc' },
	{ label: 'Date (Oldest First)', value: 'dateAsc' },
];

const ApprovalsReview = () => {
	const [requests, setRequests] = useState([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState(null);
	const [categoryFilter, setCategoryFilter] = useState(null);
	const [sortBy, setSortBy] = useState('dateDesc');
	const [remarks, setRemarks] = useState({});
	const toast = useRef(null);

	// Fetch pending approvals from backend
	// Fetch pending approvals from backend
	const fetchPendingApprovals = async () => {
		setLoading(true);
		try {
			const result = await fetchGet({
				pathName: 'manager/pending-approvals',
			});

			if (result.success) {
				// Filter out any drafts that might come through
				const nonDraftExpenses = result.expenses.filter(
					(expense) => expense.approvalStatus !== 'Draft'
				);
				setRequests(nonDraftExpenses || []);
			} else {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: result.message || 'Failed to fetch approvals',
					life: 5000,
				});
			}
		} catch (error) {
			console.error('Error fetching approvals:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to load approval requests',
				life: 5000,
			});
		}
		setLoading(false);
	};
	// Fetch all expenses for manager view
	// Fetch all expenses for manager view (excluding drafts)
	const fetchAllExpenses = async () => {
		setLoading(true);
		try {
			const result = await fetchGet({
				pathName: 'manager/expenses?status=all', // This will fetch all except drafts
			});
			if (result.success) {
				// Filter out drafted expenses on the frontend
				const nonDraftExpenses = result.expenses.filter(
					(expense) => expense.approvalStatus !== 'Draft'
				);
				setRequests(nonDraftExpenses || []);
			} else {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: result.message || 'Failed to fetch expenses',
					life: 5000,
				});
			}
		} catch (error) {
			console.error('Error fetching expenses:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to load expenses',
				life: 5000,
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchAllExpenses(); // Changed from fetchPendingApprovals()
	}, []);
	// Filtering
	let filteredRequests = requests;
	if (statusFilter) {
		filteredRequests = filteredRequests.filter((r) => r.approvalStatus === statusFilter);
	}
	if (categoryFilter) {
		filteredRequests = filteredRequests.filter((r) => r.category === categoryFilter);
	}

	// Sorting
	if (sortBy === 'amountAsc') {
		filteredRequests = [...filteredRequests].sort((a, b) => a.amount - b.amount);
	} else if (sortBy === 'amountDesc') {
		filteredRequests = [...filteredRequests].sort((a, b) => b.amount - a.amount);
	} else if (sortBy === 'dateDesc') {
		filteredRequests = [...filteredRequests].sort(
			(a, b) => new Date(b.date) - new Date(a.date)
		);
	} else if (sortBy === 'dateAsc') {
		filteredRequests = [...filteredRequests].sort(
			(a, b) => new Date(a.date) - new Date(b.date)
		);
	}

	const handleAction = async (id, actionType) => {
		const remarkText = remarks[id]?.trim();
		if (!remarkText) {
			toast.current.show({
				severity: 'warn',
				summary: 'Add Remarks',
				detail: 'Please enter remarks before taking action!',
				life: 2000,
			});
			return;
		}

		try {
			const result = await fetchPost({
				pathName: `manager/approve-expense/${id}`, // Changed from 'employee/approve-expense'
				body: JSON.stringify({
					action: actionType,
					remarks: remarkText,
				}),
			});

			if (result.success) {
				toast.current.show({
					severity: actionType === 'approve' ? 'success' : 'info',
					summary: actionType === 'approve' ? 'Approved' : 'Rejected',
					detail: `Expense ${actionType}d successfully!`,
					life: 3000,
				});

				// Update local state
				setRequests((prev) => prev.map((req) => (req._id === id ? result.expense : req)));

				// Clear remarks for this request
				setRemarks((prev) => ({ ...prev, [id]: '' }));
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Action Failed',
				detail: error.message,
				life: 5000,
			});
		}
	};

	const getStatusBadge = (status) => {
		const statusConfig = {
			'Draft': { class: 'bg-gray-100 text-gray-700', label: 'Draft' },
			'InProgress': { class: 'bg-blue-100 text-blue-700', label: 'Pending' },
			'Approved': { class: 'bg-green-100 text-green-700', label: 'Approved' },
			'Rejected': { class: 'bg-red-100 text-red-700', label: 'Rejected' },
		};

		const config = statusConfig[status] || statusConfig['InProgress'];
		return (
			<span className={`px-2 py-1 rounded text-xs font-semibold ${config.class}`}>
				{config.label}
			</span>
		);
	};

	const formatCurrency = (amount, currency = 'USD') => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
		}).format(amount);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<PageLayout>
			<div className="min-h-screen p-6">
				<Toast ref={toast} />

				<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
					<div>
						<h1 className="text-3xl font-bold text-blue-800 tracking-tight">
							Expense Approvals
						</h1>
						<p className="text-gray-600 mt-2">
							Review and manage expense approval requests
						</p>
					</div>
					<div className="flex items-center gap-4">
						<Button
							label="Pending Approvals"
							icon="pi pi-inbox"
							className="p-button-sm p-button-info"
							onClick={fetchPendingApprovals}
						/>
						<Button
							label="All Expenses"
							icon="pi pi-list"
							className="p-button-sm p-button-secondary"
							onClick={fetchAllExpenses}
						/>
						<Button
							label="Refresh"
							icon="pi pi-refresh"
							className="p-button-sm p-button-help"
							onClick={fetchAllExpenses} // Changed from fetchPendingApprovals
							loading={loading}
						/>
					</div>
				</div>

				{/* Filters */}
				<Card className="mb-6">
					<div className="flex flex-wrap gap-4 items-center">
						<div className="flex-1 min-w-[200px]">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Status
							</label>
							<Dropdown
								value={statusFilter}
								options={statusOptions}
								onChange={(e) => setStatusFilter(e.value)}
								placeholder="All Statuses"
								className="w-full"
							/>
						</div>
						<div className="flex-1 min-w-[200px]">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Category
							</label>
							<Dropdown
								value={categoryFilter}
								options={categoryOptions}
								onChange={(e) => setCategoryFilter(e.value)}
								placeholder="All Categories"
								className="w-full"
							/>
						</div>
						<div className="flex-1 min-w-[200px]">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sort By
							</label>
							<Dropdown
								value={sortBy}
								options={sortOptions}
								onChange={(e) => setSortBy(e.value)}
								placeholder="Sort by"
								className="w-full"
							/>
						</div>
						<div className="flex items-end">
							<Button
								label="Clear Filters"
								icon="pi pi-filter-slash"
								className="p-button-sm p-button-secondary"
								onClick={() => {
									setStatusFilter(null);
									setCategoryFilter(null);
									setSortBy('dateDesc');
								}}
							/>
						</div>
					</div>
				</Card>

				{/* Table */}
				<Card>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="bg-blue-50 text-blue-700">
									<th className="py-4 px-4 text-left rounded-tl-xl font-semibold">
										Description
									</th>
									<th className="py-4 px-4 text-left font-semibold">Employee</th>
									<th className="py-4 px-4 text-left font-semibold">Category</th>
									<th className="py-4 px-4 text-left font-semibold">Amount</th>
									<th className="py-4 px-4 text-left font-semibold">Date</th>
									<th className="py-4 px-4 text-left font-semibold">Status</th>
									<th className="py-4 px-4 text-left font-semibold">Remarks</th>
									<th className="py-4 px-4 text-left rounded-tr-xl font-semibold">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan="8" className="py-8 text-center">
											<div className="flex justify-center items-center">
												<i className="pi pi-spin pi-spinner text-2xl text-blue-500 mr-2"></i>
												<span>Loading expenses...</span>
											</div>
										</td>
									</tr>
								) : filteredRequests.length > 0 ? (
									filteredRequests.map((req, idx) => (
										<tr
											key={req._id}
											className={`transition-colors ${
												idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
											} hover:bg-blue-50 border-b border-gray-200`}
										>
											<td className="py-4 px-4">
												<div>
													<div className="font-medium text-gray-900">
														{req.description}
													</div>
													{req.remarks && (
														<div className="text-sm text-gray-500 mt-1">
															Previous: {req.remarks}
														</div>
													)}
												</div>
											</td>
											<td className="py-4 px-4">
												<div className="flex items-center gap-3">
													<img
														src={`https://ui-avatars.com/api/?name=${
															req.employee?.name || 'User'
														}&background=random`}
														alt={req.employee?.name}
														className="w-8 h-8 rounded-full border border-blue-200"
													/>
													<div>
														<div className="font-medium text-gray-900">
															{req.employee?.name || 'Unknown'}
														</div>
														<div className="text-sm text-gray-500">
															{req.employee?.email}
														</div>
													</div>
												</div>
											</td>
											<td className="py-4 px-4">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
													{req.category}
												</span>
											</td>
											<td className="py-4 px-4 font-semibold text-gray-900">
												{formatCurrency(req.amount, req.currency)}
											</td>
											<td className="py-4 px-4 text-gray-600">
												{formatDate(req.date)}
											</td>
											<td className="py-4 px-4">
												{getStatusBadge(req.approvalStatus)}
											</td>
											<td className="py-4 px-4">
												{req.approvalStatus === 'InProgress' ? (
													<InputText
														placeholder="Enter remarks..."
														value={remarks[req._id] || ''}
														onChange={(e) =>
															setRemarks((prev) => ({
																...prev,
																[req._id]: e.target.value,
															}))
														}
														className="w-full"
													/>
												) : (
													<span className="text-gray-600">
														{req.remarks || '-'}
													</span>
												)}
											</td>
											<td className="py-4 px-4">
												<div className="flex gap-2">
													<Button
														label="Approve"
														icon="pi pi-check"
														className="p-button-success p-button-sm"
														onClick={() =>
															handleAction(req._id, 'approve')
														}
														disabled={
															req.approvalStatus !== 'InProgress'
														}
													/>
													<Button
														label="Reject"
														icon="pi pi-times"
														className="p-button-danger p-button-sm"
														onClick={() =>
															handleAction(req._id, 'reject')
														}
														disabled={
															req.approvalStatus !== 'InProgress'
														}
													/>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="8" className="py-8 text-center text-gray-500">
											<div className="flex flex-col items-center justify-center">
												<i className="pi pi-inbox text-4xl text-gray-400 mb-2"></i>
												<div className="text-lg font-medium">
													No requests found
												</div>
												<div className="text-sm">
													Try adjusting your filters
												</div>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</PageLayout>
	);
};

export default ApprovalsReview;
