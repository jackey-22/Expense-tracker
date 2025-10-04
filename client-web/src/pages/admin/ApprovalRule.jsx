import { useState, useRef } from 'react';
import PageLayout from '../../components/admin/PageLayout';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { fetchPost } from '../../utils/fetch.utils';

function ApprovalRule() {
	const [description, setDescription] = useState('Approval rule for miscellaneous expenses');
	const [manager, setManager] = useState(null);
	const [isManagerApprover, setIsManagerApprover] = useState(false);
	const [sequence, setSequence] = useState(false);
	const [minApprovalPercent, setMinApprovalPercent] = useState(60);
	const [approvers, setApprovers] = useState([
		{ id: 1, user: { _id: '1', name: 'John' }, required: true },
		{ id: 2, user: { _id: '2', name: 'Mitchell' }, required: false },
		{ id: 3, user: { _id: '3', name: 'Andreas' }, required: false },
	]);
	const [loading, setLoading] = useState(false);
	const toast = useRef(null);

	const managerOptions = [
		{ label: 'Sarah', value: { _id: '4', name: 'Sarah' } },
		{ label: 'Tom', value: { _id: '5', name: 'Tom' } },
		{ label: 'Emma', value: { _id: '6', name: 'Emma' } },
	];

	const addApprover = () => {
		const newId = approvers.length ? Math.max(...approvers.map((a) => a.id)) + 1 : 1;
		setApprovers([...approvers, { id: newId, user: null, required: false }]);
	};

	const removeApprover = (id) => {
		setApprovers(approvers.filter((a) => a.id !== id));
	};

	const updateApproverUser = (id, user) => {
		setApprovers(approvers.map((a) => (a.id === id ? { ...a, user } : a)));
	};

	const toggleRequired = (id) => {
		setApprovers(approvers.map((a) => (a.id === id ? { ...a, required: !a.required } : a)));
	};

	const requiredBodyTemplate = (rowData) => (
		<Checkbox
			onChange={() => toggleRequired(rowData.id)}
			checked={rowData.required}
			tooltip="Mark as required approver"
			tooltipOptions={{ position: 'top' }}
		/>
	);

	const userBodyTemplate = (rowData) => (
		<Dropdown
			value={rowData.user}
			options={managerOptions}
			onChange={(e) => updateApproverUser(rowData.id, e.value)}
			optionLabel="label"
			placeholder="Select User"
			className="w-full rounded border border-gray-300 focus:ring-2 focus:ring-primary transition-all"
		/>
	);

	const actionBodyTemplate = (rowData) => (
		<Button
			icon="pi pi-trash"
			severity="danger"
			text
			onClick={() => removeApprover(rowData.id)}
			tooltip="Remove Approver"
			tooltipOptions={{ position: 'top' }}
		/>
	);

	const handleSave = async () => {
		if (!description || !manager || !minApprovalPercent || approvers.some((a) => !a.user)) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Please fill all required fields (Description, Manager, Approvers, Min Approval %).',
				life: 5000,
			});
			return;
		}

		setLoading(true);
		try {
			const payload = {
				user: 'admin_id', // Replace with actual admin ID from auth context
				description,
				manager: manager._id,
				isManagerApprover,
				approvers: approvers.map((a) => ({ user: a.user._id, required: a.required })),
				sequence,
				minApprovalPercent,
				company: 'company_id', // Replace with actual company ID from auth context
			};
			const response = await fetchPost({
				pathName: 'approval-rule',
				body: JSON.stringify(payload),
			});

			if (response?.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Success',
					detail: 'Approval rule saved successfully!',
					life: 5000,
				});
			} else {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: response?.message || 'Failed to save approval rule.',
				});
			}
		} catch (error) {
			console.error('Save approval rule error:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Something went wrong. Please try again.',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<PageLayout>
			<div className="mx-auto">
				<Card
					title={
						<h2 className="text-2xl font-bold text-primary">Approval Rule Settings</h2>
					}
					className="shadow-lg bg-white border border-gray-200 rounded-xl"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
						{/* Description */}
						<div>
							<label className="block font-medium text-primary mb-1">
								Description
							</label>
							<InputText
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter rule description"
								className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-primary hover:border-primary transition-all"
							/>
							<small className="text-gray-500">
								Describe the purpose of this rule
							</small>
						</div>

						{/* Manager Dropdown */}
						<div>
							<label className="block font-medium text-primary mb-1">Manager</label>
							<Dropdown
								value={manager}
								options={managerOptions}
								onChange={(e) => setManager(e.value)}
								optionLabel="label"
								placeholder="Select Manager"
								className="w-full rounded border border-gray-300 focus:ring-2 focus:ring-primary transition-all"
							/>
							<small className="text-gray-500">
								Select the manager responsible for approvals
							</small>
						</div>

						{/* Manager Approver Checkbox */}
						<div className="flex items-center gap-2">
							<Checkbox
								inputId="managerApprover"
								onChange={(e) => setIsManagerApprover(e.checked)}
								checked={isManagerApprover}
							/>
							<label htmlFor="managerApprover" className="text-primary font-medium">
								Is manager an approver?
							</label>
							<Tooltip target=".manager-approver-tooltip" />
							<i
								className="pi pi-info-circle manager-approver-tooltip text-primary ml-2"
								data-pr-tooltip="If checked, the manager is included in the approval process."
							/>
						</div>
					</div>

					{/* Approvers Section */}
					<div className="border-t border-gray-200 my-4"></div>
					<h3 className="text-lg font-semibold text-primary mb-4 px-4">Approvers</h3>
					<div className="px-4">
						<Button
							label="Add Approver"
							icon="pi pi-plus"
							onClick={addApprover}
							className="mb-4 bg-primary hover:bg-[#2a547a] text-white rounded shadow-sm transform hover:scale-105 transition-all"
						/>
						<DataTable
							value={approvers}
							responsiveLayout="scroll"
							stripedRows
							className="rounded-lg shadow-sm"
							emptyMessage="No approvers added."
						>
							<Column field="id" header="#" style={{ width: '10%' }} />
							<Column
								header="User"
								body={userBodyTemplate}
								style={{ width: '60%' }}
							/>
							<Column
								header="Required"
								body={requiredBodyTemplate}
								style={{ width: '20%', textAlign: 'center' }}
							/>
							<Column
								header="Action"
								body={actionBodyTemplate}
								style={{ width: '10%' }}
							/>
						</DataTable>
					</div>

					{/* Sequence and Approval Percentage */}
					<div className="border-t border-gray-200 my-4"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
						<div className="flex items-center gap-2">
							<Checkbox
								inputId="sequence"
								onChange={(e) => setSequence(e.checked)}
								checked={sequence}
							/>
							<label htmlFor="sequence" className="text-primary font-medium">
								Approvers sequence matters
							</label>
							<Tooltip target=".sequence-tooltip" />
							<i
								className="pi pi-info-circle sequence-tooltip text-primary ml-2"
								data-pr-tooltip="If checked, approvals follow the order listed."
							/>
						</div>
						<div>
							<label className="block font-medium text-primary mb-1">
								Minimum Approval Percentage
							</label>
							<InputNumber
								value={minApprovalPercent}
								onValueChange={(e) => setMinApprovalPercent(e.value)}
								suffix="%"
								min={0}
								max={100}
								className="w-full"
							/>
							<small className="text-gray-500">
								Percentage of approvers needed to approve
							</small>
						</div>
					</div>

					{/* Save Button */}
					<div className="text-right mt-4 px-4">
						<Button
							label="Save Rule"
							icon="pi pi-check"
							severity="success"
							loading={loading}
							onClick={handleSave}
							className="bg-primary hover:bg-[#2a547a] text-white font-semibold py-2 rounded shadow-sm transform hover:scale-105 transition-all"
						/>
					</div>
					<Toast ref={toast} />
				</Card>
			</div>
		</PageLayout>
	);
}

export default ApprovalRule;
