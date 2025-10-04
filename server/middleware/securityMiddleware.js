/**
 * Security middleware to protect against various attacks including Remote File Inclusion (RFI)
 */

// Validate URL parameters to prevent RFI attacks
const validateUrlParameters = (req, res, next) => {
  const queryParams = req.query;
  
  // Skip validation for OAuth callback routes
  if (req.path.includes('/auth/google/callback') || req.path.includes('/auth/google')) {
    // For OAuth routes, only check for extremely suspicious patterns
    for (const [key, value] of Object.entries(queryParams)) {
      if (typeof value === 'string') {
        const extremelySuspiciousPatterns = [
          /javascript:/i,            // JavaScript protocol
          /vbscript:/i,              // VBScript protocol
          /data:text\/html/i,        // HTML data URLs
          /\.\.\/\.\.\/\.\.\//,      // Deep directory traversal
        ];
        
        for (const pattern of extremelySuspiciousPatterns) {
          if (pattern.test(value)) {
            console.warn(`Security: Extremely suspicious parameter detected in OAuth route - ${key}: ${value}`);
            return res.status(400).json({ 
              error: "Invalid parameter format detected",
              code: "SECURITY_VIOLATION"
            });
          }
        }
      }
    }
    return next();
  }
  
  // Check for suspicious URL patterns that could indicate RFI attempts
  for (const [key, value] of Object.entries(queryParams)) {
    if (typeof value === 'string') {
      // Block external URLs and suspicious patterns
      const suspiciousPatterns = [
        /^https?:\/\/(?!localhost|127\.0\.0\.1|.*\.ecocollect\.online)/i, // External URLs except localhost and our domain
        /^ftp:\/\//i,              // FTP URLs
        /^file:\/\//i,             // File URLs
        /\.\.\/|\.\.%2F/i,         // Directory traversal
        /\/\//,                    // Double slashes
        /%2e%2e/i,                 // URL encoded dots
        /javascript:/i,            // JavaScript protocol
        /data:/i,                  // Data URLs
        /vbscript:/i,              // VBScript protocol
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
          console.warn(`Security: Suspicious parameter detected - ${key}: ${value}`);
          return res.status(400).json({ 
            error: "Invalid parameter format detected",
            code: "SECURITY_VIOLATION"
          });
        }
      }
    }
  }
  
  next();
};

// Sanitize file paths to prevent path traversal
const sanitizeFilePaths = (req, res, next) => {
  // Check URL parameters
  for (const [key, value] of Object.entries(req.params || {})) {
    if (typeof value === 'string' && (value.includes('../') || value.includes('..\\') || value.includes('%2e%2e'))) {
      console.warn(`Security: Path traversal attempt detected in params - ${key}: ${value}`);
      return res.status(400).json({ 
        error: "Invalid path format",
        code: "PATH_TRAVERSAL_BLOCKED"
      });
    }
  }
  
  // Check query parameters
  for (const [key, value] of Object.entries(req.query || {})) {
    if (typeof value === 'string' && (value.includes('../') || value.includes('..\\') || value.includes('%2e%2e'))) {
      console.warn(`Security: Path traversal attempt detected in query - ${key}: ${value}`);
      return res.status(400).json({ 
        error: "Invalid path format",
        code: "PATH_TRAVERSAL_BLOCKED"
      });
    }
  }
  
  next();
};

// Rate limiting for authentication endpoints
const authRateLimit = {};
const AUTH_RATE_LIMIT = 5; // Max 5 attempts per minute
const AUTH_WINDOW = 60 * 1000; // 1 minute window

const rateLimitAuth = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!authRateLimit[ip]) {
    authRateLimit[ip] = { count: 1, firstAttempt: now };
  } else {
    if (now - authRateLimit[ip].firstAttempt > AUTH_WINDOW) {
      // Reset window
      authRateLimit[ip] = { count: 1, firstAttempt: now };
    } else {
      authRateLimit[ip].count++;
      if (authRateLimit[ip].count > AUTH_RATE_LIMIT) {
        console.warn(`Security: Rate limit exceeded for IP: ${ip}`);
        return res.status(429).json({ 
          error: "Too many authentication attempts",
          code: "RATE_LIMIT_EXCEEDED"
        });
      }
    }
  }
  
  next();
};

// Clean up old rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const ip in authRateLimit) {
    if (now - authRateLimit[ip].firstAttempt > AUTH_WINDOW) {
      delete authRateLimit[ip];
    }
  }
}, AUTH_WINDOW);

module.exports = {
  validateUrlParameters,
  sanitizeFilePaths,
  rateLimitAuth
};