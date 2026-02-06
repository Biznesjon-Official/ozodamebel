#!/bin/bash

# Ozoda Mebel Production Deployment Script
set -e

echo "🚀 Starting Ozoda Mebel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ozoda-mebel"
DOCKER_IMAGE="ozoda-mebel:latest"
BACKUP_DIR="/var/backups/ozoda-mebel"
LOG_FILE="/var/log/ozoda-mebel-deploy.log"

# Functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a $LOG_FILE
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check if .env file exists
if [ ! -f .env ]; then
    error ".env file not found. Please create it from .env.example"
fi

# Check if required environment variables are set
source .env
required_vars=("MONGODB_URI" "JWT_SECRET" "TELEGRAM_BOT_TOKEN")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        error "Required environment variable $var is not set"
    fi
done

# Create backup directory
log "Creating backup directory..."
sudo mkdir -p $BACKUP_DIR
sudo chown $USER:$USER $BACKUP_DIR

# Backup database
log "Creating database backup..."
if command -v mongodump &> /dev/null; then
    mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
    log "Database backup created successfully"
else
    warning "mongodump not found. Skipping database backup"
fi

# Stop existing containers
log "Stopping existing containers..."
docker-compose down || true

# Pull latest changes (if using git)
if [ -d .git ]; then
    log "Pulling latest changes from git..."
    git pull origin main
fi

# Build and start containers
log "Building and starting containers..."
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
log "Waiting for services to start..."
sleep 30

# Health check
log "Performing health check..."
for i in {1..10}; do
    if curl -f http://localhost:3008/api/health > /dev/null 2>&1; then
        log "Health check passed!"
        break
    fi
    if [ $i -eq 10 ]; then
        error "Health check failed after 10 attempts"
    fi
    log "Health check attempt $i failed, retrying in 10 seconds..."
    sleep 10
done

# Show container status
log "Container status:"
docker-compose ps

# Show logs
log "Recent logs:"
docker-compose logs --tail=50

log "🎉 Deployment completed successfully!"
log "Application is running at: https://ozoda.biznesjon.uz"
log "Health check: http://localhost:3008/api/health"
log "Nginx proxy: http://localhost:3009"

# Cleanup old images
log "Cleaning up old Docker images..."
docker image prune -f

echo ""
echo "📋 Post-deployment checklist:"
echo "1. ✅ Verify application is accessible"
echo "2. ✅ Check health endpoint"
echo "3. ✅ Test login functionality"
echo "4. ✅ Verify Telegram bot is working"
echo "5. ✅ Check database connectivity"
echo "6. ✅ Monitor logs for errors"
echo ""
echo "🔧 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart: docker-compose restart"
echo "  Stop: docker-compose down"
echo "  Update: ./deploy.sh"