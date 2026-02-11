// PM2 Configuration for Production
module.exports = {
  apps: [{
    name: 'ozoda-mebel-backend',
    script: './server.js',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3008
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    kill_timeout: 5000,
    listen_timeout: 10000,
    shutdown_with_message: true,
    
    // Graceful shutdown
    wait_ready: true,
    
    // Environment-specific settings
    env_production: {
      NODE_ENV: 'production',
      PORT: 3008
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3008
    }
  }]
};
