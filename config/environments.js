/**
 * Environment-specific configuration for KodeKit Next.js application
 */

const environments = {
  development: {
    APP_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:3000/api',
    ENABLE_PWA: false,
    ENABLE_ANALYTICS: false,
    LOG_LEVEL: 'debug',
    CACHE_TTL: 0,
    IMAGE_OPTIMIZATION: false,
  },
  
  staging: {
    APP_URL: 'https://staging.kodekit.in',
    API_URL: 'https://staging.kodekit.in/api',
    ENABLE_PWA: true,
    ENABLE_ANALYTICS: false,
    LOG_LEVEL: 'info',
    CACHE_TTL: 300, // 5 minutes
    IMAGE_OPTIMIZATION: true,
  },
  
  production: {
    APP_URL: 'https://kodekit.in',
    API_URL: 'https://kodekit.in/api',
    ENABLE_PWA: true,
    ENABLE_ANALYTICS: true,
    LOG_LEVEL: 'error',
    CACHE_TTL: 3600, // 1 hour
    IMAGE_OPTIMIZATION: true,
  },
};

const currentEnv = process.env.NODE_ENV || 'development';
const config = environments[currentEnv] || environments.development;

// Override with environment variables if they exist
Object.keys(config).forEach(key => {
  const envKey = `NEXT_PUBLIC_${key}`;
  if (process.env[envKey]) {
    config[key] = process.env[envKey];
  }
});

module.exports = {
  ...config,
  environment: currentEnv,
  isDevelopment: currentEnv === 'development',
  isStaging: currentEnv === 'staging',
  isProduction: currentEnv === 'production',
};