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
			console.log('Sending forgot-password payload:', payload); // Debug payload
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
				console.log('Forgot-password error response:', response); // Debug response
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: `${response?.message || 'Failed to send reset email.'}`,
				});
			}
		} catch (error) {
			console.error('Forgot-password fetch error:', error);
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
			console.log('Resending forgot-password payload:', payload); // Debug payload
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
				console.log('Resend forgot-password error response:', response); // Debug response
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: `${response?.message || 'Failed to resend email.'}`,
				});
			}
		} catch (error) {
			console.error('Resend forgot-password fetch error:', error);
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
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-white to-gray-100 px-4">
				<h1 className="text-4xl font-extrabold text-primary mb-16 tracking-wide drop-shadow-sm overflow-hidden whitespace-nowrap border-r-4 border-primary animate-typing">
					Expense<span className="text-gray-800">Track</span>
				</h1>

				<div className="relative w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/30 border border-white/40">
					<div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
						<Avatar
							image={logo}
							size="xlarge"
							shape="circle"
							className="size-24 shadow-lg border-4 border-white bg-primary/3 p-1.5"
						/>
					</div>

					<h2 className="text-3xl font-bold text-primary text-center my-10">
						Reset Password
					</h2>

					<div className="mb-4">
						<label htmlFor="email" className="block text-primary font-medium mb-1">
							Email
						</label>
						<InputText
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full p-3 rounded border border-gray-300 transition-all focus:ring-2 focus:ring-primary hover:border-primary"
						/>
					</div>

					<Button
						label={<div className="text-white font-semibold">Send Email</div>}
						onClick={handleSendEmail}
						loading={loading}
						className="w-full bg-primary hover:bg-[#2a547a] transition text-white font-semibold py-2.5 rounded shadow-sm transform hover:scale-105"
					/>

					{showResend && (
						<div className="mt-4 flex justify-end">
							<Button
								label={
									<div className="text-primary font-medium flex items-center gap-2">
										<i className="pi pi-refresh text-base" />
										Resend Email
									</div>
								}
								onClick={handleResendEmail}
								loading={loading}
								className="p-0 bg-transparent hover:bg-primary/10 transition rounded border-none focus:ring-2 focus:ring-primary transform hover:scale-105"
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
									<div className="text-primary font-medium flex items-center gap-2">
										<i className="pi pi-arrow-left text-base" />
										Back to Login
									</div>
								}
								className="text-primary hover:text-[#2a547a] bg-transparent border-none px-1 py-0 font-medium transform hover:scale-105 focus:ring-2 focus:ring-primary rounded"
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
