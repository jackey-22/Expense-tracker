import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputSwitch } from 'primereact/inputswitch';
import { Chip } from 'primereact/chip';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { TabView, TabPanel } from 'primereact/tabview';
import PageLayout from '../../components/admin/PageLayout';
import { fetchGet, fetchPost } from '../../utils/fetch.utils';

const UserManagement = () => {
	// State for users data
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tableLoading, setTableLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);

	// Theme configuration
	const theme = {
		primary: '#336699',
		primaryLight: '#4a80b5',
		primaryDark: '#28527a',
		secondary: '#9333ea',
		success: '#10b981',
		warning: '#f59e0b',
		error: '#ef4444',
		background: '#f8fafc',
		cardGradient: 'linear-gradient(135deg, #336699 0%, #4a80b5 100%)',
	};

	// Filters
	const roles = [
		{ label: 'Employee', value: 'Employee', icon: 'pi-user' },
		{ label: 'Manager', value: 'Manager', icon: 'pi-users' },
		{ label: 'Admin', value: 'Admin', icon: 'pi-shield' },
	];
	const statuses = [
		{ label: 'Active', value: 'Active', icon: 'pi-check-circle' },
		{ label: 'Inactive', value: 'Inactive', icon: 'pi-times-circle' },
	];
	const departments = [
		{ label: 'IT', value: 'IT', icon: 'pi-desktop' },
		{ label: 'Finance', value: 'Finance', icon: 'pi-dollar' },
		{ label: 'HR', value: 'HR', icon: 'pi-users' },
		{ label: 'Marketing', value: 'Marketing', icon: 'pi-chart-bar' },
		{ label: 'Sales', value: 'Sales', icon: 'pi-shopping-cart' },
		{ label: 'Operations', value: 'Operations', icon: 'pi-cog' },
	];

	const [selectedRole, setSelectedRole] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedDept, setSelectedDept] = useState(null);
	const [globalFilter, setGlobalFilter] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [viewMode, setViewMode] = useState('table');

	// Modal states
	const [showUserDialog, setShowUserDialog] = useState(false);
	const [showUserDetail, setShowUserDetail] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editingUser, setEditingUser] = useState(null);
	const [userForm, setUserForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'Employee',
		department: '',
		manager: '',
		isManagerApprover: false,
		phone: '',
		location: '',
		jobTitle: '',
	});

	const [showBulkImport, setShowBulkImport] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const toastRef = useRef(null);

	// Get managers list from current users
	const managers = users
		.filter((u) => u.role === 'Manager' && u.status === 'Active')
		.map((m) => ({ label: m.name, value: m.id, email: m.email }));

	// Filter users based on selected filters
	const filteredUsers = users.filter((user) => {
		const matchesGlobal =
			!globalFilter ||
			user.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
			user.email?.toLowerCase().includes(globalFilter.toLowerCase()) ||
			user.department?.toLowerCase().includes(globalFilter.toLowerCase()) ||
			user.jobTitle?.toLowerCase().includes(globalFilter.toLowerCase());

		return (
			matchesGlobal &&
			(!selectedRole || user.role === selectedRole) &&
			(!selectedStatus || user.status === selectedStatus) &&
			(!selectedDept || user.department === selectedDept)
		);
	});

	// API Functions
	const fetchUsers = useCallback(async () => {
		setTableLoading(true);
		try {
			const response = await fetchGet({ pathName: 'admin/users' });
			if (response.success) {
				setUsers(response.users || []);
			} else {
				showToast('error', 'Error', response.message || 'Failed to fetch users');
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to fetch users');
			console.error('Error fetching users:', error);
		} finally {
			setLoading(false);
			setTableLoading(false);
		}
	}, []);

	const createUser = async (userData) => {
		setActionLoading(true);
		try {
			const response = await fetchPost({
				pathName: 'admin/users',
				body: JSON.stringify(userData),
			});

			if (response.success) {
				showToast('success', 'Success', 'User created successfully');
				await fetchUsers();
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to create user');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to create user');
			console.error('Error creating user:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	const updateUser = async (userId, userData) => {
		setActionLoading(true);
		try {
			const response = await fetchPost({
				pathName: `admin/users/${userId}`,
				body: JSON.stringify(userData),
				method: 'PATCH',
			});

			if (response.success) {
				showToast('success', 'Success', 'User updated successfully');
				await fetchUsers();
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to update user');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to update user');
			console.error('Error updating user:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	const deleteUser = async (userId) => {
		setActionLoading(true);
		try {
			const response = await fetchPost({
				pathName: `admin/users/${userId}`,
				method: 'DELETE',
			});

			if (response.success) {
				showToast('success', 'Success', 'User deleted successfully');
				await fetchUsers();
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to delete user');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to delete user');
			console.error('Error deleting user:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	const toggleUserStatus = async (userId, currentStatus) => {
		setActionLoading(true);
		try {
			const response = await fetchPost({
				pathName: `admin/users/${userId}/toggle-status`,
				body: JSON.stringify({}),
				method: 'PATCH',
			});

			if (response.success) {
				showToast(
					'success',
					'Success',
					`User ${currentStatus === 'Active' ? 'deactivated' : 'activated'} successfully`
				);
				await fetchUsers();
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to update user status');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to update user status');
			console.error('Error updating user status:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	const resetPassword = async (userId) => {
		setActionLoading(true);
		try {
			const response = await fetchPost({
				pathName: `admin/users/${userId}/reset-password`,
				method: 'PATCH',
			});

			if (response.success) {
				showToast('success', 'Success', 'Password reset email sent successfully');
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to reset password');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to reset password');
			console.error('Error resetting password:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	const bulkImportUsers = async (file) => {
		setActionLoading(true);
		try {
			// Parse CSV file content
			const text = await file.text();
			const lines = text.split('\n').filter((line) => line.trim());

			if (lines.length < 2) {
				showToast(
					'error',
					'Error',
					'CSV file must contain headers and at least one data row'
				);
				return false;
			}

			// Parse CSV headers and data
			const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
			const users = [];

			for (let i = 1; i < lines.length; i++) {
				const values = lines[i].split(',').map((v) => v.trim());
				if (values.length === headers.length) {
					const user = {};
					headers.forEach((header, index) => {
						user[header] = values[index];
					});
					users.push(user);
				}
			}

			const response = await fetchPost({
				pathName: 'admin/users/bulk-import',
				body: JSON.stringify({ users }),
			});

			if (response.success) {
				showToast(
					'success',
					'Success',
					response.message ||
						`${response.results?.successful || 0} users imported successfully`
				);
				await fetchUsers();
				return true;
			} else {
				showToast('error', 'Error', response.message || 'Failed to import users');
				return false;
			}
		} catch (error) {
			showToast('error', 'Error', 'Failed to import users');
			console.error('Error importing users:', error);
			return false;
		} finally {
			setActionLoading(false);
		}
	};

	// Toast function
	const showToast = (severity, summary, detail) => {
		toastRef.current?.show({ severity, summary, detail, life: 3000 });
	};

	// Generate avatar with gradient based on name
	const getAvatarProps = (name) => {
		const colors = [
			{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				label: name?.charAt(0)?.toUpperCase() || 'U',
			},
			{
				background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
				label: name?.charAt(0)?.toUpperCase() || 'U',
			},
			{
				background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
				label: name?.charAt(0)?.toUpperCase() || 'U',
			},
			{
				background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
				label: name?.charAt(0)?.toUpperCase() || 'U',
			},
		];
		const index = (name?.charCodeAt(0) || 0) % colors.length;
		return colors[index];
	};

	// Reset form
	const resetForm = () => {
		setUserForm({
			name: '',
			email: '',
			password: '',
			role: 'Employee',
			department: '',
			manager: '',
			isManagerApprover: false,
			phone: '',
			location: '',
			jobTitle: '',
		});
	};

	// Open create/edit dialog
	const openUserDialog = (user = null) => {
		if (user) {
			setEditingUser(user);
			setUserForm({
				name: user.name || '',
				email: user.email || '',
				password: '',
				role: user.role || 'Employee',
				department: user.department || '',
				manager: user.managerId || user.manager || '',
				isManagerApprover: user.isManagerApprover || false,
				phone: user.phone || '',
				location: user.location || '',
				jobTitle: user.jobTitle || '',
			});
		} else {
			setEditingUser(null);
			resetForm();
		}
		setShowUserDialog(true);
	};

	// View user details
	const openUserDetail = (user) => {
		setSelectedUser(user);
		setShowUserDetail(true);
	};

	// Save user
	const saveUser = async () => {
		if (!userForm.name || !userForm.email || !userForm.role) {
			showToast('error', 'Error', 'Please fill in all required fields');
			return;
		}

		if (!editingUser && !userForm.password) {
			showToast('error', 'Error', 'Password is required for new users');
			return;
		}

		const userData = {
			name: userForm.name,
			email: userForm.email,
			role: userForm.role,
			department: userForm.department,
			managerId: userForm.manager,
			isManagerApprover: userForm.isManagerApprover,
			phone: userForm.phone,
			location: userForm.location,
			jobTitle: userForm.jobTitle,
		};

		// Only include password for new users
		if (!editingUser) {
			userData.password = userForm.password;
		}

		let success = false;
		if (editingUser) {
			success = await updateUser(editingUser.id, userData);
		} else {
			success = await createUser(userData);
		}

		if (success) {
			setShowUserDialog(false);
			resetForm();
			setEditingUser(null);
		}
	};

	// Toggle user status with confirmation
	const confirmToggleStatus = (user) => {
		confirmDialog({
			message: `Are you sure you want to ${
				user.status === 'Active' ? 'deactivate' : 'activate'
			} ${user.name}?`,
			header: 'Confirm Status Change',
			icon: 'pi pi-exclamation-triangle',
			accept: () => handleToggleStatus(user),
			acceptClassName: user.status === 'Active' ? 'p-button-danger' : 'p-button-success',
		});
	};

	const handleToggleStatus = async (user) => {
		await toggleUserStatus(user.id, user.status);
	};

	// Confirm delete user
	const confirmDeleteUser = (user) => {
		confirmDialog({
			message: `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
			header: 'Delete Confirmation',
			icon: 'pi pi-trash',
			accept: () => handleDeleteUser(user),
			acceptClassName: 'p-button-danger',
		});
	};

	const handleDeleteUser = async (user) => {
		await deleteUser(user.id);
	};

	// Reset password
	const confirmResetPassword = (user) => {
		confirmDialog({
			message: `Reset password for ${user.name}? A new temporary password will be sent to ${user.email}.`,
			header: 'Reset Password',
			icon: 'pi pi-key',
			accept: () => handleResetPassword(user),
		});
	};

	const handleResetPassword = async (user) => {
		await resetPassword(user.id);
	};

	// Bulk actions
	const confirmBulkDelete = () => {
		confirmDialog({
			message: `Are you sure you want to deactivate ${selectedUsers.length} selected users?`,
			header: 'Bulk Deactivation',
			icon: 'pi pi-exclamation-triangle',
			accept: () => handleBulkDelete(),
			acceptClassName: 'p-button-danger',
		});
	};

	const handleBulkDelete = async () => {
		setActionLoading(true);
		try {
			const promises = selectedUsers.map((user) => toggleUserStatus(user.id, 'Active'));
			await Promise.all(promises);
			setSelectedUsers([]);
		} finally {
			setActionLoading(false);
		}
	};

	// CSV Upload handler
	const onCSVUpload = async (event) => {
		const file = event.files[0];
		if (!file) {
			showToast('error', 'Error', 'Please select a file to upload');
			return;
		}

		const success = await bulkImportUsers(file);
		if (success) {
			setShowBulkImport(false);
		}
	};

	// Enhanced User Column Template
	const userBodyTemplate = (rowData) => {
		const avatarProps = getAvatarProps(rowData.name);
		return (
			<div
				className="flex items-center gap-3 cursor-pointer"
				onClick={() => openUserDetail(rowData)}
			>
				<div
					className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
					style={{ background: avatarProps.background }}
				>
					{avatarProps.label}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="font-semibold text-gray-800 truncate">{rowData.name}</span>
						{rowData.status === 'Active' && (
							<i className="pi pi-verified text-blue-500 text-sm"></i>
						)}
					</div>
					<div className="text-sm text-gray-500 truncate">{rowData.email}</div>
					<div className="text-xs text-gray-400 truncate">{rowData.jobTitle}</div>
				</div>
			</div>
		);
	};

	// Enhanced Role Template
	const roleTemplate = (rowData) => {
		const roleConfig = {
			Manager: {
				icon: 'pi-users',
				badge: 'bg-blue-100 text-blue-700',
			},
			Employee: {
				icon: 'pi-user',
				badge: 'bg-green-100 text-green-700',
			},
			Admin: {
				icon: 'pi-shield',
				badge: 'bg-purple-100 text-purple-700',
			},
		};
		const config = roleConfig[rowData.role] || roleConfig.Employee;

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badge} border-0 shadow-sm`}
			>
				<i className={`pi ${config.icon} text-xs`}></i>
				<span className="text-sm font-semibold">{rowData.role}</span>
			</div>
		);
	};

	// Enhanced Department Template
	const departmentTemplate = (rowData) => {
		const deptConfig = {
			IT: { icon: 'pi-desktop', color: 'bg-purple-100 text-purple-700' },
			Finance: { icon: 'pi-dollar', color: 'bg-emerald-100 text-emerald-700' },
			HR: { icon: 'pi-users', color: 'bg-orange-100 text-orange-700' },
			Marketing: { icon: 'pi-chart-bar', color: 'bg-pink-100 text-pink-700' },
			Sales: { icon: 'pi-shopping-cart', color: 'bg-cyan-100 text-cyan-700' },
			Operations: { icon: 'pi-cog', color: 'bg-indigo-100 text-indigo-700' },
		};
		const config = deptConfig[rowData.department] || {
			icon: 'pi-building',
			color: 'bg-gray-100 text-gray-700',
		};

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.color} border-0 shadow-sm`}
			>
				<i className={`pi ${config.icon} text-xs`}></i>
				<span className="text-sm font-semibold">{rowData.department}</span>
			</div>
		);
	};

	// Manager Template
	const managerTemplate = (rowData) => {
		if (rowData.role === 'Manager' || rowData.role === 'Admin' || !rowData.managerName) {
			return (
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 border-0">
					<i className="pi pi-minus text-xs"></i>
					<span className="text-sm">Self</span>
				</div>
			);
		}
		return (
			<div
				className="flex items-center gap-2 group cursor-pointer"
				onClick={() => {
					const manager = users.find((u) => u.id === rowData.managerId);
					if (manager) openUserDetail(manager);
				}}
			>
				<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
					{rowData.managerName?.charAt(0) || 'M'}
				</div>
				<div>
					<div className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
						{rowData.managerName}
					</div>
					<div className="text-xs text-gray-400">Manager</div>
				</div>
			</div>
		);
	};

	// Manager Approver Template
	const isManagerApproverTemplate = (rowData) => {
		if (rowData.role !== 'Manager') {
			return (
				<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-400 border-0">
					<i className="pi pi-minus text-xs"></i>
					<span className="text-sm">N/A</span>
				</div>
			);
		}
		return (
			<div className="flex items-center justify-center">
				<InputSwitch
					checked={rowData.isManagerApprover}
					onChange={async (e) => {
						const success = await updateUser(rowData.id, {
							isManagerApprover: e.value,
						});
						if (success) {
							showToast(
								'success',
								'Approver Updated',
								`Manager approver status updated for ${rowData.name}.`
							);
						}
					}}
					disabled={actionLoading}
				/>
			</div>
		);
	};

	// Enhanced Status Template
	const statusTemplate = (rowData) => {
		const statusConfig = {
			Active: {
				icon: 'pi-check-circle',
				badge: 'bg-green-100 text-green-700 border-green-200',
			},
			Inactive: {
				icon: 'pi-times-circle',
				badge: 'bg-red-100 text-red-700 border-red-200',
			},
		};
		const config = statusConfig[rowData.status] || statusConfig.Inactive;

		return (
			<div
				className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badge} border-0 shadow-sm`}
			>
				<div
					className={`w-2 h-2 rounded-full ${
						rowData.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
					}`}
				></div>
				<span className="text-sm font-semibold">{rowData.status}</span>
			</div>
		);
	};

	// Last Login Template
	const lastLoginTemplate = (rowData) => {
		if (!rowData.lastLogin || rowData.lastLogin === 'Never') {
			return (
				<div className="flex items-center gap-2">
					<i className="pi pi-clock text-gray-400 text-sm"></i>
					<span className="text-sm text-gray-400">Never</span>
				</div>
			);
		}

		const loginDate = new Date(rowData.lastLogin);
		const now = new Date();
		const diffDays = Math.floor((now - loginDate) / (1000 * 60 * 60 * 24));

		let status = 'recent';
		if (diffDays > 30) status = 'old';
		else if (diffDays > 7) status = 'medium';

		const statusConfig = {
			recent: { color: 'text-green-500', icon: 'pi-check' },
			medium: { color: 'text-yellow-500', icon: 'pi-exclamation-triangle' },
			old: { color: 'text-red-500', icon: 'pi-exclamation-circle' },
		};

		const config = statusConfig[status];

		return (
			<div className="flex items-center gap-2">
				<i className={`pi ${config.icon} ${config.color} text-sm`}></i>
				<div>
					<div className="text-sm text-gray-700">
						{new Date(rowData.lastLogin).toLocaleDateString()}
					</div>
					<div className="text-xs text-gray-400">
						{diffDays === 0
							? 'Today'
							: diffDays === 1
							? 'Yesterday'
							: `${diffDays} days ago`}
					</div>
				</div>
			</div>
		);
	};

	// Enhanced Action Buttons
	const actionBodyTemplate = (rowData) => {
		return (
			<div className="flex items-center gap-1">
				<Button
					icon="pi pi-eye"
					className="p-button-rounded p-button-text p-button-sm hover:bg-blue-50 transition-all duration-200"
					style={{ color: theme.primary }}
					tooltip="View Details"
					tooltipOptions={{ position: 'top' }}
					onClick={() => openUserDetail(rowData)}
					disabled={actionLoading}
				/>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-text p-button-sm hover:bg-green-50 transition-all duration-200"
					style={{ color: theme.success }}
					tooltip="Edit User"
					tooltipOptions={{ position: 'top' }}
					onClick={() => openUserDialog(rowData)}
					disabled={actionLoading}
				/>
				<Button
					icon="pi pi-key"
					className="p-button-rounded p-button-text p-button-sm hover:bg-yellow-50 transition-all duration-200"
					style={{ color: theme.warning }}
					tooltip="Reset Password"
					tooltipOptions={{ position: 'top' }}
					onClick={() => confirmResetPassword(rowData)}
					disabled={actionLoading}
				/>
				<Button
					icon={rowData.status === 'Active' ? 'pi pi-ban' : 'pi pi-check'}
					className="p-button-rounded p-button-text p-button-sm hover:bg-orange-50 transition-all duration-200"
					style={{ color: rowData.status === 'Active' ? theme.error : theme.success }}
					tooltip={rowData.status === 'Active' ? 'Deactivate' : 'Activate'}
					tooltipOptions={{ position: 'top' }}
					onClick={() => confirmToggleStatus(rowData)}
					disabled={actionLoading}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-text p-button-sm hover:bg-red-50 transition-all duration-200"
					style={{ color: theme.error }}
					tooltip="Delete User"
					tooltipOptions={{ position: 'top' }}
					onClick={() => confirmDeleteUser(rowData)}
					disabled={actionLoading}
				/>
			</div>
		);
	};

	// User form footer
	const userDialogFooter = (
		<div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
			<Button
				label="Cancel"
				icon="pi pi-times"
				onClick={() => setShowUserDialog(false)}
				className="p-button-text p-button-sm"
				style={{ color: '#6b7280' }}
				disabled={actionLoading}
			/>
			<Button
				label={editingUser ? 'Update User' : 'Create User'}
				icon={actionLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'}
				onClick={saveUser}
				disabled={!userForm.name || !userForm.email || !userForm.role || actionLoading}
				className="p-button-sm shadow-lg transition-all duration-200 hover:shadow-xl"
				style={{
					background: theme.cardGradient,
					border: 'none',
					transform: actionLoading ? 'scale(0.98)' : 'scale(1)',
				}}
			/>
		</div>
	);

	// Role change handler
	const onRoleChange = (e) => {
		setUserForm({
			...userForm,
			role: e.value,
			manager: e.value === 'Employee' ? userForm.manager : '',
			isManagerApprover: e.value === 'Manager' ? userForm.isManagerApprover : false,
		});
	};

	// Toolbar templates
	const leftToolbarTemplate = () => {
		const activeCount = users.filter((u) => u.status === 'Active').length;
		const managerCount = users.filter((u) => u.role === 'Manager').length;

		return (
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-3">
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
						style={{ background: theme.cardGradient }}
					>
						<i className="pi pi-users text-white text-xl"></i>
					</div>
					<div>
						<h2 className="text-2xl font-bold text-gray-800 m-0">User Management</h2>
						<p className="text-sm text-gray-500 m-0">
							{activeCount} active users, {managerCount} managers
						</p>
					</div>
				</div>
			</div>
		);
	};

	const rightToolbarTemplate = () => {
		return (
			<div className="flex items-center gap-3">
				{/* View Toggle */}
				<div className="flex border border-gray-300 rounded-lg p-1 bg-white">
					<Button
						icon="pi pi-table"
						className={`p-button-text p-button-sm ${
							viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
						}`}
						tooltip="Table View"
						onClick={() => setViewMode('table')}
					/>
					<Button
						icon="pi pi-th-large"
						className={`p-button-text p-button-sm ${
							viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
						}`}
						tooltip="Grid View"
						onClick={() => setViewMode('grid')}
					/>
				</div>

				{selectedUsers.length > 0 && (
					<Button
						label={`Deactivate (${selectedUsers.length})`}
						icon="pi pi-ban"
						className="p-button-danger p-button-sm shadow-lg"
						onClick={confirmBulkDelete}
						disabled={actionLoading}
					/>
				)}
				<Button
					label="Bulk Import"
					icon="pi pi-upload"
					onClick={() => setShowBulkImport(true)}
					className="p-button-outlined p-button-sm shadow-lg"
					style={{ color: theme.primary, borderColor: theme.primary }}
					disabled={actionLoading}
				/>
				<Button
					label="Add User"
					icon="pi pi-plus"
					onClick={() => openUserDialog()}
					className="p-button-sm shadow-lg transition-all duration-200 hover:shadow-xl"
					style={{ background: theme.cardGradient, border: 'none' }}
					disabled={actionLoading}
				/>
			</div>
		);
	};

	// Stats Cards Component
	const StatsCards = () => {
		const stats = [
			{
				label: 'Total Users',
				value: users.length,
				icon: 'pi-users',
				color: 'from-blue-500 to-blue-600',
			},
			{
				label: 'Active Users',
				value: users.filter((u) => u.status === 'Active').length,
				icon: 'pi-check-circle',
				color: 'from-green-500 to-green-600',
			},
			{
				label: 'Managers',
				value: users.filter((u) => u.role === 'Manager').length,
				icon: 'pi-user-plus',
				color: 'from-purple-500 to-purple-600',
			},
			{
				label: 'Departments',
				value: new Set(users.map((u) => u.department).filter(Boolean)).size,
				icon: 'pi-building',
				color: 'from-orange-500 to-orange-600',
			},
		];

		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{stats.map((stat, index) => (
					<div
						key={index}
						className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm opacity-90 mb-1 font-medium">{stat.label}</p>
								<h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
							</div>
							<div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
								<i className={`pi ${stat.icon} text-xl`}></i>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	};

	// Enhanced Filters Section
	const TableHeader = () => (
		<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
						<i className="pi pi-filter text-blue-600 text-lg"></i>
					</div>
					<div>
						<h4 className="text-lg font-semibold text-gray-800 m-0">
							Filters & Search
						</h4>
						<p className="text-sm text-gray-500 m-0">Refine your user list</p>
					</div>
				</div>
				<Button
					label="Clear All"
					icon="pi pi-filter-slash"
					onClick={() => {
						setSelectedRole(null);
						setSelectedStatus(null);
						setSelectedDept(null);
						setGlobalFilter('');
					}}
					className="p-button-text p-button-sm"
					style={{ color: theme.primary }}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
				{/* Global Search */}
				<div className="lg:col-span-2">
					<label className="text-sm font-medium text-gray-700 mb-2 block">
						<i className="pi pi-search mr-2 text-gray-400"></i>
						Global Search
					</label>
					<span className="p-input-icon-left w-full">
						<i className="pi pi-search text-gray-400" />
						<InputText
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							placeholder="Search users by name, email, department..."
							className="w-full rounded-lg"
						/>
					</span>
				</div>

				{/* Role Filter */}
				<div>
					<label className="text-sm font-medium text-gray-700 mb-2 block">
						<i className="pi pi-user mr-2 text-gray-400"></i>
						Role
					</label>
					<Dropdown
						value={selectedRole}
						options={roles}
						optionLabel="label"
						optionValue="value"
						placeholder="All Roles"
						onChange={(e) => setSelectedRole(e.value)}
						showClear
						className="w-full rounded-lg"
					/>
				</div>

				{/* Status Filter */}
				<div>
					<label className="text-sm font-medium text-gray-700 mb-2 block">
						<i className="pi pi-circle-on mr-2 text-gray-400"></i>
						Status
					</label>
					<Dropdown
						value={selectedStatus}
						options={statuses}
						optionLabel="label"
						optionValue="value"
						placeholder="All Status"
						onChange={(e) => setSelectedStatus(e.value)}
						showClear
						className="w-full rounded-lg"
					/>
				</div>

				{/* Department Filter */}
				<div>
					<label className="text-sm font-medium text-gray-700 mb-2 block">
						<i className="pi pi-building mr-2 text-gray-400"></i>
						Department
					</label>
					<Dropdown
						value={selectedDept}
						options={departments}
						optionLabel="label"
						optionValue="value"
						placeholder="All Departments"
						onChange={(e) => setSelectedDept(e.value)}
						showClear
						className="w-full rounded-lg"
					/>
				</div>
			</div>
		</div>
	);

	// User Detail Dialog
	const UserDetailDialog = () => {
		if (!selectedUser) return null;

		const avatarProps = getAvatarProps(selectedUser.name);

		return (
			<Dialog
				header={
					<div className="flex items-center gap-4 py-2">
						<div
							className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
							style={{ background: avatarProps.background }}
						>
							{avatarProps.label}
						</div>
						<div className="flex-1">
							<h3 className="text-xl font-bold text-gray-800 m-0">
								{selectedUser.name}
							</h3>
							<p className="text-gray-500 m-0">{selectedUser.jobTitle}</p>
							<div className="flex items-center gap-2 mt-1">
								{statusTemplate(selectedUser)}
								{roleTemplate(selectedUser)}
							</div>
						</div>
					</div>
				}
				visible={showUserDetail}
				onHide={() => setShowUserDetail(false)}
				style={{ width: '600px' }}
				className="rounded-2xl"
				footer={
					<div className="flex justify-end gap-2">
						<Button
							label="Close"
							icon="pi pi-times"
							onClick={() => setShowUserDetail(false)}
							className="p-button-text"
						/>
						<Button
							label="Edit User"
							icon="pi pi-pencil"
							onClick={() => {
								setShowUserDetail(false);
								openUserDialog(selectedUser);
							}}
							style={{ background: theme.primary, borderColor: theme.primary }}
						/>
					</div>
				}
			>
				<TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
					<TabPanel header="Overview">
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-gray-500">
										Email
									</label>
									<p className="text-gray-800">{selectedUser.email}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">
										Phone
									</label>
									<p className="text-gray-800">{selectedUser.phone || 'N/A'}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">
										Department
									</label>
									<p className="text-gray-800">
										{selectedUser.department || 'N/A'}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-500">
										Location
									</label>
									<p className="text-gray-800">
										{selectedUser.location || 'N/A'}
									</p>
								</div>
							</div>
							<Divider />
							<div>
								<label className="text-sm font-medium text-gray-500">Manager</label>
								<p className="text-gray-800">
									{selectedUser.managerName || 'Self'}
								</p>
							</div>
						</div>
					</TabPanel>
					<TabPanel header="Activity">
						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-3">
									<i className="pi pi-sign-in text-green-500"></i>
									<div>
										<p className="text-sm font-medium text-gray-800 m-0">
											Last Login
										</p>
										<p className="text-xs text-gray-500 m-0">
											{selectedUser.lastLogin
												? new Date(selectedUser.lastLogin).toLocaleString()
												: 'Never'}
										</p>
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
								<div className="flex items-center gap-3">
									<i className="pi pi-calendar text-blue-500"></i>
									<div>
										<p className="text-sm font-medium text-gray-800 m-0">
											Member Since
										</p>
										<p className="text-xs text-gray-500 m-0">
											{selectedUser.createdAt
												? new Date(
														selectedUser.createdAt
												  ).toLocaleDateString()
												: 'N/A'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>
				</TabView>
			</Dialog>
		);
	};

	// Load users on component mount
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Loading skeleton
	if (loading) {
		return (
			<PageLayout>
				<div className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} height="120px" className="rounded-2xl" />
						))}
					</div>
					<div className="bg-white rounded-2xl p-6">
						<Skeleton height="40px" className="mb-4" />
						<Skeleton height="300px" />
					</div>
				</div>
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<Toast ref={toastRef} />
			<ConfirmDialog />
			<UserDetailDialog />

			{/* Main Content */}
			<div className="bg-gray-50 p-6">
				{/* Toolbar Section */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
					<div className="p-6">
						<Toolbar
							left={leftToolbarTemplate}
							right={rightToolbarTemplate}
							className="border-0 p-0 bg-transparent"
						/>
					</div>
				</div>

				{/* Stats Cards */}
				<StatsCards />

				{/* Filters */}
				<TableHeader />

				{/* Data Table */}
				<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
					<DataTable
						value={filteredUsers}
						selection={selectedUsers}
						onSelectionChange={(e) => setSelectedUsers(e.value)}
						dataKey="id"
						responsiveLayout="scroll"
						stripedRows
						paginator
						rows={10}
						rowsPerPageOptions={[5, 10, 25, 50]}
						loading={tableLoading}
						emptyMessage={
							<div className="text-center py-16">
								<div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
									<i className="pi pi-inbox text-4xl text-gray-300"></i>
								</div>
								<h4 className="text-xl font-semibold text-gray-500 mb-2">
									No Users Found
								</h4>
								<p className="text-gray-400 mb-4">
									Try adjusting your search criteria or filters
								</p>
								<Button
									label="Add New User"
									icon="pi pi-plus"
									onClick={() => openUserDialog()}
									style={{ background: theme.cardGradient, border: 'none' }}
								/>
							</div>
						}
						className="rounded-lg"
						rowHover
						showGridlines={false}
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
						currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
					>
						<Column
							selectionMode="multiple"
							headerStyle={{ width: '3rem' }}
							className="border-r border-gray-200"
						/>
						<Column
							field="name"
							header="User"
							body={userBodyTemplate}
							sortable
							className="font-medium border-r border-gray-200"
							style={{ minWidth: '250px' }}
						/>
						<Column
							field="role"
							header="Role"
							body={roleTemplate}
							sortable
							className="border-r border-gray-200"
						/>
						<Column
							field="department"
							header="Department"
							body={departmentTemplate}
							sortable
							className="border-r border-gray-200"
						/>
						<Column
							header="Manager"
							body={managerTemplate}
							className="border-r border-gray-200"
						/>
						<Column
							header="Approver"
							body={isManagerApproverTemplate}
							className="text-center border-r border-gray-200"
						/>
						<Column
							field="lastLogin"
							header="Last Login"
							body={lastLoginTemplate}
							sortable
							className="border-r border-gray-200"
						/>
						<Column
							field="status"
							header="Status"
							body={statusTemplate}
							sortable
							className="border-r border-gray-200"
						/>
						<Column
							header="Actions"
							body={actionBodyTemplate}
							frozen
							alignFrozen="right"
							style={{ width: '200px' }}
							className="bg-white"
						/>
					</DataTable>
				</div>

				{/* Enhanced User Dialog */}
				<Dialog
					header={
						<div className="flex items-center gap-4 py-2">
							<div
								className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
								style={{ background: theme.cardGradient }}
							>
								<i
									className={`pi ${
										editingUser ? 'pi-pencil' : 'pi-user-plus'
									} text-lg`}
								></i>
							</div>
							<div>
								<h3 className="text-xl font-bold text-gray-800 m-0">
									{editingUser ? 'Edit User' : 'Create New User'}
								</h3>
								<p className="text-sm text-gray-500 m-0">
									{editingUser
										? 'Update user information'
										: 'Add a new team member'}
								</p>
							</div>
						</div>
					}
					visible={showUserDialog}
					onHide={() => !actionLoading && setShowUserDialog(false)}
					footer={userDialogFooter}
					style={{ width: '700px' }}
					className="rounded-2xl"
					closable={!actionLoading}
				>
					{actionLoading && (
						<div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
							<div className="text-center">
								<i className="pi pi-spin pi-spinner text-4xl text-blue-500 mb-2"></i>
								<p className="text-gray-600">
									{editingUser ? 'Updating user...' : 'Creating user...'}
								</p>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Personal Information */}
						<div className="md:col-span-2">
							<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<i className="pi pi-user text-blue-500"></i>
								Personal Information
							</h4>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Full Name <span className="text-red-500">*</span>
							</label>
							<InputText
								value={userForm.name}
								onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
								placeholder="Enter full name"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Email Address <span className="text-red-500">*</span>
							</label>
							<InputText
								type="email"
								value={userForm.email}
								onChange={(e) =>
									setUserForm({ ...userForm, email: e.target.value })
								}
								placeholder="user@company.com"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						{!editingUser && (
							<div className="flex flex-col">
								<label className="text-sm font-medium text-gray-700 mb-2">
									Password <span className="text-red-500">*</span>
								</label>
								<InputText
									type="password"
									value={userForm.password}
									onChange={(e) =>
										setUserForm({ ...userForm, password: e.target.value })
									}
									placeholder="Enter password"
									className="w-full rounded-lg"
									disabled={actionLoading}
								/>
							</div>
						)}

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<InputText
								value={userForm.phone}
								onChange={(e) =>
									setUserForm({ ...userForm, phone: e.target.value })
								}
								placeholder="+1 (555) 123-4567"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						{/* Professional Information */}
						<div className="md:col-span-2 mt-2">
							<h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<i className="pi pi-briefcase text-green-500"></i>
								Professional Information
							</h4>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Role <span className="text-red-500">*</span>
							</label>
							<Dropdown
								value={userForm.role}
								options={roles}
								optionLabel="label"
								optionValue="value"
								onChange={onRoleChange}
								placeholder="Select Role"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Job Title
							</label>
							<InputText
								value={userForm.jobTitle}
								onChange={(e) =>
									setUserForm({ ...userForm, jobTitle: e.target.value })
								}
								placeholder="e.g., Software Engineer"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Department
							</label>
							<Dropdown
								value={userForm.department}
								options={departments}
								optionLabel="label"
								optionValue="value"
								onChange={(e) => setUserForm({ ...userForm, department: e.value })}
								placeholder="Select Department"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						<div className="flex flex-col">
							<label className="text-sm font-medium text-gray-700 mb-2">
								Location
							</label>
							<InputText
								value={userForm.location}
								onChange={(e) =>
									setUserForm({ ...userForm, location: e.target.value })
								}
								placeholder="e.g., New York, NY"
								className="w-full rounded-lg"
								disabled={actionLoading}
							/>
						</div>

						{/* Manager Selection */}
						{userForm.role === 'Employee' && (
							<div className="md:col-span-2 flex flex-col">
								<label className="text-sm font-medium text-gray-700 mb-2">
									Reporting Manager
								</label>
								<Dropdown
									value={userForm.manager}
									options={managers}
									onChange={(e) => setUserForm({ ...userForm, manager: e.value })}
									placeholder="Select Manager"
									className="w-full rounded-lg"
									disabled={actionLoading}
								/>
							</div>
						)}
					</div>

					{/* Manager Approver Section */}
					{userForm.role === 'Manager' && (
						<div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
							<div className="flex items-center justify-between">
								<div className="flex items-start gap-3 flex-1">
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
										<i className="pi pi-verified text-blue-600 text-lg"></i>
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800 m-0 mb-1">
											Manager Approval Permissions
										</h4>
										<p className="text-sm text-gray-600 m-0">
											Enable this manager to review and approve expense
											reports from their team members. Approvers can also
											manage budget allocations and oversee departmental
											spending.
										</p>
									</div>
								</div>
								<InputSwitch
									checked={userForm.isManagerApprover}
									onChange={(e) =>
										setUserForm({
											...userForm,
											isManagerApprover: e.value,
										})
									}
									disabled={actionLoading}
								/>
							</div>
						</div>
					)}

					{!editingUser && (
						<div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
							<div className="flex items-center gap-2">
								<i className="pi pi-info-circle text-yellow-600 text-lg"></i>
								<div>
									<p className="text-sm text-yellow-800 m-0 font-medium">
										Welcome Email
									</p>
									<p className="text-xs text-yellow-700 m-0">
										A welcome email with login credentials and setup
										instructions will be sent to the user's email address.
									</p>
								</div>
							</div>
						</div>
					)}
				</Dialog>

				{/* Bulk Import Dialog */}
				<Dialog
					header={
						<div className="flex items-center gap-3 py-2">
							<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
								<i className="pi pi-upload text-white text-lg"></i>
							</div>
							<div>
								<h3 className="text-xl font-bold text-gray-800 m-0">
									Bulk Import Users
								</h3>
								<p className="text-sm text-gray-500 m-0">
									Upload a CSV file to import multiple users at once
								</p>
							</div>
						</div>
					}
					visible={showBulkImport}
					onHide={() => !actionLoading && setShowBulkImport(false)}
					style={{ width: '600px' }}
					className="rounded-2xl"
					footer={
						<div className="flex justify-end">
							<Button
								label="Close"
								icon="pi pi-times"
								onClick={() => setShowBulkImport(false)}
								className="p-button-text"
								disabled={actionLoading}
							/>
						</div>
					}
					closable={!actionLoading}
				>
					{actionLoading && (
						<div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
							<div className="text-center">
								<i className="pi pi-spin pi-spinner text-4xl text-purple-500 mb-2"></i>
								<p className="text-gray-600">Processing your file...</p>
							</div>
						</div>
					)}

					<div className="space-y-5">
						{/* CSV Template */}
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								CSV Template Format
							</label>
							<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-gray-700">
								name,email,role,department,managerId,isManagerApprover,jobTitle,phone,location
							</div>
						</div>

						{/* File Upload */}
						<div>
							<label className="text-sm font-medium text-gray-700 mb-2 block">
								Upload CSV File
							</label>
							<FileUpload
								chooseLabel="Select CSV File"
								uploadLabel={actionLoading ? 'Importing...' : 'Import Users'}
								cancelLabel="Cancel"
								accept=".csv"
								maxFileSize={1000000}
								onUpload={onCSVUpload}
								auto
								mode="advanced"
								className="w-full"
								disabled={actionLoading}
							/>
						</div>

						<Divider />

						{/* Info Message */}
						<Message
							severity="info"
							className="w-full border-0 bg-blue-50 text-blue-700"
							content={
								<div className="text-sm">
									<p className="font-semibold mb-2 flex items-center gap-2">
										<i className="pi pi-info-circle"></i>
										Important Notes:
									</p>
									<ul className="list-disc list-inside space-y-1 text-blue-600">
										<li>
											<strong>Required fields:</strong> name, email, role
										</li>
										<li>
											<strong>Optional fields:</strong> department, managerId,
											jobTitle, phone, location
										</li>
										<li>
											For managers, set isManagerApprover to "true" or "false"
										</li>
										<li>Maximum file size: 1MB</li>
										<li>Supported format: CSV with header row</li>
									</ul>
								</div>
							}
						/>
					</div>
				</Dialog>
			</div>
		</PageLayout>
	);
};

export default UserManagement;
