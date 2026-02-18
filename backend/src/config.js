/**
 * Configuration file for the MERN Backend
 * Centralized environment and configuration management
 */

const config = {
  // Server
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGO_URI: process.env.MONGO_URI || '',
  USE_MONGO: !!process.env.MONGO_URI,
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
  JWT_EXPIRE: '7d',
  
  // File uploads
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  
  // API
  API_PREFIX: '/api'
};

/**
 * Validate required environment variables
 */
function validateConfig() {
  if (config.NODE_ENV === 'production') {
    if (!config.MONGO_URI) {
      throw new Error('MONGO_URI is required in production');
    }
    if (config.JWT_SECRET === 'dev-secret-key-change-in-production') {
      throw new Error('JWT_SECRET must be changed from default in production');
    }
  }
}

validateConfig();

module.exports = config;
