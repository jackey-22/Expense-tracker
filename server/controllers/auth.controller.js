const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const companyModel = require('../models/company.model');
// const md5 = require('md5');
// const userModel = require('../models/user.model');
// const studentModel = require('../models/student.model');
// const facultyModel = require('../models/faculty.model');
const { sendResetPasswordEmail } = require('../utils/mailer');

async function login(req, res){
	try {
		const { username, password } = req.body;

		// Log received payload for debugging
		console.log('Received payload at /auth/login:', req.body);

		// Validate required fields
		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: 'Email and password are required',
			});
		}

		// Find user by email (mapping username to email)
		const user = await userModel
			.findOne({ email: username, isActive: true })
			.populate('company')
			.catch((err) => {
				console.error('User find error:', err);
				throw new Error('Error querying user');
			});

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password).catch((err) => {
			console.error('Password comparison error:', err);
			throw new Error('Error verifying password');
		});

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid email or password',
			});
		}

		// Prepare response data (exclude password)
		const userData = {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			company: user.company
				? {
						_id: user.company._id,
						country: user.company.country,
						defaultCurrency: user.company.defaultCurrency,
				  }
				: null,
		};

		return res.status(200).json({
			success: true,
			data: userData,
			message: 'Login successful',
		});
	} catch (error) {
		console.error('Login error:', error.message, error.stack);
		return res.status(500).json({
			success: false,
			message: `Something went wrong: ${error.message}`,
		});
	}
};
async function logout(req, res) {
	await userModel.updateOne({ _id: req.body._id }, { currentToken: null });
	res.clearCookie('auth');
	return res.json({ success: true });
}
async function forgotPassword (req, res){
	try {
		const { email } = req.body;

		// Log received payload for debugging
		console.log('Received payload at /auth/forgot-password:', req.body);

		// Validate required field
		if (!email) {
			return res.status(400).json({
				success: false,
				message: 'Email is required',
			});
		}

		// Validate email format
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid email format',
			});
		}

		// Find user by email
		const user = await User.findOne({ email, isActive: true }).catch((err) => {
			console.error('User find error:', err);
			throw new Error('Error querying user');
		});

		// Always return success to prevent email enumeration
		if (!user) {
			console.log(
				`No user found for email ${email}, but returning generic success for security`
			);
			return res.status(200).json({
				success: true,
				message: 'If the email is registered, a password reset link has been sent.',
			});
		}

		// Generate temporary password
		const newPassword = crypto.randomBytes(8).toString('hex'); // 16-character random password
		const hashedPassword = await bcrypt.hash(newPassword, 10).catch((err) => {
			console.error('Password hashing error:', err);
			throw new Error('Error processing password');
		});

		// Update user password
		await User.updateOne({ _id: user._id }, { password: hashedPassword }).catch((err) => {
			console.error('User update error:', err);
			throw new Error('Failed to update user password');
		});

		// Send reset email
		await sendResetPasswordEmail(email, user.name, email, newPassword).catch((err) => {
			console.error('Email sending error:', err);
			throw new Error('Failed to send reset email');
		});

		return res.status(200).json({
			success: true,
			message: 'If the email is registered, a password reset link has been sent.',
		});
	} catch (error) {
		console.error('Forgot-password error:', error.message, error.stack);
		return res.status(500).json({
			success: false,
			message: `Something went wrong: ${error.message}`,
		});
	}
};

async function verify(req, res) {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(401).json({ error: 'Authorization token missing' });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await userModel.findById(decoded._id);
		if (!user || user.currentToken !== token) {
			return res.status(401).json({ error: 'Invalid or expired token' });
		}

		res.json({
			success: true,
			data: {
				username: user.username,
				role: user.role,
				_id: user._id,
			},
		});
	} catch (err) {
		console.error('JWT verification error:', err);
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}

function generateTempPassword() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	let password = '';
	for (let i = 0; i < 12; i++) {
		password += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return password;
}

async function changePassword(req, res) {
	const { userId, currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ message: 'All fields are required' });
	}

	const user = await userModel.findById(userId);

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	// Verify current password
	if (user.password !== md5(currentPassword)) {
		return res.status(400).json({ message: 'Current password is incorrect' });
	}

	// Prevent same password
	if (md5(newPassword) === user.password) {
		return res.status(400).json({ message: 'New password must be different from current' });
	}

	// Save new password
	user.password = md5(newPassword);
	await user.save();

	return res.status(200).json({ success: true, message: 'Password updated successfully' });
}
async function signup (req, res){
	try {
		const { name, email, password, confirmPassword, country, currency } = req.body;

		// Log received payload for debugging
		console.log('Received payload at /auth/signup:', req.body);

		// Validate required fields
		if (!name || !email || !password || !confirmPassword || !country || !currency) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required, including a valid currency',
			});
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: 'Passwords do not match',
			});
		}

		// Validate email format
		const emailRegex = /^\S+@\S+\.\S+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid email format',
			});
		}

		// Check if email already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'Email already exists',
			});
		}

		// Hash password
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 10);
		} catch (bcryptError) {
			console.error('Password hashing error:', bcryptError);
			return res.status(500).json({
				success: false,
				message: 'Error processing password',
			});
		}

		// Create company
		const company = new companyModel({
			country,
			defaultCurrency: currency,
			admin: null, // Will be updated after user creation
			isActive: true,
		});

		// Create user
		const user = new userModel({
			name,
			email,
			password: hashedPassword,
			role: 'Admin', // Signup user is an admin
			company: null, // Will be updated after company creation
			isActive: true,
		});

		// Save company and update references
		const savedCompany = await company.save().catch((err) => {
			console.error('Company save error:', err);
			throw new Error('Failed to save company');
		});
		user.company = savedCompany._id;
		company.admin = user._id;

		// Save user and update company
		await user.save().catch((err) => {
			console.error('User save error:', err);
			throw new Error('Failed to save user');
		});
		await savedCompany.save().catch((err) => {
			console.error('Company update error:', err);
			throw new Error('Failed to update company');
		});

		// Prepare response data (exclude password)
		const userData = {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			company: {
				_id: savedCompany._id,
				country: savedCompany.country,
				defaultCurrency: savedCompany.defaultCurrency,
			},
		};

		return res.status(201).json({
			success: true,
			data: userData,
			message: 'Signup successful',
		});
	} catch (error) {
		console.error('Signup error:', error.message, error.stack);
		return res.status(500).json({
			success: false,
			message: `Something went wrong: ${error.message}`,
		});
	}
};

module.exports = {
	login,
	logout,
	forgotPassword,
	verify,
	changePassword,
	signup,
};
