// pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../../components/admin/PageLayout';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { Users, UserCheck, CheckCircle, XCircle, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
	const toast = useRef(null);
	const [loading, setLoading] = useState(true);

	const [stats, setStats] = useState({
		totalEmployees: 156,
		totalManagers: 24,
		totalExpenses: 221,
		acceptedExpenses: 189,
		rejectedExpenses: 32,
		totalAmount: 75000,
		acceptedAmount: 58000,
		rejectedAmount: 17000,
	});

	// Doughnut chart - Expense Status
	const expenseStatusData = {
		labels: ['Accepted', 'Rejected'],
		datasets: [
			{
				data: [stats.acceptedExpenses, stats.rejectedExpenses],
				backgroundColor: ['#22c55e', '#ef4444'],
				hoverBackgroundColor: ['#16a34a', '#dc2626'],
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
				labels: { usePointStyle: true, padding: 15, font: { size: 12 } },
			},
		},
	};

	// Bar chart - Expenses by Category
	const categoryExpenseData = {
		labels: ['Travel', 'Meals', 'Equipment', 'Software', 'Training', 'Office Supplies'],
		datasets: [
			{
				label: 'Accepted',
				data: [45, 38, 28, 22, 18, 38],
				backgroundColor: '#22c55e',
			},
			{
				label: 'Rejected',
				data: [8, 12, 6, 4, 3, 5],
				backgroundColor: '#ef4444',
			},
		],
	};

	const barChartOptions = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: { usePointStyle: true, padding: 15, font: { size: 12 } },
			},
		},
		scales: {
			y: { beginAtZero: true, title: { display: true, text: 'Number of Expenses' } },
			x: { title: { display: true, text: 'Expense Categories' } },
		},
	};

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	const formatCurrency = (amount) =>
		new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
		}).format(amount);

	return (
		<PageLayout>
			<Toast ref={toast} />
			<div className="p-6 space-y-6">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
					<p className="text-gray-600">Overview of employees, managers, and expenses</p>
				</div>

				{/* Statistics Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<Card className="border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500 font-medium">Employees</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{stats.totalEmployees}
								</h2>
							</div>
							<div className="p-3 bg-blue-100 rounded-full">
								<Users size={24} className="text-blue-600" />
							</div>
						</div>
					</Card>

					<Card className="border-l-4 border-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500 font-medium">Managers</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{stats.totalManagers}
								</h2>
							</div>
							<div className="p-3 bg-purple-100 rounded-full">
								<UserCheck size={24} className="text-purple-600" />
							</div>
						</div>
					</Card>

					<Card className="border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500 font-medium">Accepted Expenses</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{stats.acceptedExpenses}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{formatCurrency(stats.acceptedAmount)}
								</p>
							</div>
							<div className="p-3 bg-green-100 rounded-full">
								<CheckCircle size={24} className="text-green-600" />
							</div>
						</div>
					</Card>

					<Card className="border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-gray-500 font-medium">Rejected Expenses</p>
								<h2 className="text-2xl font-bold text-gray-800">
									{stats.rejectedExpenses}
								</h2>
								<p className="text-sm text-gray-500 mt-1">
									{formatCurrency(stats.rejectedAmount)}
								</p>
							</div>
							<div className="p-3 bg-red-100 rounded-full">
								<XCircle size={24} className="text-red-600" />
							</div>
						</div>
					</Card>
				</div>

				{/* Charts */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
								<TrendingUp size={20} className="text-blue-500" />
								Expense Status Overview
							</h3>
						</div>
						<div className="p-6" style={{ height: '350px' }}>
							<Chart
								type="doughnut"
								data={expenseStatusData}
								options={chartOptions}
								style={{ height: '100%' }}
							/>
						</div>
					</Card>

					<Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
						<div className="p-4 border-b border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
								<TrendingUp size={20} className="text-green-500" />
								Expenses by Category
							</h3>
						</div>
						<div className="p-6" style={{ height: '350px' }}>
							<Chart
								type="bar"
								data={categoryExpenseData}
								options={barChartOptions}
								style={{ height: '100%' }}
							/>
						</div>
					</Card>
				</div>
			</div>
		</PageLayout>
	);
};

export default AdminDashboard;
