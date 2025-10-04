// pages/manager/ManagerDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/manager/PageLayout';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { Users, CheckCircle, XCircle, Clock, DollarSign, TrendingUp, FileText } from 'lucide-react';

const Dashboard = () => {
	const toast = useRef(null);
	const [loading, setLoading] = useState(true);

	// Manager-specific stats
	const [stats, setStats] = useState({
		totalTeamMembers: 24,
		totalSubmittedExpenses: 320,
		pendingExpenses: 40,
		approvedExpenses: 250,
		rejectedExpenses: 30,
		totalAmountSubmitted: 45000,
		totalAmountApproved: 35000,
		totalAmountRejected: 5000,
		totalAmountPending: 5000,
	});

	// Expense status chart data
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

	// Recent team expenses
	const recentExpenses = [
		{
			id: 1,
			employee: 'John Doe',
			category: 'Travel',
			amount: 1200,
			status: 'approved',
			date: '2024-01-20',
		},
		{
			id: 2,
			employee: 'Jane Smith',
			category: 'Meals',
			amount: 200,
			status: 'pending',
			date: '2024-01-19',
		},
		{
			id: 3,
			employee: 'Bob Johnson',
			category: 'Software',
			amount: 500,
			status: 'rejected',
			date: '2024-01-18',
		},
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
		setTimeout(() => setLoading(false), 1000);
	}, []);

	const CardStat = ({ title, value, icon, bgColor, iconColor, subtitle }) => (
		<Card
			className={`shadow-md rounded-xl border-l-8 ${bgColor} p-5 hover:shadow-xl transition-all`}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-gray-500 font-medium">{title}</p>
					<h2 className="text-3xl font-bold text-gray-800">{value}</h2>
					{subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
				</div>
				<div className={`p-4 rounded-full ${iconColor} flex items-center justify-center`}>
					{icon}
				</div>
			</div>
		</Card>
	);

	return (
		<PageLayout>
			<Toast ref={toast} />
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
					<div>
						<h1 className="text-3xl font-bold text-blue-800 tracking-tight">
							Manager Dashboard
						</h1>
						<p className="text-gray-500 mt-1">
							Overview of team expenses and approvals
						</p>
					</div>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<CardStat
						title="Total Submitted"
						value={formatCurrency(stats.totalAmountSubmitted)}
						subtitle={`${stats.totalSubmittedExpenses} expenses`}
						icon={<DollarSign size={28} className="text-purple-600" />}
						bgColor="border-purple-500"
						iconColor="bg-purple-100"
					/>
					<CardStat
						title="Approved"
						value={formatCurrency(stats.totalAmountApproved)}
						subtitle={`${stats.approvedExpenses} expenses`}
						icon={<CheckCircle size={28} className="text-green-600" />}
						bgColor="border-green-500"
						iconColor="bg-green-100"
					/>
					<CardStat
						title="Rejected"
						value={formatCurrency(stats.totalAmountRejected)}
						subtitle={`${stats.rejectedExpenses} expenses`}
						icon={<XCircle size={28} className="text-red-600" />}
						bgColor="border-red-500"
						iconColor="bg-red-100"
					/>
				</div>

				{/* Charts and Recent Expenses */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Expense Status Chart */}
					<Card className="shadow-lg rounded-xl">
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

					{/* Recent Team Expenses */}
					<Card className="shadow-lg rounded-xl">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
								<FileText size={20} className="text-purple-500" />
								Recent Team Expenses
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
													{expense.employee} - {expense.category}
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

export default Dashboard;
