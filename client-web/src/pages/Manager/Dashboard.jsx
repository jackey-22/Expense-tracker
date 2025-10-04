import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import PageLayout from '../../components/manager/PageLayout';

const dummyRequests = [
	{ id: 1, status: 'pending', amount: 1200 },
	{ id: 2, status: 'approved', amount: 500 },
	{ id: 3, status: 'rejected', amount: 3000 },
];

const getCount = (status) => dummyRequests.filter((r) => r.status === status).length;
const getTotal = () => dummyRequests.length;

const Dashboard = () => {
	const [activePage, setActivePage] = useState('Dashboard');

	return (
		<PageLayout>
			<div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
				<div className="flex-1 p-10">
					<h1 className="text-3xl font-bold text-indigo-800 mb-8">Manager Dashboard</h1>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<Card title="Pending Requests" className="shadow-lg">
							<div className="flex items-center gap-2">
								<Tag value="Pending" severity="warning" />
								<span className="text-2xl font-bold">{getCount('pending')}</span>
							</div>
						</Card>
						<Card title="Completed Requests" className="shadow-lg">
							<div className="flex items-center gap-2">
								<Tag value="Approved" severity="success" />
								<span className="text-2xl font-bold">{getCount('approved')}</span>
							</div>
						</Card>
						<Card title="Rejected Requests" className="shadow-lg">
							<div className="flex items-center gap-2">
								<Tag value="Rejected" severity="danger" />
								<span className="text-2xl font-bold">{getCount('rejected')}</span>
							</div>
						</Card>
						<Card title="Total Requests" className="shadow-lg">
							<div className="flex items-center gap-2">
								<Tag value="Total" severity="info" />
								<span className="text-2xl font-bold">{getTotal()}</span>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</PageLayout>
	);
};

export default Dashboard;
