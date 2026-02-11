# Contributing to Ozoda Mebel CRM

Thank you for your interest in contributing to Ozoda Mebel CRM! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear and descriptive title
- Detailed description of the proposed feature
- Use cases and benefits
- Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass
- Keep PRs focused on a single feature/fix

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Biznesjon-Official/ozodamebel.git
cd ozodamebel

# Install dependencies
npm install
cd client && npm install && cd ..

# Create .env file
cp .env.example .env
# Fill in the environment variables

# Start development server
npm run dev
```

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Follow ESLint configuration
- Use async/await for asynchronous code
- Write descriptive variable and function names
- Add comments for complex logic

### React
- Use functional components with hooks
- Follow React best practices
- Use PropTypes or TypeScript for type checking
- Keep components small and focused
- Use meaningful component names

### Database
- Use Mongoose schemas with validation
- Add indexes for frequently queried fields
- Write efficient queries
- Handle errors properly

### API Design
- Follow RESTful conventions
- Use appropriate HTTP methods
- Return consistent response formats
- Include proper error messages
- Document endpoints

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for functions
- Update API documentation
- Include examples for new features

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add payment reminder notification system

- Implement cron job for daily reminders
- Add Telegram bot integration
- Update notification model
```

## Review Process

1. All PRs require at least one review
2. Address review comments
3. Ensure CI/CD checks pass
4. Maintainers will merge approved PRs

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
