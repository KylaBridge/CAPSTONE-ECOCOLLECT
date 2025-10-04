/**
 * Content Security Policy and Security Headers Middleware
 * Protects against XSS, clickjacking, and other security vulnerabilities
 */

const helmet = require('helmet');

// Security headers middleware using Helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      scriptSrcElem: ["'self'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      styleSrcElem: ["'self'", "https://fonts.googleapis.com"],
      styleSrcAttr: ["'none'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://lh3.googleusercontent.com", "https://lh4.googleusercontent.com", "https://lh5.googleusercontent.com", "https://lh6.googleusercontent.com"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"],
      prefetchSrc: ["'self'"],
      navigateTo: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

// Additional explicit HSTS middleware (backup)
const additionalHSTS = (req, res, next) => {
  // Only set HSTS on HTTPS connections
  if (req.secure || req.get('x-forwarded-proto') === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
};

// Block access to hidden and sensitive files
const blockSensitiveFiles = (req, res, next) => {
  const path = req.path.toLowerCase();
  
  // List of sensitive file patterns to block
  const blockedPatterns = [
    /^\/\./,                    // Any file starting with . (hidden files)
    /\.env$/,                   // Environment files
    /\.git/,                    // Git repository files
    /\.svn/,                    // SVN files
    /\.hg/,                     // Mercurial repository files
    /\.bzr/,                    // Bazaar repository files
    /\/bitkeeper/i,             // BitKeeper repository files
    /\/BitKeeper/,              // BitKeeper repository files (case sensitive)
    /\/SCCS/,                   // SCCS version control files
    /\/CVS/,                    // CVS version control files
    /\.htaccess$/,              // Apache config files
    /\.htpasswd$/,              // Apache password files
    /web\.config$/,             // IIS config files
    /package\.json$/,           // Package configuration
    /package-lock\.json$/,      // Package lock files
    /yarn\.lock$/,              // Yarn lock files
    /composer\.json$/,          // PHP composer files
    /composer\.lock$/,          // PHP composer lock files
    /\.sql$/,                   // SQL dump files
    /\.log$/,                   // Log files
    /\.bak$/,                   // Backup files
    /\.backup$/,                // Backup files
    /\.old$/,                   // Old files
    /\.orig$/,                  // Original files
    /\.tmp$/,                   // Temporary files
    /\.temp$/,                  // Temporary files
    /~$/,                       // Backup files ending with ~
    /\.config$/,                // Configuration files
    /\.ini$/,                   // INI configuration files
    /\.conf$/,                  // Configuration files
    /\.key$/,                   // Key files
    /\.pem$/,                   // Certificate files
    /\.crt$/,                   // Certificate files
    /\.cer$/,                   // Certificate files
    /\.p12$/,                   // Certificate files
    /\.pfx$/,                   // Certificate files
  ];
  
  // Check if the requested path matches any blocked pattern
  for (const pattern of blockedPatterns) {
    if (pattern.test(path)) {
      console.warn(`Security: Blocked access to sensitive file: ${req.path} from IP: ${req.ip}`);
      return res.status(404).json({ 
        error: "File not found",
        code: "FILE_NOT_FOUND"
      });
    }
  }
  
  next();
};

module.exports = {
  securityHeaders,
  blockSensitiveFiles,
  additionalHSTS
};