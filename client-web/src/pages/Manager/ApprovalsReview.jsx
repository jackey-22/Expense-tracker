import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import PageLayout from '../../components/manager/PageLayout';

const dummyRequests = [
	{
		id: 1,
		description: 'Team lunch',
		owner: { name: 'Alice' },
		category: 'Food',
		status: 'pending',
		amount: 1200,
	},
	{
		id: 2,
		description: 'Office supplies',
		owner: { name: 'Bob' },
		category: 'Stationery',
		status: 'approved',
		amount: 500,
	},
	{
		id: 3,
		description: 'Travel reimbursement',
		owner: { name: 'Charlie' },
		category: 'Travel',
		status: 'rejected',
		amount: 3000,
	},
];

const statusOptions = [
	{ label: 'All', value: null },
	{ label: 'Pending', value: 'pending' },
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

const ApprovalsReview = () => {
	const [requests, setRequests] = useState(dummyRequests);
	const [statusFilter, setStatusFilter] = useState(null);
	const [categoryFilter, setCategoryFilter] = useState(null);
	const [sortBy, setSortBy] = useState(null);
	const [remarks, setRemarks] = useState({});
	const toast = useRef(null);

	// Filtering
	let filteredRequests = requests;
	if (statusFilter) filteredRequests = filteredRequests.filter((r) => r.status === statusFilter);
	if (categoryFilter)
		filteredRequests = filteredRequests.filter((r) => r.category === categoryFilter);

	// Sorting
	if (sortBy === 'amountAsc')
		filteredRequests = [...filteredRequests].sort((a, b) => a.amount - b.amount);
	else if (sortBy === 'amountDesc')
		filteredRequests = [...filteredRequests].sort((a, b) => b.amount - a.amount);
	else if (sortBy === 'ownerAsc')
		filteredRequests = [...filteredRequests].sort((a, b) =>
			a.owner.name.localeCompare(b.owner.name)
		);
	else if (sortBy === 'ownerDesc')
		filteredRequests = [...filteredRequests].sort((a, b) =>
			b.owner.name.localeCompare(a.owner.name)
		);

	const handleAction = (id, actionType) => {
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

		setRequests((prev) =>
			prev.map((req) => {
				if (req.id === id && req.status === 'pending') {
					toast.current.show({
						severity: actionType === 'approve' ? 'success' : 'error',
						summary: actionType === 'approve' ? 'Approved' : 'Rejected',
						detail: `Request ${actionType}d with remarks!`,
						life: 2000,
					});
					return {
						...req,
						status: actionType === 'approve' ? 'approved' : 'rejected',
						remarks: remarkText,
					};
				}
				return req;
			})
		);

		setRemarks((prev) => ({ ...prev, [id]: '' }));
	};

	return (
		<PageLayout>
			<div className="min-h-screen p-10">
				<Toast ref={toast} />

				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-blue-800 tracking-tight">
						Expense Requests Review
					</h1>
					<div className="flex items-center gap-4">
						<Button
							label="Export"
							icon="pi pi-download"
							className="p-button-sm p-button-info"
						/>
						<Button
							label="Refresh"
							icon="pi pi-refresh"
							className="p-button-sm p-button-secondary"
							onClick={() => setRequests(dummyRequests)}
						/>
					</div>
				</div>

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
					<Button
						label="Clear Filters"
						icon="pi pi-filter-slash"
						className="p-button-sm p-button-secondary"
						onClick={() => {
							setStatusFilter(null);
							setCategoryFilter(null);
							setSortBy(null);
						}}
					/>
				</div>

				{/* Table */}
				<div className="bg-white rounded-xl shadow-xl p-6 overflow-x-auto">
					<table className="min-w-full">
						<thead>
							<tr className="bg-blue-100 text-blue-700">
								<th className="py-3 px-4 text-left rounded-tl-xl">Description</th>
								<th className="py-3 px-4 text-left">Request Owner</th>
								<th className="py-3 px-4 text-left">Category</th>
								<th className="py-3 px-4 text-left">Status</th>
								<th className="py-3 px-4 text-left">Remarks</th>
								<th className="py-3 px-4 text-left rounded-tr-xl">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredRequests.length > 0 ? (
								filteredRequests.map((req, idx) => (
									<tr
										key={req.id}
										className={`transition-colors ${
											idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
										} hover:bg-blue-50`}
									>
										<td className="py-2 px-4">{req.description}</td>
										<td className="py-2 px-4 flex items-center gap-2">
											<img
												src={`https://ui-avatars.com/api/?name=${req.owner.name}`}
												alt={req.owner.name}
												className="w-8 h-8 rounded-full border border-blue-200"
											/>
											<span>{req.owner.name}</span>
										</td>
										<td className="py-2 px-4">{req.category}</td>
										<td className="py-2 px-4">
											<span
												className={`px-2 py-1 rounded text-xs font-semibold ${
													req.status === 'approved'
														? 'bg-green-100 text-green-700'
														: req.status === 'rejected'
														? 'bg-red-100 text-red-700'
														: 'bg-blue-100 text-blue-700'
												}`}
											>
												{req.status.charAt(0).toUpperCase() +
													req.status.slice(1)}
											</span>
										</td>
										<td className="py-2 px-4">
											{req.status === 'pending' ? (
												<input
													type="text"
													placeholder="Add remarks..."
													value={remarks[req.id] || ''}
													onChange={(e) =>
														setRemarks((prev) => ({
															...prev,
															[req.id]: e.target.value,
														}))
													}
													className="border border-gray-300 rounded px-2 py-1 w-full"
												/>
											) : (
												req.remarks || '-'
											)}
										</td>
										<td className="py-2 px-4 flex gap-2">
											<Button
												label="Approve"
												icon="pi pi-check"
												className="p-button-success p-button-sm"
												onClick={() => handleAction(req.id, 'approve')}
												disabled={req.status !== 'pending'}
											/>
											<Button
												label="Reject"
												icon="pi pi-times"
												className="p-button-danger p-button-sm"
												onClick={() => handleAction(req.id, 'reject')}
												disabled={req.status !== 'pending'}
											/>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="6" className="py-8 text-center text-gray-500">
										No requests found.
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

export default ApprovalsReview;
