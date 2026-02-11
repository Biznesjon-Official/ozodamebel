# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to security@ozodamebel.uz. All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the issue until it has been addressed by the team.

## Security Measures

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt (12 rounds)
- Token expiration (30 days default)
- Secure password requirements

### API Security
- Rate limiting on all endpoints
- Stricter rate limiting on authentication endpoints
- CORS configuration with allowed origins
- Helmet.js for security headers
- Input validation with express-validator
- SQL injection prevention (Mongoose ODM)
- XSS protection

### Data Protection
- Environment variables for sensitive data
- .gitignore for secrets
- Encrypted database connections
- Secure file upload handling
- File type validation
- File size limits

### Infrastructure Security
- HTTPS/TLS encryption
- Nginx reverse proxy
- Docker container isolation
- Non-root user in containers
- Regular security updates
- Audit logging for all operations

### Best Practices
- Regular dependency updates
- Security scanning
- Code review process
- Minimal privilege principle
- Secure defaults
- Error handling without information leakage

## Security Checklist for Deployment

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules
- [ ] Enable MongoDB authentication
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Regular backups
- [ ] Keep dependencies updated
- [ ] Review and restrict CORS origins
- [ ] Secure file upload directory
- [ ] Enable audit logging
- [ ] Configure proper error handling
- [ ] Set up intrusion detection
- [ ] Regular security audits

## Responsible Disclosure

We appreciate the security research community's efforts in helping us maintain the security of our project. If you believe you have found a security vulnerability, please report it to us as described above.

We will acknowledge your email within 48 hours and will send a more detailed response within 96 hours indicating the next steps in handling your report.

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Users are encouraged to update to the latest version immediately.

Subscribe to our GitHub releases to be notified of security updates.
