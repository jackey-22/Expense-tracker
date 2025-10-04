# Contributing to Expense Tracker

First off, thank you for considering contributing to Expense Tracker! It's people like you that make
this project better for everyone.

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

-   Be respectful and inclusive
-   Welcome newcomers and help them learn
-   Focus on what is best for the community
-   Show empathy towards other community members

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find that you don't need to
create one. When you create a bug report, include as many details as possible:

-   **Use a clear and descriptive title**
-   **Describe the exact steps to reproduce the problem**
-   **Provide specific examples**
-   **Describe the behavior you observed and what you expected**
-   **Include screenshots if possible**
-   **Include your environment details** (OS, Node version, browser, etc.)

#### Bug Report Template

```markdown
**Description** A clear description of what the bug is.

**To Reproduce** Steps to reproduce:

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior** What you expected to happen.

**Screenshots** If applicable, add screenshots.

**Environment:**

-   OS: [e.g. Windows 11]
-   Node: [e.g. 18.0.0]
-   Browser: [e.g. Chrome 120]
-   Version: [e.g. 1.0.0]
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion,
include:

-   **Use a clear and descriptive title**
-   **Provide a detailed description of the enhancement**
-   **Explain why this enhancement would be useful**
-   **List some examples of how it would be used**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **If you've added code that should be tested**, add tests
3. **If you've changed APIs**, update the documentation
4. **Ensure the test suite passes**
5. **Make sure your code lints**
6. **Issue that pull request!**

## 📋 Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/Expense-tracker.git
cd Expense-tracker

# Add upstream remote
git remote add upstream https://github.com/jackey-22/Expense-tracker.git

# Install dependencies
cd server && npm install
cd ../client-web && npm install
```

### Create a Branch

```bash
# Create a branch for your feature/fix
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description
```

### Making Changes

1. **Write clean, readable code**
2. **Follow the existing code style**
3. **Comment complex logic**
4. **Keep commits atomic** (one logical change per commit)
5. **Write meaningful commit messages**

#### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

-   `feat`: New feature
-   `fix`: Bug fix
-   `docs`: Documentation changes
-   `style`: Code style changes (formatting, etc.)
-   `refactor`: Code refactoring
-   `test`: Adding or updating tests
-   `chore`: Maintenance tasks

**Examples:**

```
feat(expense): add multi-currency support

- Integrated exchange rate API
- Added currency conversion utility
- Updated expense model

Closes #123
```

```
fix(approval): resolve percentage calculation bug

The percentage was being calculated incorrectly when
approvers were skipped. Now handles edge cases properly.

Fixes #456
```

### Testing Your Changes

#### Backend Testing

```bash
cd server

# Run linting
npm run lint

# Start server and test manually
npm run dev

# Test API endpoints with Postman or curl
curl http://localhost:5000/api/test
```

#### Frontend Testing

```bash
cd client-web

# Run linting
npm run lint

# Start dev server
npm run dev

# Build to ensure no build errors
npm run build
```

### Submitting Pull Request

1. **Update your fork**

```bash
git fetch upstream
git rebase upstream/main
```

2. **Push your changes**

```bash
git push origin feature/amazing-feature
```

3. **Create Pull Request**
    - Go to your fork on GitHub
    - Click "New Pull Request"
    - Select your feature branch
    - Fill in the PR template
    - Link related issues

#### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

-   [ ] Bug fix
-   [ ] New feature
-   [ ] Breaking change
-   [ ] Documentation update

## Testing

-   [ ] Tested locally
-   [ ] Added/updated tests
-   [ ] All tests pass

## Checklist

-   [ ] Code follows project style guidelines
-   [ ] Self-reviewed code
-   [ ] Commented complex code
-   [ ] Updated documentation
-   [ ] No new warnings
-   [ ] Added tests that prove fix/feature works

## Screenshots (if applicable)

## Related Issues

