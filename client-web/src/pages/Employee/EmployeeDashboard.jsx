// pages/employee/EmployeeDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/employeelayout/PageLayout';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { FileText, Clock, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';

const EmployeeDashboard = () => {
	const toast = useRef(null);
	const [loading, setLoading] = useState(true);

	// Employee statistics
	const [stats, setStats] = useState({
		totalSubmitted: 3240,
		pendingAmount: 1015,
		approvedAmount: 1890,
		rejectedAmount: 335,
		totalExpenses: 15,
		pendingExpenses: 3,
		approvedExpenses: 10,
		rejectedExpenses: 2,
	});

	// Expense status chart
	const expenseStatusData = {
		labels: ['Approved', 'Pending', 'Rejected'],
		datasets: [
			{
				data: [stats.approvedExpenses, stats.pendingExpenses, stats.rejectedExpenses],
				backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
				hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626'],
				borderWidth: 2,
				borderColor: '#ffffff',
			},
		],
	};

	const chartOptions = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					usePointStyle: true,
					padding: 15,
					font: { size: 12 },
				},
			},
		},
	};

	// Recent expenses data
	const recentExpenses = [
		{ id: 1, category: 'Travel', amount: 450, status: 'approved', date: '2024-01-15' },
		{ id: 2, category: 'Meals', amount: 85, status: 'pending', date: '2024-01-14' },
		{ id: 3, category: 'Software', amount: 120, status: 'rejected', date: '2024-01-12' },
	];

	const getStatusIcon = (status) => {
		switch (status) {
			case 'approved':
				return <CheckCircle size={16} className="text-green-500" />;
			case 'pending':
				return <Clock size={16} className="text-yellow-500" />;
			case 'rejected':
				return <XCircle size={16} className="text-red-500" />;
			default:
				return <FileText size={16} className="text-gray-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'approved':
				return 'text-green-600 bg-green-50';
			case 'pending':
				return 'text-yellow-600 bg-yellow-50';
			case 'rejected':
				return 'text-red-600 bg-red-50';
			default:
				return 'text-gray-600 bg-gray-50';
		}
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(amount);
	};

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	return (
		<PageLayout>
			<Toast ref={toast} />
			<div className="p-6 space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
					<p className="text-gray-600">Your expense summary and tracking</p>
				</div>

				{/* Financial Summary Cards - Similar to your image */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Total Submitted */}
					<Card className="border-l-4 border-blue-500 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-500 font-medium">Total Submitted</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{formatCurrency(stats.totalSubmitted)}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{stats.totalExpenses} expenses
								</p>
							</div>
							<div className="p-3 bg-blue-100 rounded-full">
								<DollarSign size={24} className="text-blue-600" />
							</div>
						</div>
					</Card>

					{/* Pending */}
					<Card className="border-l-4 border-yellow-500 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-500 font-medium">Pending</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{formatCurrency(stats.pendingAmount)}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{stats.pendingExpenses} expenses
								</p>
							</div>
							<div className="p-3 bg-yellow-100 rounded-full">
								<Clock size={24} className="text-yellow-600" />
							</div>
						</div>
					</Card>

					{/* Approved */}
					<Card className="border-l-4 border-green-500 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-500 font-medium">Approved</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{formatCurrency(stats.approvedAmount)}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{stats.approvedExpenses} expenses
								</p>
							</div>
							<div className="p-3 bg-green-100 rounded-full">
								<CheckCircle size={24} className="text-green-600" />
							</div>
						</div>
					</Card>

					{/* Rejected */}
					<Card className="border-l-4 border-red-500 shadow-lg">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-gray-500 font-medium">Rejected</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{formatCurrency(stats.rejectedAmount)}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{stats.rejectedExpenses} expenses
								</p>
							</div>
							<div className="p-3 bg-red-100 rounded-full">
								<XCircle size={24} className="text-red-600" />
							</div>
						</div>
					</Card>
				</div>

				{/* Charts and Recent Expenses */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Expense Status Chart */}
					<Card className="shadow-xl">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
								<TrendingUp size={20} className="text-blue-500" />
								Expense Status Distribution
							</h3>
						</div>
						<div className="p-6" style={{ height: '300px' }}>
							<Chart
								type="doughnut"
								data={expenseStatusData}
								options={chartOptions}
							/>
						</div>
					</Card>

					{/* Recent Expenses */}
					<Card className="shadow-xl">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
								<FileText size={20} className="text-purple-500" />
								Recent Expenses
							</h3>
						</div>
						<div className="p-4">
							<div className="space-y-4">
								{recentExpenses.map((expense) => (
									<div
										key={expense.id}
										className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
									>
										<div className="flex items-center gap-4">
											{getStatusIcon(expense.status)}
											<div>
												<p className="font-medium text-gray-800">
													{expense.category}
												</p>
												<p className="text-sm text-gray-500">
													{new Date(expense.date).toLocaleDateString()}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-semibold text-gray-800">
												{formatCurrency(expense.amount)}
											</p>
											<span
												className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
													expense.status
												)}`}
											>
												{expense.status.charAt(0).toUpperCase() +
													expense.status.slice(1)}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</PageLayout>
	);
};

export default EmployeeDashboard;
