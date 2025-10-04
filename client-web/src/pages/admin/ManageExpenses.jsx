import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { Badge } from 'primereact/badge';
import { InputTextarea } from 'primereact/inputtextarea';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { TabView, TabPanel } from 'primereact/tabview';
import { Chart } from 'primereact/chart';
import PageLayout from '../../components/admin/PageLayout';

const ManageExpenses = () => {
	// Enhanced expense data
	const [expenses, setExpenses] = useState([
		{
			id: 1,
			employee: 'John Doe',
			employeeEmail: 'john@example.com',
			category: 'Travel',
			amount: 120.5,
			currency: 'USD',
			description: 'Taxi from airport to hotel - Business trip to NYC',
			date: new Date('2025-09-28'),
			status: 'Pending',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/336699/ffffff?text=Receipt+%231',
			submittedDate: new Date('2025-09-29'),
			department: 'IT',
			priority: 'High',
			notes: 'Urgent client meeting',
		},
		{
			id: 2,
			employee: 'Bob Johnson',
			employeeEmail: 'bob@example.com',
			category: 'Food',
			amount: 50.0,
			currency: 'USD',
			description: 'Business lunch with client - Q3 partnership discussion',
			date: new Date('2025-09-27'),
			status: 'Approved',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Receipt+%232',
			submittedDate: new Date('2025-09-27'),
			approvedDate: new Date('2025-09-28'),
			approvedBy: 'Alice Smith',
			department: 'Sales',
			priority: 'Medium',
		},
		{
			id: 3,
			employee: 'Jane Smith',
			employeeEmail: 'jane@example.com',
			category: 'Supplies',
			amount: 200.0,
			currency: 'USD',
			description: 'Office stationery and printer supplies for Q4',
			date: new Date('2025-09-26'),
			status: 'Rejected',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/ef4444/ffffff?text=Receipt+%233',
			submittedDate: new Date('2025-09-26'),
			rejectedDate: new Date('2025-09-27'),
			rejectionReason: 'Duplicate expense submission - Please consolidate',
			rejectedBy: 'Alice Smith',
			department: 'HR',
			priority: 'Low',
		},
		{
			id: 4,
			employee: 'Mike Chen',
			employeeEmail: 'mike@example.com',
			category: 'Travel',
			amount: 450.0,
			currency: 'USD',
			description: 'Flight tickets for client meeting in New York',
			date: new Date('2025-10-01'),
			status: 'Pending',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/336699/ffffff?text=Receipt+%234',
			submittedDate: new Date('2025-10-02'),
			department: 'IT',
			priority: 'High',
			notes: 'Conference attendance',
		},
		{
			id: 5,
			employee: 'Sarah Williams',
			employeeEmail: 'sarah@example.com',
			category: 'Entertainment',
			amount: 85.75,
			currency: 'USD',
			description: 'Team dinner after project completion celebration',
			date: new Date('2025-09-30'),
			status: 'Approved',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/10b981/ffffff?text=Receipt+%235',
			submittedDate: new Date('2025-10-01'),
			approvedDate: new Date('2025-10-02'),
			approvedBy: 'Alice Smith',
			department: 'Marketing',
			priority: 'Medium',
		},
		{
			id: 6,
			employee: 'Tom Brown',
			employeeEmail: 'tom@example.com',
			category: 'Travel',
			amount: 320.0,
			currency: 'USD',
			description: 'Hotel accommodation for 2 nights - Boston conference',
			date: new Date('2025-10-03'),
			status: 'Pending',
			manager: 'Alice Smith',
			receipt: 'https://via.placeholder.com/600x400/336699/ffffff?text=Receipt+%236',
			submittedDate: new Date('2025-10-04'),
			department: 'Sales',
			priority: 'High',
		},
	]);

	// Filter options
	const employees = [
		'John Doe',
		'Bob Johnson',
		'Jane Smith',
		'Mike Chen',
		'Sarah Williams',
		'Tom Brown',
	];
	const categories = ['Travel', 'Food', 'Supplies', 'Entertainment', 'Other'];
	const statuses = ['Pending', 'Approved', 'Rejected'];
	const departments = ['IT', 'Sales', 'HR', 'Marketing', 'Finance'];

	// Filter states
	const [selectedEmployee, setSelectedEmployee] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);
	const [globalFilter, setGlobalFilter] = useState('');
	const [selectedExpenses, setSelectedExpenses] = useState([]);

	// Dialog states
	const [showDetailDialog, setShowDetailDialog] = useState(false);
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [showReceiptDialog, setShowReceiptDialog] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState(null);
	const [rejectionReason, setRejectionReason] = useState('');

	const toastRef = useRef(null);
	const dt = useRef(null);

	// Filter expenses
	const filteredExpenses = expenses.filter((exp) => {
		const matchesGlobal =
			!globalFilter ||
			exp.employee.toLowerCase().includes(globalFilter.toLowerCase()) ||
			exp.description.toLowerCase().includes(globalFilter.toLowerCase()) ||
			exp.category.toLowerCase().includes(globalFilter.toLowerCase()) ||
			exp.department.toLowerCase().includes(globalFilter.toLowerCase());

		return (
			matchesGlobal &&
			(!selectedEmployee || exp.employee === selectedEmployee) &&
			(!selectedCategory || exp.category === selectedCategory) &&
			(!selectedStatus || exp.status === selectedStatus) &&
			(!selectedDepartment || exp.department === selectedDepartment) &&
			(!selectedDate || exp.date.toDateString() === selectedDate.toDateString())
		);
	});

	// Calculate statistics
	const stats = {
		total: expenses.length,
		pending: expenses.filter((e) => e.status === 'Pending').length,
		approved: expenses.filter((e) => e.status === 'Approved').length,
		rejected: expenses.filter((e) => e.status === 'Rejected').length,
		totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
		pendingAmount: expenses
			.filter((e) => e.status === 'Pending')
			.reduce((sum, e) => sum + e.amount, 0),
		approvedAmount: expenses
			.filter((e) => e.status === 'Approved')
			.reduce((sum, e) => sum + e.amount, 0),
	};

	// Chart data
	const chartData = {
		labels: ['Pending', 'Approved', 'Rejected'],
		datasets: [
			{
				data: [stats.pending, stats.approved, stats.rejected],
				backgroundColor: ['#f59e0b', '#10b981', '#ef4444'],
				hoverBackgroundColor: ['#fbbf24', '#34d399', '#f87171'],
			},
		],
	};

	const chartOptions = {
		plugins: {
			legend: {
				labels: {
					usePointStyle: true,
					font: {
						size: 12,
					},
				},
			},
		},
	};

	// Toast notifications
	const showToast = (severity, summary, detail) => {
		toastRef.current?.show({ severity, summary, detail, life: 3000 });
	};

	// Clear all filters
	const clearFilters = () => {
		setSelectedEmployee(null);
		setSelectedCategory(null);
		setSelectedStatus(null);
		setSelectedDepartment(null);
		setSelectedDate(null);
		setGlobalFilter('');
	};

	// View expense details
	const viewExpenseDetails = (expense) => {
		setSelectedExpense(expense);
		setShowDetailDialog(true);
	};

	// View receipt
	const viewReceipt = (expense) => {
		setSelectedExpense(expense);
		setShowReceiptDialog(true);
	};

	// Approve expense
	const confirmApprove = (expense) => {
		confirmDialog({
			message: `Approve expense of ${expense.currency} ${expense.amount.toFixed(2)} for ${
				expense.employee
			}?`,
			header: 'Confirm Approval',
			icon: 'pi pi-check-circle',
			accept: () => approveExpense(expense),
			acceptClassName: 'bg-green-600 border-green-600 hover:bg-green-700',
			rejectClassName: 'p-button-text',
		});
	};

	const approveExpense = (expense) => {
		const updatedExpenses = expenses.map((e) =>
			e.id === expense.id
				? {
						...e,
						status: 'Approved',
						approvedDate: new Date(),
						approvedBy: 'Admin User',
				  }
				: e
		);
		setExpenses(updatedExpenses);
		showToast(
			'success',
			'✅ Expense Approved',
			`Expense #${expense.id} has been approved successfully.`
		);
	};

	// Reject expense
	const openRejectDialog = (expense) => {
		setSelectedExpense(expense);
		setRejectionReason('');
		setShowRejectDialog(true);
	};

	const rejectExpense = () => {
		if (!rejectionReason.trim()) {
			showToast('error', 'Validation Error', 'Please provide a reason for rejection.');
			return;
		}

		const updatedExpenses = expenses.map((e) =>
			e.id === selectedExpense.id
				? {
						...e,
						status: 'Rejected',
						rejectedDate: new Date(),
						rejectionReason: rejectionReason,
						rejectedBy: 'Admin User',
				  }
				: e
		);
		setExpenses(updatedExpenses);
		showToast(
			'warn',
			'❌ Expense Rejected',
			`Expense #${selectedExpense.id} has been rejected.`
		);
		setShowRejectDialog(false);
		setRejectionReason('');
	};

	// Override approval
	const confirmOverride = (expense) => {
		confirmDialog({
			message: `Override and approve expense #${expense.id}? This will change the status to Approved regardless of previous actions.`,
			header: 'Override Approval',
			icon: 'pi pi-exclamation-triangle',
			accept: () => overrideApproval(expense),
			acceptClassName: 'bg-orange-600 border-orange-600 hover:bg-orange-700',
		});
	};

	const overrideApproval = (expense) => {
		const updatedExpenses = expenses.map((e) =>
			e.id === expense.id
				? {
						...e,
						status: 'Approved',
						approvedDate: new Date(),
						overridden: true,
						approvedBy: 'Admin User (Override)',
				  }
				: e
		);
		setExpenses(updatedExpenses);
		showToast(
			'success',
			'🔄 Approval Overridden',
			`Expense #${expense.id} status has been overridden to Approved.`
		);
	};

	// Bulk approve
	const confirmBulkApprove = () => {
		const pendingSelected = selectedExpenses.filter((e) => e.status === 'Pending');
		if (pendingSelected.length === 0) {
			showToast('warn', 'No Pending Expenses', 'Please select pending expenses to approve.');
			return;
		}

		confirmDialog({
			message: `Approve ${pendingSelected.length} selected pending expenses?`,
			header: 'Bulk Approval',
			icon: 'pi pi-check-circle',
			accept: bulkApprove,
			acceptClassName: 'bg-green-600 border-green-600 hover:bg-green-700',
		});
	};

	const bulkApprove = () => {
		const selectedIds = selectedExpenses.filter((e) => e.status === 'Pending').map((e) => e.id);
		const updatedExpenses = expenses.map((e) =>
			selectedIds.includes(e.id)
				? {
						...e,
						status: 'Approved',
						approvedDate: new Date(),
						approvedBy: 'Admin User (Bulk)',
				  }
				: e
		);
		setExpenses(updatedExpenses);
		showToast(
			'success',
			'✅ Bulk Approval Complete',
			`${selectedIds.length} expenses approved successfully.`
		);
		setSelectedExpenses([]);
	};

	// Export to CSV
	const exportCSV = () => {
		dt.current.exportCSV();
		showToast('success', '📥 Export Started', 'Downloading expense report...');
	};

	// Generate avatar color
	const getAvatarColor = (name) => {
		const colors = [
			'bg-blue-500',
			'bg-purple-500',
			'bg-pink-500',
			'bg-green-500',
			'bg-yellow-500',
			'bg-red-500',
			'bg-indigo-500',
			'bg-teal-500',
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	};

	// Column Templates
	const employeeBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-3">
				<div
					className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${getAvatarColor(
						rowData.employee
					)}`}
				>
					{rowData.employee.charAt(0).toUpperCase()}
				</div>
				<div>
					<div className="font-semibold text-gray-800">{rowData.employee}</div>
					<div className="text-xs text-gray-500">{rowData.employeeEmail}</div>
				</div>
			</div>
		);
	};

	const categoryBodyTemplate = (rowData) => {
		const categoryConfig = {
			Travel: { icon: 'pi-car', color: 'bg-blue-100 text-blue-700 border-blue-300' },
			Food: {
				icon: 'pi-shopping-cart',
				color: 'bg-green-100 text-green-700 border-green-300',
			},
			Supplies: { icon: 'pi-box', color: 'bg-purple-100 text-purple-700 border-purple-300' },
			Entertainment: {
				icon: 'pi-star',
				color: 'bg-pink-100 text-pink-700 border-pink-300',
			},
			Other: {
				icon: 'pi-ellipsis-h',
				color: 'bg-gray-100 text-gray-700 border-gray-300',
			},
		};
		const config = categoryConfig[rowData.category] || categoryConfig.Other;

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${config.color}`}
			>
				<i className={`pi ${config.icon} text-xs`}></i>
				<span className="text-sm font-medium">{rowData.category}</span>
			</div>
		);
	};

	const amountBodyTemplate = (rowData) => {
		return (
			<div className="text-right">
				<div className="font-bold text-lg text-[#336699]">
					{rowData.currency} {rowData.amount.toFixed(2)}
				</div>
			</div>
		);
	};

	const statusBodyTemplate = (rowData) => {
		const statusConfig = {
			Pending: {
				icon: 'pi-clock',
				color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
			},
			Approved: {
				icon: 'pi-check-circle',
				color: 'bg-green-50 text-green-700 border-green-200',
			},
			Rejected: {
				icon: 'pi-times-circle',
				color: 'bg-red-50 text-red-700 border-red-200',
			},
		};
		const config = statusConfig[rowData.status];

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${config.color}`}
			>
				<i className={`pi ${config.icon} text-xs`}></i>
				<span className="text-sm font-semibold">{rowData.status}</span>
			</div>
		);
	};

	const priorityBodyTemplate = (rowData) => {
		const priorityConfig = {
			High: 'bg-red-100 text-red-700 border-red-300',
			Medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
			Low: 'bg-green-100 text-green-700 border-green-300',
		};

		return (
			<span
				className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
					priorityConfig[rowData.priority]
				}`}
			>
				{rowData.priority}
			</span>
		);
	};

	const dateBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-2">
				<i className="pi pi-calendar text-gray-400 text-sm"></i>
				<span className="text-sm text-gray-700">
					{rowData.date.toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
					})}
				</span>
			</div>
		);
	};

	const descriptionBodyTemplate = (rowData) => {
		return (
			<div className="max-w-xs">
				<p className="text-sm text-gray-700 line-clamp-2" title={rowData.description}>
					{rowData.description}
				</p>
			</div>
		);
	};

	const actionBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-1">
				<Button
					icon="pi pi-eye"
					className="p-button-rounded p-button-text hover:bg-blue-50 transition-all"
					style={{ color: '#336699' }}
					tooltip="View Details"
					tooltipOptions={{ position: 'top' }}
					onClick={() => viewExpenseDetails(rowData)}
				/>
				<Button
					icon="pi pi-image"
					className="p-button-rounded p-button-text hover:bg-purple-50 transition-all"
					style={{ color: '#9333ea' }}
					tooltip="View Receipt"
					tooltipOptions={{ position: 'top' }}
					onClick={() => viewReceipt(rowData)}
				/>
				{rowData.status === 'Pending' && (
					<>
						<Button
							icon="pi pi-check"
							className="p-button-rounded p-button-text hover:bg-green-50 transition-all"
							style={{ color: '#10b981' }}
							tooltip="Approve"
							tooltipOptions={{ position: 'top' }}
							onClick={() => confirmApprove(rowData)}
						/>
						<Button
							icon="pi pi-times"
							className="p-button-rounded p-button-text hover:bg-red-50 transition-all"
							style={{ color: '#ef4444' }}
							tooltip="Reject"
							tooltipOptions={{ position: 'top' }}
							onClick={() => openRejectDialog(rowData)}
						/>
					</>
				)}
				{rowData.status === 'Rejected' && (
					<Button
						icon="pi pi-refresh"
						className="p-button-rounded p-button-text hover:bg-orange-50 transition-all"
						style={{ color: '#f59e0b' }}
						tooltip="Override & Approve"
						tooltipOptions={{ position: 'top' }}
						onClick={() => confirmOverride(rowData)}
					/>
				)}
			</div>
		);
	};

	// Toolbar templates
	const leftToolbarTemplate = () => {
		return (
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3">
					<div className="w-12 h-12 bg-gradient-to-br from-[#336699] to-[#28527a] rounded-xl flex items-center justify-center shadow-lg">
						<i className="pi pi-wallet text-white text-2xl"></i>
					</div>
					<div>
						<h2 className="text-2xl font-bold text-white m-0 tracking-tight">
							Manage Expenses
						</h2>
						<p className="text-sm text-blue-100 m-0">
							Review and approve expense reports
						</p>
					</div>
				</div>
				<Badge
					value={filteredExpenses.length}
					severity="info"
					className="ml-2 text-base px-3 py-1"
				/>
			</div>
		);
	};

	const rightToolbarTemplate = () => {
		return (
			<div className="flex gap-2">
				{selectedExpenses.length > 0 && (
					<Button
						label={`Approve Selected (${selectedExpenses.length})`}
						icon="pi pi-check"
						className="bg-green-600 border-green-600 hover:bg-green-700 shadow-md transition-all"
						onClick={confirmBulkApprove}
					/>
				)}
				<Button
					label="Export CSV"
					icon="pi pi-download"
					onClick={exportCSV}
					className="bg-white text-[#336699] border-white hover:bg-blue-50 shadow-md transition-all"
				/>
			</div>
		);
	};

	// Table header with filters
	const tableHeader = (
		<div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-xl border-2 border-blue-100 mb-4 shadow-sm">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-8 h-8 bg-[#336699] rounded-lg flex items-center justify-center">
					<i className="pi pi-filter text-white"></i>
				</div>
				<h4 className="text-[#336699] font-bold text-lg m-0">Advanced Filters</h4>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
				{/* Global Search */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-search mr-1"></i>
						Search
					</label>
					<span className="p-input-icon-left w-full">
						<i className="pi pi-search" />
						<InputText
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							placeholder="Search..."
							className="w-full shadow-sm"
						/>
					</span>
				</div>

				{/* Employee Filter */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-user mr-1"></i>
						Employee
					</label>
					<Dropdown
						value={selectedEmployee}
						options={employees}
						placeholder="All Employees"
						onChange={(e) => setSelectedEmployee(e.value)}
						showClear
						className="w-full shadow-sm"
					/>
				</div>

				{/* Category Filter */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-tag mr-1"></i>
						Category
					</label>
					<Dropdown
						value={selectedCategory}
						options={categories}
						placeholder="All Categories"
						onChange={(e) => setSelectedCategory(e.value)}
						showClear
						className="w-full shadow-sm"
					/>
				</div>

				{/* Status Filter */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-circle mr-1"></i>
						Status
					</label>
					<Dropdown
						value={selectedStatus}
						options={statuses}
						placeholder="All Status"
						onChange={(e) => setSelectedStatus(e.value)}
						showClear
						className="w-full shadow-sm"
					/>
				</div>

				{/* Department Filter */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-building mr-1"></i>
						Department
					</label>
					<Dropdown
						value={selectedDepartment}
						options={departments}
						placeholder="All Departments"
						onChange={(e) => setSelectedDepartment(e.value)}
						showClear
						className="w-full shadow-sm"
					/>
				</div>

				{/* Date Filter */}
				<div className="flex flex-col">
					<label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
						<i className="pi pi-calendar mr-1"></i>
						Date
					</label>
					<Calendar
						value={selectedDate}
						onChange={(e) => setSelectedDate(e.value)}
						placeholder="Select Date"
						showIcon
						className="w-full shadow-sm"
					/>
				</div>
			</div>

			{/* Clear Filters */}
			<div className="flex justify-end mt-4">
				<Button
					label="Clear All Filters"
					icon="pi pi-filter-slash"
					onClick={clearFilters}
					className="p-button-text hover:bg-blue-100 transition-all"
					style={{ color: '#336699' }}
				/>
			</div>
		</div>
	);

	return (
		<PageLayout>
			<Toast ref={toastRef} />
			<ConfirmDialog />

			{/* Main Card */}
			<div className="bg-white overflow-hidden">
				{/* Toolbar with Gradient */}
				<div className="bg-gradient-to-r from-[#336699] via-[#4a80b5] to-[#5a90c5] px-6 py-5 shadow-lg">
					<Toolbar
						left={leftToolbarTemplate}
						right={rightToolbarTemplate}
						className="bg-transparent border-0"
						style={{ padding: 0 }}
					/>
				</div>

				{/* Content */}
				<div className="p-6">
					{/* Stats Cards Row */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						{/* Total Expenses */}
						<div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90 mb-1 font-medium">
										Total Expenses
									</p>
									<h3 className="text-4xl font-bold mb-1">{stats.total}</h3>
									<p className="text-xs opacity-75">
										${stats.totalAmount.toFixed(2)} total
									</p>
								</div>
								<div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
									<i className="pi pi-wallet text-3xl"></i>
								</div>
							</div>
						</div>

						{/* Pending */}
						<div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90 mb-1 font-medium">Pending</p>
									<h3 className="text-4xl font-bold mb-1">{stats.pending}</h3>
									<p className="text-xs opacity-75">
										${stats.pendingAmount.toFixed(2)} pending
									</p>
								</div>
								<div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
									<i className="pi pi-clock text-3xl"></i>
								</div>
							</div>
						</div>

						{/* Approved */}
						<div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90 mb-1 font-medium">Approved</p>
									<h3 className="text-4xl font-bold mb-1">{stats.approved}</h3>
									<p className="text-xs opacity-75">
										${stats.approvedAmount.toFixed(2)} approved
									</p>
								</div>
								<div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
									<i className="pi pi-check-circle text-3xl"></i>
								</div>
							</div>
						</div>

						{/* Rejected */}
						<div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-2xl text-white shadow-xl transform hover:scale-105 transition-all duration-300">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm opacity-90 mb-1 font-medium">Rejected</p>
									<h3 className="text-4xl font-bold mb-1">{stats.rejected}</h3>
									<p className="text-xs opacity-75">Needs attention</p>
								</div>
								<div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
									<i className="pi pi-times-circle text-3xl"></i>
								</div>
							</div>
						</div>
					</div>

					{/* Chart Section
						<div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100 shadow-sm">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
									<i className="pi pi-chart-pie text-[#336699]"></i>
									Expense Status Distribution
								</h3>
							</div>
							<div className="max-w-sm mx-auto">
								<Chart type="doughnut" data={chartData} options={chartOptions} />
							</div>
						</div> */}

					{/* Filters */}
					{tableHeader}

					{/* Data Table */}
					<DataTable
						ref={dt}
						value={filteredExpenses}
						selection={selectedExpenses}
						onSelectionChange={(e) => setSelectedExpenses(e.value)}
						dataKey="id"
						responsiveLayout="scroll"
						stripedRows
						paginator
						rows={10}
						rowsPerPageOptions={[5, 10, 25, 50]}
						emptyMessage={
							<div className="text-center py-16">
								<div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
									<i className="pi pi-inbox text-6xl text-gray-300"></i>
								</div>
								<p className="text-gray-500 text-xl font-semibold mb-2">
									No expenses found
								</p>
								<p className="text-gray-400 text-sm">
									Try adjusting your filters or search criteria
								</p>
							</div>
						}
						className="rounded-xl overflow-hidden shadow-lg"
						rowHover
						showGridlines
					>
						<Column
							selectionMode="multiple"
							headerStyle={{ width: '3rem' }}
							className="bg-gray-50"
						/>
						<Column
							field="id"
							header="ID"
							sortable
							style={{ width: '80px' }}
							body={(rowData) => (
								<span className="font-mono text-sm font-semibold text-[#336699] bg-blue-50 px-2 py-1 rounded">
									#{rowData.id}
								</span>
							)}
						/>
						<Column
							field="employee"
							header="Employee"
							body={employeeBodyTemplate}
							sortable
							style={{ minWidth: '250px' }}
						/>
						<Column
							field="category"
							header="Category"
							body={categoryBodyTemplate}
							sortable
							style={{ minWidth: '160px' }}
						/>
						<Column
							field="amount"
							header="Amount"
							body={amountBodyTemplate}
							sortable
							style={{ minWidth: '140px' }}
						/>
						<Column
							field="description"
							header="Description"
							body={descriptionBodyTemplate}
							style={{ minWidth: '280px' }}
						/>
						<Column
							field="date"
							header="Date"
							body={dateBodyTemplate}
							sortable
							style={{ minWidth: '160px' }}
						/>
						<Column
							field="priority"
							header="Priority"
							body={priorityBodyTemplate}
							sortable
							style={{ minWidth: '110px' }}
						/>
						<Column
							field="status"
							header="Status"
							body={statusBodyTemplate}
							sortable
							style={{ minWidth: '140px' }}
						/>
						<Column
							header="Actions"
							body={actionBodyTemplate}
							frozen
							alignFrozen="right"
							className="bg-white"
							style={{ minWidth: '180px' }}
						/>
					</DataTable>
				</div>
			</div>

			{/* Expense Detail Dialog */}
			<Dialog
				header={
					<div className="flex items-center gap-3 py-2">
						<div className="w-12 h-12 bg-gradient-to-br from-[#336699] to-[#4a80b5] rounded-xl flex items-center justify-center shadow-lg">
							<i className="pi pi-file-edit text-white text-xl"></i>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-gray-800 m-0">
								Expense Details
							</h3>
							<p className="text-sm text-gray-500 m-0">
								Review complete expense information
							</p>
						</div>
					</div>
				}
				visible={showDetailDialog}
				onHide={() => setShowDetailDialog(false)}
				style={{ width: '900px' }}
				breakpoints={{ '960px': '95vw' }}
				className="rounded-2xl"
			>
				{selectedExpense && (
					<div className="space-y-4">
						<TabView className="rounded-lg">
							<TabPanel
								header="General Information"
								leftIcon="pi pi-info-circle mr-2"
							>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
									{/* Employee Info */}
									<div className="col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Employee Information
										</label>
										<div className="flex items-center gap-3">
											<div
												className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ${getAvatarColor(
													selectedExpense.employee
												)}`}
											>
												{selectedExpense.employee.charAt(0)}
											</div>
											<div>
												<p className="text-lg font-bold text-gray-800 m-0">
													{selectedExpense.employee}
												</p>
												<p className="text-sm text-gray-600 m-0">
													{selectedExpense.employeeEmail}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													<i className="pi pi-building mr-1"></i>
													{selectedExpense.department}
												</p>
											</div>
										</div>
									</div>

									{/* Category */}
									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Category
										</label>
										{categoryBodyTemplate(selectedExpense)}
									</div>

									{/* Priority */}
									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Priority
										</label>
										{priorityBodyTemplate(selectedExpense)}
									</div>

									{/* Amount */}
									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Amount
										</label>
										<p className="text-3xl font-bold text-[#336699] m-0">
											{selectedExpense.currency}{' '}
											{selectedExpense.amount.toFixed(2)}
										</p>
									</div>

									{/* Status */}
									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Status
										</label>
										{statusBodyTemplate(selectedExpense)}
									</div>

									{/* Description */}
									<div className="col-span-2">
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											Description
										</label>
										<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
											<p className="text-gray-800 m-0 leading-relaxed">
												{selectedExpense.description}
											</p>
										</div>
									</div>

									{/* Notes */}
									{selectedExpense.notes && (
										<div className="col-span-2">
											<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
												Additional Notes
											</label>
											<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
												<p className="text-gray-700 m-0 italic">
													<i className="pi pi-info-circle mr-2 text-blue-600"></i>
													{selectedExpense.notes}
												</p>
											</div>
										</div>
									)}

									<Divider className="col-span-2" />

									{/* Dates */}
									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											<i className="pi pi-calendar mr-1"></i>
											Expense Date
										</label>
										<p className="text-gray-800 font-medium m-0">
											{selectedExpense.date.toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												weekday: 'long',
											})}
										</p>
									</div>

									<div>
										<label className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2 block">
											<i className="pi pi-send mr-1"></i>
											Submitted Date
										</label>
										<p className="text-gray-800 font-medium m-0">
											{selectedExpense.submittedDate.toLocaleDateString(
												'en-US',
												{
													year: 'numeric',
													month: 'long',
													day: 'numeric',
												}
											)}
										</p>
									</div>

									{/* Approved Info */}
									{selectedExpense.approvedDate && (
										<div className="col-span-2 bg-green-50 p-4 rounded-lg border border-green-200">
											<div className="grid grid-cols-2 gap-4">
												<div>
													<label className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 block">
														<i className="pi pi-check-circle mr-1"></i>
														Approved Date
													</label>
													<p className="text-gray-800 font-medium m-0">
														{selectedExpense.approvedDate.toLocaleDateString(
															'en-US',
															{
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															}
														)}
													</p>
												</div>
												<div>
													<label className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2 block">
														Approved By
													</label>
													<p className="text-gray-800 font-medium m-0">
														{selectedExpense.approvedBy}
													</p>
												</div>
											</div>
										</div>
									)}

									{/* Rejected Info */}
									{selectedExpense.rejectedDate && (
										<div className="col-span-2 bg-red-50 p-4 rounded-lg border-2 border-red-200">
											<div className="grid grid-cols-2 gap-4 mb-3">
												<div>
													<label className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 block">
														<i className="pi pi-times-circle mr-1"></i>
														Rejected Date
													</label>
													<p className="text-gray-800 font-medium m-0">
														{selectedExpense.rejectedDate.toLocaleDateString(
															'en-US',
															{
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															}
														)}
													</p>
												</div>
												<div>
													<label className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 block">
														Rejected By
													</label>
													<p className="text-gray-800 font-medium m-0">
														{selectedExpense.rejectedBy}
													</p>
												</div>
											</div>
											<label className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2 block">
												Rejection Reason
											</label>
											<div className="bg-white p-3 rounded border border-red-300">
												<p className="text-red-800 font-medium m-0">
													{selectedExpense.rejectionReason}
												</p>
											</div>
										</div>
									)}
								</div>
							</TabPanel>

							<TabPanel header="Receipt" leftIcon="pi pi-image mr-2">
								<div className="text-center p-6">
									<Image
										src={selectedExpense.receipt}
										alt="Receipt"
										width="100%"
										preview
										className="border-4 border-gray-200 rounded-xl shadow-lg"
									/>
								</div>
							</TabPanel>
						</TabView>

						<Divider />

						{/* Action Buttons */}
						<div className="flex justify-end gap-3 pt-2">
							{selectedExpense.status === 'Pending' && (
								<>
									<Button
										label="Reject Expense"
										icon="pi pi-times"
										className="bg-red-600 border-red-600 hover:bg-red-700 shadow-md transition-all"
										onClick={() => {
											setShowDetailDialog(false);
											openRejectDialog(selectedExpense);
										}}
									/>
									<Button
										label="Approve Expense"
										icon="pi pi-check"
										className="bg-green-600 border-green-600 hover:bg-green-700 shadow-md transition-all"
										onClick={() => {
											setShowDetailDialog(false);
											confirmApprove(selectedExpense);
										}}
									/>
								</>
							)}
							{selectedExpense.status === 'Rejected' && (
								<Button
									label="Override & Approve"
									icon="pi pi-refresh"
									className="bg-orange-600 border-orange-600 hover:bg-orange-700 shadow-md transition-all"
									onClick={() => {
										setShowDetailDialog(false);
										confirmOverride(selectedExpense);
									}}
								/>
							)}
							<Button
								label="Close"
								icon="pi pi-times"
								className="p-button-text hover:bg-gray-100 transition-all"
								onClick={() => setShowDetailDialog(false)}
							/>
						</div>
					</div>
				)}
			</Dialog>

			{/* Receipt View Dialog */}
			<Dialog
				header={
					<div className="flex items-center gap-3 py-2">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							<i className="pi pi-image text-white text-xl"></i>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-gray-800 m-0">Receipt Image</h3>
							<p className="text-sm text-gray-500 m-0">
								Expense #{selectedExpense?.id}
							</p>
						</div>
					</div>
				}
				visible={showReceiptDialog}
				onHide={() => setShowReceiptDialog(false)}
				style={{ width: '800px' }}
				breakpoints={{ '960px': '95vw' }}
				className="rounded-2xl"
			>
				{selectedExpense && (
					<div className="text-center p-4">
						<Image
							src={selectedExpense.receipt}
							alt="Receipt"
							width="100%"
							preview
							className="border-4 border-gray-200 rounded-xl shadow-2xl"
						/>
					</div>
				)}
			</Dialog>

			{/* Reject Dialog */}
			<Dialog
				header={
					<div className="flex items-center gap-3 py-2">
						<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
							<i className="pi pi-times-circle text-white text-xl"></i>
						</div>
						<div>
							<h3 className="text-2xl font-bold text-gray-800 m-0">Reject Expense</h3>
							<p className="text-sm text-gray-500 m-0">
								Expense #{selectedExpense?.id} - Provide rejection reason
							</p>
						</div>
					</div>
				}
				visible={showRejectDialog}
				onHide={() => setShowRejectDialog(false)}
				style={{ width: '600px' }}
				breakpoints={{ '960px': '95vw' }}
				footer={
					<div className="flex justify-end gap-3">
						<Button
							label="Cancel"
							icon="pi pi-times"
							className="p-button-text hover:bg-gray-100 transition-all"
							onClick={() => setShowRejectDialog(false)}
						/>
						<Button
							label="Reject Expense"
							icon="pi pi-times"
							className="bg-red-600 border-red-600 hover:bg-red-700 shadow-md transition-all"
							onClick={rejectExpense}
						/>
					</div>
				}
			>
				<Message
					severity="warn"
					className="w-full mb-4 border-l-4"
					content={
						<div className="ml-2">
							<p className="font-semibold mb-1">Important Notice</p>
							<p className="text-sm">
								Please provide a clear and detailed reason for rejecting this
								expense. The employee will be notified via email.
							</p>
						</div>
					}
				/>

				<div className="flex flex-col">
					<label
						htmlFor="rejectionReason"
						className="text-sm font-bold text-gray-700 mb-2"
					>
						Rejection Reason <span className="text-red-500">*</span>
					</label>
					<InputTextarea
						id="rejectionReason"
						value={rejectionReason}
						onChange={(e) => setRejectionReason(e.target.value)}
						rows={6}
						placeholder="Enter a detailed reason for rejection..."
						className="w-full shadow-sm"
						autoFocus
					/>
					<small className="text-gray-500 mt-2">
						<i className="pi pi-info-circle mr-1"></i>
						Be specific to help the employee understand the issue.
					</small>
				</div>
			</Dialog>
		</PageLayout>
	);
};

export default ManageExpenses;
