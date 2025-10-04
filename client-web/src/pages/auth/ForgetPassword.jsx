import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { fetchPost } from '../../utils/fetch.utils';
import { Avatar } from 'primereact/avatar';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(false);
	const [showResend, setShowResend] = useState(false);
	const toast = useRef(null);

	useEffect(() => {
		let timer;
		if (loading) {
			timer = setTimeout(() => {
				setShowResend(true);
			}, 60000); // Show resend option after 60 seconds
		}
		return () => clearTimeout(timer);
	}, [loading]);

	const handleSendEmail = async () => {
		setLoading(true);
		setShowResend(false);
		if (!email) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Please enter your email to reset password.',
			});
			setLoading(false);
			return;
		}
		try {
			const payload = { email };
			const response = await fetchPost({
				pathName: 'auth/forgot-password',
				body: JSON.stringify(payload),
			});

			if (response?.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Success',
					detail: 'Password reset email sent to your registered email address!',
					life: 5000,
				});
			} else {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: response?.message || 'Failed to send reset email.',
				});
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to send reset email. Please try again.',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleResendEmail = async () => {
		setLoading(true);
		try {
			const payload = { email };
			const response = await fetchPost({
				pathName: 'auth/forgot-password',
				body: JSON.stringify(payload),
			});

			if (response?.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Success',
					detail: 'Password reset email resent successfully!',
					life: 5000,
				});
			} else {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: response?.message || 'Failed to resend email.',
				});
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to resend email. Please try again.',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Toast ref={toast} />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
				<h1 className="text-4xl font-extrabold text-blue-700 mb-16 tracking-wide drop-shadow-sm overflow-hidden whitespace-nowrap border-r-4 border-blue-600 animate-typing">
					Expense<span className="text-blue-500">Track</span>
				</h1>

				<div className="relative w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40">
					<div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
						<Avatar
							image={logo}
							size="xlarge"
							shape="circle"
							className="w-24 h-24 shadow-lg border-4 border-white bg-gradient-to-r from-blue-500 to-blue-700 p-1.5"
						/>
					</div>

					<h2 className="text-3xl font-bold text-blue-800 text-center my-10">
						Reset Password
					</h2>

					<div className="mb-4">
						<label htmlFor="email" className="block text-blue-800 font-medium mb-1">
							Email
						</label>
						<InputText
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full p-3 rounded border border-blue-300 transition-all focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
						/>
					</div>

					<Button
						label={<div className="text-white font-semibold">Send Email</div>}
						onClick={handleSendEmail}
						loading={loading}
						className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 rounded shadow-md transform hover:scale-105 transition-all"
					/>

					{showResend && (
						<div className="mt-4 flex justify-end">
							<Button
								label={
									<div className="text-blue-500 font-medium flex items-center gap-2">
										<i className="pi pi-refresh text-base" />
										Resend Email
									</div>
								}
								onClick={handleResendEmail}
								loading={loading}
								className="p-0 bg-transparent hover:bg-blue-100 transition rounded border-none focus:ring-2 focus:ring-blue-400 transform hover:scale-105"
								disabled={!email || loading}
								tooltip="Resend password reset email"
								tooltipOptions={{ position: 'top' }}
								text
							/>
						</div>
					)}

					<div className="mt-4 flex justify-end">
						<Link to="/login">
							<Button
								label={
									<div className="text-blue-500 font-medium flex items-center gap-2">
										<i className="pi pi-arrow-left text-base" />
										Back to Login
									</div>
								}
								className="text-blue-500 hover:text-blue-700 bg-transparent border-none px-1 py-0 font-medium transform hover:scale-105 focus:ring-2 focus:ring-blue-400 rounded"
								text
							/>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default ForgotPassword;
