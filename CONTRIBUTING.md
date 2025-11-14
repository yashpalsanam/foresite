# Contributing to Foresite

Thank you for your interest in contributing to Foresite! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain professional communication

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/foresite.git
   cd foresite
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-org/foresite.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Set up environment variables** (see [README.md](README.md))

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring
- `test/*` - Adding or updating tests
- `chore/*` - Maintenance tasks

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter @foresite/admin-panel test
pnpm --filter @foresite/front-end test
pnpm --filter @foresite/back-end test

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines) below.

### 5. Keep Your Branch Updated

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

- Go to GitHub and create a PR from your fork
- Fill out the PR template completely
- Link any related issues

## Coding Standards

### JavaScript/React

- Use **ES6+ syntax**
- Use **functional components** with hooks in React
- Use **async/await** over promises when possible
- Avoid nested callbacks
- Keep functions small and focused
- Use descriptive variable and function names

### File Organization

```javascript
// 1. Imports (external libraries first, then internal)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

// 2. Constants
const API_ENDPOINT = '/api/v1/properties';

// 3. Component/Function
const PropertyList = () => {
  // State
  const [properties, setProperties] = useState([]);

  // Effects
  useEffect(() => {
    fetchProperties();
  }, []);

  // Handlers
  const fetchProperties = async () => {
    // ...
  };

  // Render
  return (
    // JSX
  );
};

// 4. Exports
export default PropertyList;
```

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow mobile-first responsive design
- Use consistent spacing (use Tailwind's spacing scale)
- Avoid inline styles unless absolutely necessary

### Comments

- Write self-documenting code
- Use comments for complex logic or non-obvious decisions
- Keep comments up-to-date with code changes

```javascript
// Good: Explains WHY, not WHAT
// Using debounce to prevent excessive API calls during typing
const debouncedSearch = debounce(handleSearch, 300);

// Bad: States the obvious
// Set loading to true
setLoading(true);
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Scope

The scope should be the name of the app affected:
- `admin-panel`
- `front-end`
- `back-end`
- `root` (for monorepo-level changes)

### Examples

```bash
feat(admin-panel): add property filtering by location

fix(back-end): resolve authentication token expiration issue

docs(root): update installation instructions in README

refactor(front-end): simplify property card component

test(back-end): add unit tests for user controller
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up-to-date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## Testing
How to test the changes

## Screenshots (if applicable)

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
```

### Review Process

1. **Automated checks** must pass (tests, linting)
2. **Code review** by at least one maintainer
3. **Address feedback** and update PR
4. **Approval** from maintainer
5. **Merge** by maintainer

## Project Structure

### Apps

```
apps/
├── admin-panel/      # Admin dashboard
├── front-end/        # Public website
└── back-end/         # API server
```

### Shared Packages (Future)

```
packages/
├── shared-types/     # Shared TypeScript types
├── shared-utils/     # Common utilities
└── ui-components/    # Shared React components
```

## Testing Guidelines

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Aim for high code coverage

```javascript
// Example: Component test
import { render, screen } from '@testing-library/react';
import PropertyCard from './PropertyCard';

test('renders property title', () => {
  const property = { title: 'Beautiful Home', price: 500000 };
  render(<PropertyCard property={property} />);
  expect(screen.getByText('Beautiful Home')).toBeInTheDocument();
});
```

### Integration Tests

- Test API endpoints with real database (test database)
- Test user flows
- Use factories for test data

```javascript
// Example: API test
import request from 'supertest';
import app from '../server';

describe('POST /api/v1/properties', () => {
  it('creates a new property', async () => {
    const response = await request(app)
      .post('/api/v1/properties')
      .send({ title: 'New Property', price: 300000 })
      .expect(201);

    expect(response.body.data.title).toBe('New Property');
  });
});
```

## Questions?

If you have questions, feel free to:
- Open an issue with the `question` label
- Reach out to the maintainers
- Check existing documentation

Thank you for contributing! 🎉
