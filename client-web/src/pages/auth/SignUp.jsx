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
					.filter((c) => Object.keys(c.currencies || {}).length > 0)
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
				toast.current.show({
					severity: 'error',
					summary: 'Error',
					detail: response?.message || 'Signup failed',
				});
			}
		} catch (error) {
			toast.current.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Something went wrong!',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLoginRedirect = () => navigate('/login');

	return (
		<>
			<Toast ref={toast} />
			<div
				className="min-h-screen flex flex-col items-center justify-center 
				bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4"
			>
				<h1
					className="text-4xl font-extrabold text-blue-700 mb-16 tracking-wide drop-shadow-sm 
					overflow-hidden whitespace-nowrap border-r-4 border-blue-600 animate-typing"
				>
					Expense<span className="text-blue-500">Track</span>
				</h1>

				<div
					className="relative w-full max-w-md p-8 rounded-xl shadow-lg backdrop-blur-md 
					bg-white/30 border border-white/40"
				>
					<div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
						<Avatar
							image={logo}
							size="xlarge"
							shape="circle"
							className="w-24 h-24 shadow-lg border-4 border-white 
								bg-gradient-to-r from-blue-500 to-blue-700 p-1.5"
						/>
					</div>

					<h2 className="text-3xl font-bold text-blue-800 text-center my-10">Signup</h2>

					<div className="mb-4">
						<label htmlFor="name" className="block text-blue-800 font-medium mb-1">
							Name
						</label>
						<InputText
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							className="w-full p-3 rounded border border-blue-300 transition-all 
								focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="email" className="block text-blue-800 font-medium mb-1">
							Email
						</label>
						<InputText
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							className="w-full p-3 rounded border border-blue-300 transition-all 
								focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="password" className="block text-blue-800 font-medium mb-1">
							Password
						</label>
						<InputText
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							className="w-full p-3 rounded border border-blue-300 transition-all 
								focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-blue-800 font-medium mb-1"
						>
							Confirm Password
						</label>
						<InputText
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm your password"
							className="w-full p-3 rounded border border-blue-300 transition-all 
								focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
						/>
					</div>

					<div className="mb-4">
						<label htmlFor="country" className="block text-blue-800 font-medium mb-1">
							Country
						</label>
						<Dropdown
							id="country"
							value={country}
							onChange={onCountryChange}
							options={countries}
							optionLabel="label"
							placeholder="Select a Country"
							className="w-full md:w-14rem border border-blue-300 rounded focus:ring-2 focus:ring-blue-400"
						/>
					</div>

					<Button
						label="Signup"
						onClick={handleSignup}
						loading={loading}
						className="w-full bg-gradient-to-r from-blue-500 to-blue-700 
							hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2.5 
							rounded shadow-md transform hover:scale-105 transition-all"
					/>

					<div className="mt-4 text-center">
						<span className="text-sm text-blue-700">
							Already have an account?{' '}
							<button
								onClick={handleLoginRedirect}
								type="button"
								className="text-blue-500 font-medium hover:underline"
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
