import { config } from '../config/env.js';

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

class Logger {
  constructor() {
    this.isDevelopment = config.isDevelopment;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  log(level, color, message, meta) {
    const formattedMessage = this.formatMessage(level, message, meta);
    if (this.isDevelopment) {
      console.log(`${color}${formattedMessage}${colors.reset}`);
    } else {
      console.log(formattedMessage);
    }
  }

  info(message, meta = {}) {
    this.log('info', colors.blue, message, meta);
  }

  success(message, meta = {}) {
    this.log('success', colors.green, message, meta);
  }

  warn(message, meta = {}) {
    this.log('warn', colors.yellow, message, meta);
  }

  error(message, error) {
    const meta = error ? {
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
    } : {};
    this.log('error', colors.red, message, meta);
  }

  debug(message, meta = {}) {
    if (this.isDevelopment) {
      this.log('debug', colors.gray, message, meta);
    }
  }

  http(method, path, statusCode, duration, body) {
    let logLine = `${method} ${path} ${statusCode} in ${duration}ms`;
    
    if (body && this.isDevelopment) {
      const bodyStr = JSON.stringify(body);
      if (bodyStr.length > 100) {
        logLine += ` :: ${bodyStr.slice(0, 100)}...`;
      } else {
        logLine += ` :: ${bodyStr}`;
      }
    }
    
    const color = statusCode >= 500 ? colors.red 
      : statusCode >= 400 ? colors.yellow 
      : colors.green;
    
    this.log('http', color, logLine);
  }
}

export default new Logger();
