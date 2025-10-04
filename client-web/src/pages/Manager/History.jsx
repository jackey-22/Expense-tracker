import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import PageLayout from '../../components/manager/PageLayout';

const dummyHistory = [
	{
		id: 1,
		description: 'Team lunch',
		owner: { name: 'Alice' },
		category: 'Food',
		managerResponse: 'approved', // Manager's response
		finalStatus: 'approved', // Final system status
		amount: 1200,
	},
	{
		id: 2,
		description: 'Office supplies',
		owner: { name: 'Bob' },
		category: 'Stationery',
		managerResponse: 'approved',
		finalStatus: 'approved',
		amount: 500,
	},
	{
		id: 3,
		description: 'Travel reimbursement',
		owner: { name: 'Charlie' },
		category: 'Travel',
		managerResponse: 'approved',
		finalStatus: 'rejected',
		amount: 3000,
	},
	{
		id: 4,
		description: 'Client dinner',
		owner: { name: 'David' },
		category: 'Food',
		managerResponse: 'approved',
		finalStatus: 'approved',
		amount: 2500,
	},
	{
		id: 5,
		description: 'Stationery refill',
		owner: { name: 'Eve' },
		category: 'Stationery',
		managerResponse: 'rejected',
		finalStatus: 'rejected',
		amount: 700,
	},
];

const statusOptions = [
	{ label: 'All', value: null },
	{ label: 'Approved', value: 'approved' },
	{ label: 'Rejected', value: 'rejected' },
];

const categoryOptions = [
	{ label: 'All', value: null },
	{ label: 'Food', value: 'Food' },
	{ label: 'Stationery', value: 'Stationery' },
	{ label: 'Travel', value: 'Travel' },
];

const sortOptions = [
	{ label: 'Amount (Low to High)', value: 'amountAsc' },
	{ label: 'Amount (High to Low)', value: 'amountDesc' },
	{ label: 'Owner (A-Z)', value: 'ownerAsc' },
	{ label: 'Owner (Z-A)', value: 'ownerDesc' },
];

const History = () => {
	const [statusFilter, setStatusFilter] = useState(null);
	const [categoryFilter, setCategoryFilter] = useState(null);
	const [sortBy, setSortBy] = useState(null);

	// Filtering
	let filteredHistory = dummyHistory;
	if (statusFilter)
		filteredHistory = filteredHistory.filter((r) => r.finalStatus === statusFilter);
	if (categoryFilter)
		filteredHistory = filteredHistory.filter((r) => r.category === categoryFilter);

	// Sorting
	if (sortBy === 'amountAsc')
		filteredHistory = [...filteredHistory].sort((a, b) => a.amount - b.amount);
	else if (sortBy === 'amountDesc')
		filteredHistory = [...filteredHistory].sort((a, b) => b.amount - a.amount);
	else if (sortBy === 'ownerAsc')
		filteredHistory = [...filteredHistory].sort((a, b) =>
			a.owner.name.localeCompare(b.owner.name)
		);
	else if (sortBy === 'ownerDesc')
		filteredHistory = [...filteredHistory].sort((a, b) =>
			b.owner.name.localeCompare(a.owner.name)
		);

	return (
		<PageLayout>
			<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-10">
				<h1 className="text-3xl font-bold text-indigo-800 mb-6 tracking-tight">
					Expense History
				</h1>

				{/* Filters */}
				<div className="flex flex-wrap gap-4 mb-6">
					<Dropdown
						value={statusFilter}
						options={statusOptions}
						onChange={(e) => setStatusFilter(e.value)}
						placeholder="Filter by Status"
						className="w-48"
					/>
					<Dropdown
						value={categoryFilter}
						options={categoryOptions}
						onChange={(e) => setCategoryFilter(e.value)}
						placeholder="Filter by Category"
						className="w-48"
					/>
					<Dropdown
						value={sortBy}
						options={sortOptions}
						onChange={(e) => setSortBy(e.value)}
						placeholder="Sort"
						className="w-56"
					/>
					<button
						className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded shadow"
						onClick={() => {
							setStatusFilter(null);
							setCategoryFilter(null);
							setSortBy(null);
						}}
					>
						Clear Filters
					</button>
				</div>

				{/* Table */}
				<div className="bg-white rounded-xl shadow-xl p-6">
					<table className="min-w-full">
						<thead>
							<tr className="bg-indigo-100 text-indigo-700">
								<th className="py-3 px-4 text-left rounded-tl-xl">Description</th>
								<th className="py-3 px-4 text-left">Request Owner</th>
								<th className="py-3 px-4 text-left">Category</th>
								<th className="py-3 px-4 text-left">Your Response</th>
								<th className="py-3 px-4 text-left">Final Status</th>
								<th className="py-3 px-4 text-left rounded-tr-xl">Amount</th>
							</tr>
						</thead>
						<tbody>
							{filteredHistory.length > 0 ? (
								filteredHistory.map((exp, idx) => (
									<tr
										key={exp.id}
										className={`${
											idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
										} hover:bg-indigo-50 transition-colors`}
									>
										<td className="py-2 px-4">{exp.description}</td>
										<td className="py-2 px-4 flex items-center gap-2">
											<img
												src={`https://ui-avatars.com/api/?name=${exp.owner.name}`}
												alt={exp.owner.name}
												className="w-8 h-8 rounded-full border border-indigo-200"
											/>
											<span>{exp.owner.name}</span>
										</td>
										<td className="py-2 px-4">{exp.category}</td>
										<td className="py-2 px-4">
											<span
												className={`px-2 py-1 rounded text-xs font-semibold ${
													exp.managerResponse === 'approved'
														? 'bg-green-100 text-green-700'
														: 'bg-red-100 text-red-700'
												}`}
											>
												{exp.managerResponse.charAt(0).toUpperCase() +
													exp.managerResponse.slice(1)}
											</span>
										</td>
										<td className="py-2 px-4">
											<span
												className={`px-2 py-1 rounded text-xs font-semibold ${
													exp.finalStatus === 'approved'
														? 'bg-green-100 text-green-700'
														: 'bg-red-100 text-red-700'
												}`}
											>
												{exp.finalStatus.charAt(0).toUpperCase() +
													exp.finalStatus.slice(1)}
											</span>
										</td>
										<td className="py-2 px-4 font-medium">
											₹{exp.amount.toLocaleString()}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="py-8 text-center text-gray-500">
										No expense history found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</PageLayout>
	);
};

export default History;
