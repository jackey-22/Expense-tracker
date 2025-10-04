import React, { useState, useRef, useEffect } from 'react';
import { fetchPost } from '../../utils/fetch.utils';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import logo from '../../assets/logo.png';

const Signup = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [country, setCountry] = useState(null);
	const [currency, setCurrency] = useState('');
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(false);
	const toast = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch('https://restcountries.com/v3.1/all?fields=name,currencies')
			.then((res) => res.json())
			.then((data) => {
				const options = data
					.filter((c) => Object.keys(c.currencies || {}).length > 0) // Exclude countries without currencies
					.map((c) => ({
						label: c.name.common,
						value: c.name.common,
						currency: Object.keys(c.currencies)[0],
					}))
					.sort((a, b) => a.label.localeCompare(b.label));
				setCountries(options);
			})
			.catch(() => {
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: 'Failed to load countries',
				});
			});
	}, []);

	const onCountryChange = (e) => {
		const selectedValue = e.value;
		setCountry(selectedValue);
		const selected = countries.find((c) => c.value === selectedValue);
		setCurrency(selected ? selected.currency : '');
	};

	const handleSignup = async () => {
		setLoading(true);
		if (!name || !email || !password || !confirmPassword || !country || !currency) {
			console.log('Missing fields:', {
				name,
				email,
				password,
				confirmPassword,
				country,
				currency,
			});
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'All fields are required, including a valid currency',
			});
			setLoading(false);
			return;
		}
		if (password !== confirmPassword) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Passwords do not match',
			});
			setLoading(false);
			return;
		}
		try {
			const payload = { name, email, password, confirmPassword, country, currency };
			console.log('Sending payload to /auth/signup:', payload); // Debug payload
			const response = await fetchPost({
				pathName: 'auth/signup',
				body: JSON.stringify(payload),
			});

			if (response?.success) {
				toast.current.show({
					severity: 'success',
					summary: 'Success',
					detail: 'Signup successful! Redirecting to login...',
				});
				setTimeout(() => navigate('/login'), 1500);
			} else {
				console.log('Backend error response:', response); // Debug backend response
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: `${response?.message || 'Signup failed'}`,
				});
			}
		} catch (error) {
			console.error('Signup fetch error:', error);
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Something went wrong!',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLoginRedirect = () => {
		navigate('/login');
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

					<h2 className="text-3xl font-bold text-primary text-center my-10">Signup</h2>
					<div className="mb-4">
						<label htmlFor="name" className="block text-primary font-medium mb-1">
							Name
						</label>
						<InputText
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							className="w-full p-3 rounded border border-gray-300 transition-all focus:ring-2 focus:ring-primary hover:border-primary"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="email" className="block text-primary font-medium mb-1">
							Email
						</label>
						<InputText
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full p-3 rounded border border-gray-300 transition-all focus:ring-2 focus:ring-primary hover:border-primary"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block text-primary font-medium mb-1">
							Password
						</label>
						<InputText
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="w-full p-3 rounded border border-gray-300 transition-all focus:ring-2 focus:ring-primary hover:border-primary"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-primary font-medium mb-1"
						>
							Confirm Password
						</label>
						<InputText
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							className="w-full p-3 rounded border border-gray-300 transition-all focus:ring-2 focus:ring-primary hover:border-primary"
						/>
					</div>
					<div className="mb-4">
						<label htmlFor="country" className="block text-primary font-medium mb-1">
							Country
						</label>
						<Dropdown
							id="country"
							value={country}
							onChange={onCountryChange}
							options={countries}
							optionLabel="label"
							placeholder="Select a Country"
							className="w-full md:w-14rem"
						/>
					</div>
					<Button
						label={<div className="text-white font-semibold">Signup</div>}
						onClick={handleSignup}
						loading={loading}
						className="w-full bg-primary hover:bg-[#2a547a] transition text-white font-semibold py-2.5 rounded shadow-sm transform hover:scale-105"
					/>
					<div className="mt-4 text-center">
						<span className="text-sm text-gray-600">
							Already have an account?{' '}
							<button
								onClick={handleLoginRedirect}
								type="button"
								className="text-primary font-medium hover:underline"
							>
								Login
							</button>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Signup;
