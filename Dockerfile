# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy client package files first
COPY client/package*.json ./client/

# Install dependencies (without postinstall script)
RUN npm ci --only=production --ignore-scripts

# Install client dependencies and build
WORKDIR /app/client
RUN npm ci --only=production
RUN npm run build

# Go back to app directory
WORKDIR /app

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/documents uploads/contracts uploads/profiles

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of uploads directory
RUN chown -R nextjs:nodejs uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3008

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3008/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]