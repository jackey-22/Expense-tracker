// pages/ExpenseHistory.js
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../contexts/AuthContext';
import { fetchGet } from '../../utils/fetch.utils';
import { Dialog } from 'primereact/dialog';
import PageLayout from '../../components/employeelayout/PageLayout';
import {
	History,
	Filter,
	Download,
	Eye,
	RefreshCw,
	FileText,
	DollarSign,
	Calendar as CalendarIcon,
	Tag as TagIcon,
	CheckCircle,
	XCircle,
	Clock,
	Edit,
} from 'lucide-react';

const ExpenseHistory = () => {
	const [expenses, setExpenses] = useState([]);
	const [filteredExpenses, setFilteredExpenses] = useState([]);
	const [statusFilter, setStatusFilter] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('');
	const [dateRange, setDateRange] = useState([null, null]);
	const [loading, setLoading] = useState(false);
	const [stats, setStats] = useState({});
	const { currentUser } = useAuth();
	const toast = useRef(null);
	// Add these new states at the top with other useState declarations
	const [selectedExpense, setSelectedExpense] = useState(null);
	const [showDetailDialog, setShowDetailDialog] = useState(false);

	useEffect(() => {
		fetchExpenses();
	}, []);

	useEffect(() => {
		filterExpenses();
		calculateStats();
	}, [expenses, statusFilter, categoryFilter, dateRange]);

	const fetchExpenses = async () => {
		setLoading(true);
		try {
			const result = await fetchGet({ pathName: 'employee/expenses' });

			if (result?.success) {
				setExpenses(result.expenses || []);
				toast.current.show({
					severity: 'success',
					summary: 'Data Loaded',
					detail: `Loaded ${result.expenses?.length || 0} expenses`,
					life: 3000,
				});
			} else {
				throw new Error(result?.message || 'Failed to fetch expenses');
			}
		} catch (error) {
			console.error('Error fetching expenses:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: error.message,
				life: 5000,
			});
		}
		setLoading(false);
	};

	const filterExpenses = () => {
		let filtered = [...expenses];

		if (statusFilter) {
			filtered = filtered.filter((expense) => expense.approvalStatus === statusFilter);
		}

		if (categoryFilter) {
			filtered = filtered.filter((expense) => expense.category === categoryFilter);
		}

		if (dateRange[0] && dateRange[1]) {
			filtered = filtered.filter((expense) => {
				const expenseDate = new Date(expense.date);
				return expenseDate >= dateRange[0] && expenseDate <= dateRange[1];
			});
		}

		setFilteredExpenses(filtered);
	};

	const calculateStats = () => {
		const stats = {
			total: expenses.length,
			approved: expenses.filter((e) => e.approvalStatus === 'Approved').length,
			pending: expenses.filter((e) => e.approvalStatus === 'InProgress').length,
			rejected: expenses.filter((e) => e.approvalStatus === 'Rejected').length,
			draft: expenses.filter((e) => e.approvalStatus === 'Draft').length,
			totalAmount: expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0),
		};
		setStats(stats);
	};

	const getStatusSeverity = (status) => {
		switch (status) {
			case 'Approved':
				return 'success';
			case 'Rejected':
				return 'danger';
			case 'InProgress':
				return 'warning';
			case 'Draft':
				return 'info';
			default:
				return 'secondary';
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'Approved':
				return <CheckCircle size={14} />;
			case 'Rejected':
				return <XCircle size={14} />;
			case 'InProgress':
				return <Clock size={14} />;
			case 'Draft':
				return <Edit size={14} />;
			default:
				return <FileText size={14} />;
		}
	};

	const statusBodyTemplate = (rowData) => {
		return (
			<Tag
				value={rowData.approvalStatus}
				severity={getStatusSeverity(rowData.approvalStatus)}
				icon={getStatusIcon(rowData.approvalStatus)}
				className="flex items-center gap-2"
			/>
		);
	};

	const amountBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-2 font-semibold">
				<DollarSign size={14} className="text-green-600" />
				<span className={rowData.amount > 1000 ? 'text-orange-600' : 'text-gray-800'}>
					{rowData.amount?.toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
				<span className="text-xs text-gray-500">{rowData.currency}</span>
			</div>
		);
	};

	const dateBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-2">
				<CalendarIcon size={14} className="text-blue-600" />
				<span>
					{new Date(rowData.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>
		);
	};

	const categoryBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-2">
				<TagIcon size={14} className="text-purple-600" />
				<span>{rowData.category}</span>
			</div>
		);
	};

	const actionBodyTemplate = (rowData) => {
		const handleViewDetails = () => {
			setSelectedExpense(rowData);
			setShowDetailDialog(true);
		};

		return (
			<Button
				icon={<Eye size={16} />}
				className="p-button-outlined p-button-sm"
				tooltip="View Details"
				tooltipOptions={{ position: 'top' }}
				onClick={handleViewDetails}
			/>
		);
	};

	const statusOptions = [
		{ label: 'All Status', value: '' },
		{ label: 'Draft', value: 'Draft' },
		{ label: 'In Progress', value: 'InProgress' },
		{ label: 'Approved', value: 'Approved' },
		{ label: 'Rejected', value: 'Rejected' },
	];

	const categoryOptions = [
		{ label: 'All Categories', value: '' },
		...Array.from(new Set(expenses.map((e) => e.category).filter(Boolean))).map((cat) => ({
			label: cat,
			value: cat,
		})),
	];

	const StatCard = ({ title, value, subtitle, icon, color }) => (
		<Card className="shadow-sm border-0">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
					<p className="text-xs text-gray-500 mt-1">{subtitle}</p>
				</div>
				<div className={`p-3 rounded-full ${color}`}>{icon}</div>
			</div>
		</Card>
	);
	const ExpenseDetailDialog = () => {
		if (!selectedExpense) return null;

		return (
			<Dialog
				header="Expense Details"
				visible={showDetailDialog}
				style={{ width: '500px' }}
				onHide={() => setShowDetailDialog(false)}
				draggable={false}
			>
				<div className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Description
							</label>
							<p className="text-gray-800 font-medium">
								{selectedExpense.description}
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Amount
							</label>
							<p className="text-gray-800 font-medium">
								${selectedExpense.amount} {selectedExpense.currency}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Category
							</label>
							<p className="text-gray-800">{selectedExpense.category}</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Status
							</label>
							<Tag
								value={selectedExpense.approvalStatus}
								severity={getStatusSeverity(selectedExpense.approvalStatus)}
								className="mt-1"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-600">Date</label>
							<p className="text-gray-800">
								{new Date(selectedExpense.date).toLocaleDateString()}
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Submitted By
							</label>
							<p className="text-gray-800">
								{selectedExpense.employee?.name || 'N/A'}
							</p>
						</div>
					</div>

					{selectedExpense.remarks && (
						<div>
							<label className="block text-sm font-medium text-gray-600">
								Remarks
							</label>
							<p className="text-gray-800 mt-1 bg-gray-50 p-3 rounded-md">
								{selectedExpense.remarks}
							</p>
						</div>
					)}

					{selectedExpense.paidBy &&
						selectedExpense.paidBy._id !== selectedExpense.employee?._id && (
							<div>
								<label className="block text-sm font-medium text-gray-600">
									Paid By
								</label>
								<p className="text-gray-800">{selectedExpense.paidBy?.name}</p>
							</div>
						)}
				</div>

				<div className="flex justify-end gap-2 mt-6">
					<Button
						label="Close"
						icon={<XCircle size={16} />}
						className="p-button-outlined"
						onClick={() => setShowDetailDialog(false)}
					/>
				</div>
			</Dialog>
		);
	};
	return (
		<PageLayout>
			<Toast ref={toast} />
			<ExpenseDetailDialog />
			<div className="space-y-6">
				{/* Header */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
					<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
						<div className="flex items-center gap-4">
							<div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl text-white">
								<History size={32} />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-800">
									Expense History
								</h1>
								<p className="text-gray-600 mt-1">
									Track and manage all your expense submissions
								</p>
							</div>
						</div>
						<div className="flex gap-3">
							<Button
								label="Export"
								icon={<Download size={16} />}
								className="p-button-outlined"
							/>
							<Button
								label="Refresh"
								icon={<RefreshCw size={16} />}
								onClick={fetchExpenses}
								loading={loading}
							/>
						</div>
					</div>
				</div>

				{/* Statistics */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCard
						title="Total Expenses"
						value={stats.total}
						subtitle="All time"
						icon={<FileText size={24} className="text-blue-600" />}
						color="bg-blue-100"
					/>
					<StatCard
						title="Approved"
						value={stats.approved}
						subtitle={`${((stats.approved / stats.total) * 100 || 0).toFixed(1)}% rate`}
						icon={<CheckCircle size={24} className="text-green-600" />}
						color="bg-green-100"
					/>
					<StatCard
						title="Pending"
						value={stats.pending}
						subtitle="Awaiting approval"
						icon={<Clock size={24} className="text-orange-600" />}
						color="bg-orange-100"
					/>
					<StatCard
						title="Total Amount"
						value={`$${stats.totalAmount?.toLocaleString()}`}
						subtitle="Across all expenses"
						icon={<DollarSign size={24} className="text-purple-600" />}
						color="bg-purple-100"
					/>
				</div>

				{/* Filters */}
				<Card className="shadow-sm border-0">
					<div className="flex flex-col lg:flex-row gap-4 items-end">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Status
								</label>
								<Dropdown
									value={statusFilter}
									options={statusOptions}
									onChange={(e) => setStatusFilter(e.value)}
									placeholder="Filter by Status"
									className="w-full"
									showClear
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Category
								</label>
								<Dropdown
									value={categoryFilter}
									options={categoryOptions}
									onChange={(e) => setCategoryFilter(e.value)}
									placeholder="Filter by Category"
									className="w-full"
									showClear
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Date Range
								</label>
								<Calendar
									value={dateRange}
									onChange={(e) => setDateRange(e.value)}
									selectionMode="range"
									readOnlyInput
									placeholder="Select Date Range"
									className="w-full"
									showIcon
								/>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								label="Clear Filters"
								icon={<Filter size={16} />}
								className="p-button-outlined"
								onClick={() => {
									setStatusFilter('');
									setCategoryFilter('');
									setDateRange([null, null]);
								}}
							/>
						</div>
					</div>

					{/* Results Summary */}
					<Divider />
					<div className="flex justify-between items-center text-sm text-gray-600">
						<span>
							Showing <strong>{filteredExpenses.length}</strong> of{' '}
							<strong>{expenses.length}</strong> expenses
						</span>
						{filteredExpenses.length !== expenses.length && (
							<Badge value="Filtered" severity="info" />
						)}
					</div>
				</Card>

				{/* Expenses Table */}
				<Card className="shadow-sm border-0">
					{loading ? (
						<div className="flex justify-center items-center py-12">
							<div className="text-center">
								<ProgressSpinner style={{ width: '50px', height: '50px' }} />
								<p className="text-gray-600 mt-4">Loading expenses...</p>
							</div>
						</div>
					) : (
						<DataTable
							value={filteredExpenses}
							paginator
							rows={10}
							rowsPerPageOptions={[5, 10, 20, 50]}
							emptyMessage={
								<div className="text-center py-8">
									<FileText size={48} className="text-gray-400 mx-auto mb-4" />
									<p className="text-gray-600">No expenses found</p>
									<p className="text-gray-500 text-sm mt-2">
										{expenses.length === 0
											? "You haven't created any expenses yet."
											: 'Try adjusting your filters to see more results.'}
									</p>
								</div>
							}
							className="p-datatable-sm"
						>
							<Column
								field="description"
								header="Description"
								sortable
								style={{ minWidth: '200px' }}
							></Column>
							<Column
								field="category"
								header="Category"
								body={categoryBodyTemplate}
								sortable
							></Column>
							<Column
								field="amount"
								header="Amount"
								body={amountBodyTemplate}
								sortable
								style={{ minWidth: '120px' }}
							></Column>
							<Column
								field="date"
								header="Date"
								body={dateBodyTemplate}
								sortable
								style={{ minWidth: '130px' }}
							></Column>
							<Column
								field="approvalStatus"
								header="Status"
								body={statusBodyTemplate}
								sortable
								style={{ minWidth: '140px' }}
							></Column>
							<Column
								field="remarks"
								header="Remarks"
								body={(rowData) => (
									<span className="text-sm text-gray-600 max-w-xs truncate block">
										{rowData.remarks || '-'}
									</span>
								)}
							></Column>
							<Column
								body={actionBodyTemplate}
								style={{ width: '80px', textAlign: 'center' }}
							></Column>
						</DataTable>
					)}
				</Card>
			</div>
		</PageLayout>
	);
};

export default ExpenseHistory;