Closes #(issue number)
```

## 💻 Code Style Guidelines

### JavaScript/React

-   Use **ES6+** syntax
-   Use **arrow functions** for callbacks
-   Use **async/await** over promises
-   Use **destructuring** where appropriate
-   Use **template literals** for strings
-   **2 spaces** for indentation
-   **Single quotes** for strings
-   **Semicolons** at end of statements

#### Good Example

```javascript
// ✅ Good
const fetchExpenses = async (userId) => {
	try {
		const response = await axios.get(`/api/expenses/${userId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching expenses:', error);
		throw error;
	}
};
```

#### Bad Example

```javascript
// ❌ Bad
function fetchExpenses(userId) {
	return axios
		.get('/api/expenses/' + userId)
		.then(function (response) {
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
}
```

### React Components

-   Use **functional components** with hooks
-   Use **PascalCase** for component names
-   Use **camelCase** for props and variables
-   Keep components **small and focused**
-   Extract reusable logic into **custom hooks**

```javascript
// ✅ Good
import React, { useState, useEffect } from 'react';

const ExpenseList = ({ userId, onSelect }) => {
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchExpenses();
	}, [userId]);

	const fetchExpenses = async () => {
		// Implementation
	};

	return <div className="expense-list">{/* Component JSX */}</div>;
};

export default ExpenseList;
```

### CSS/TailwindCSS

-   Use **TailwindCSS** utility classes
-   Use **kebab-case** for custom CSS classes
-   Keep custom CSS minimal
-   Use **responsive** utilities (sm:, md:, lg:)

```jsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
	<h2 className="text-2xl font-bold text-gray-800">Title</h2>
	<p className="text-gray-600">Description</p>
</div>
```

### API Routes

-   Use **RESTful** conventions
-   Use **plural** nouns for collections
-   Use **HTTP** status codes correctly
-   Return **consistent** JSON responses

```javascript
// ✅ Good API structure
{
  "success": true,
  "message": "Expense created successfully",
  "data": {
    "expense": { /* expense object */ }
  }
}

// For errors
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "amount", "message": "Amount is required" }
  ]
}
```

## 📚 Documentation

-   Update **README.md** if you change functionality
-   Add **JSDoc comments** for functions
-   Update **API documentation** for endpoint changes
-   Add **inline comments** for complex logic

```javascript
/**
 * Calculate approval percentage based on current approvals
 * @param {Array} approvers - List of approvers
 * @param {Number} approvedCount - Number of approvals
 * @returns {Number} Percentage of approvals (0-100)
 */
const calculateApprovalPercentage = (approvers, approvedCount) => {
	if (!approvers.length) return 0;
	return (approvedCount / approvers.length) * 100;
};
```

## 🧪 Testing Guidelines

### What to Test

-   **Critical user flows** (login, submit expense, approve expense)
-   **Edge cases** (empty states, error states)
-   **Validation logic**
-   **API endpoints**
-   **Utility functions**

### Testing Best Practices

-   Write **clear test descriptions**
-   Test **one thing per test**
-   Use **meaningful assertions**
-   Mock **external dependencies**
-   Keep tests **fast and independent**

## 🎯 Areas for Contribution

### High Priority

-   [ ] Email notification system
-   [ ] OCR receipt scanning integration
-   [ ] Mobile responsive improvements
-   [ ] Performance optimizations
-   [ ] Test coverage

### Medium Priority

-   [ ] Advanced reporting
-   [ ] Export functionality (PDF, Excel)
-   [ ] Multi-language support
-   [ ] Dark mode
-   [ ] Accessibility improvements

### Nice to Have

-   [ ] Mobile app (React Native)
-   [ ] Desktop app (Electron)
-   [ ] Browser extensions
-   [ ] Slack/Teams integration
-   [ ] AI-powered features

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to reach out:

-   Create an issue with the `question` label
-   Email: support@expensetracker.com
-   Join our community chat

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

Happy Coding! 🚀
