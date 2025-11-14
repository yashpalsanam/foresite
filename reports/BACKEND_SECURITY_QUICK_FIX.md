# BACKEND SECURITY - QUICK FIX GUIDE

## CRITICAL - DO IMMEDIATELY

### 1. Secure Exposed Credentials
Location: `/foresite/back-end/.env`

**Action:**
```bash
# Remove .env from git history
git filter-repo --invert-paths --path .env
git filter-repo --invert-paths --path .env.local
git filter-repo --invert-paths --path .env.production

# Or using git-filter-branch (slower but more compatible)
git filter-branch --tree-filter 'rm -f .env .env.local .env.production' HEAD

# Force push to remote (only if you own the repo)
git push origin --force-all
```

**Then:**
- Revoke MongoDB Atlas credentials immediately
- Revoke Firebase keys
- Regenerate Cloudinary API keys
- Regenerate Google Maps API key
- Create new JWT secrets

---

### 2. Fix Command Injection in Backup Script
Location: `/foresite/back-end/scripts/dbBackup.js` (Line 70)

**Current (Vulnerable):**
```javascript
const backupPath = process.argv[3];
if (!backupPath) {
  logger.error('Backup path is required for restore');
  process.exit(1);
}
restoreBackup(backupPath)  // VULNERABLE!
```

**Fix:**
```javascript
import path from 'path';

const ALLOWED_BACKUP_DIR = path.join(__dirname, '..', 'backups');

const validateBackupPath = (userPath) => {
  const fullPath = path.resolve(userPath);
  const allowed = path.resolve(ALLOWED_BACKUP_DIR);
  
  if (!fullPath.startsWith(allowed)) {
    throw new Error('Backup path must be within backups directory');
  }
  
  // Check for path traversal attempts
  if (fullPath.includes('..') || fullPath.includes('~')) {
    throw new Error('Invalid characters in path');
  }
  
  return fullPath;
};

const backupPath = process.argv[3];
if (!backupPath) {
  logger.error('Backup path is required for restore');
  process.exit(1);
}

try {
  const validatedPath = validateBackupPath(backupPath);
  restoreBackup(validatedPath);
} catch (error) {
  logger.error('Invalid backup path:', error.message);
  process.exit(1);
}
```

---

### 3. Add Input Validation for Search
Location: `/foresite/back-end/controllers/propertyController.js` (Line 34)

**Current (Vulnerable):**
```javascript
if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    // ...more vulnerable regex
  ];
}
```

**Fix:**
```javascript
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const validateSearch = (search) => {
  if (!search) return null;
  if (search.length > 100) {
    throw new Error('Search term too long (max 100 characters)');
  }
  return escapeRegex(search.trim());
};

// In controller
const searchTerm = validateSearch(req.query.search);
if (searchTerm) {
  query.$or = [
    { title: { $regex: searchTerm, $options: 'i' } },
    { description: { $regex: searchTerm, $options: 'i' } },
    { 'address.city': { $regex: searchTerm, $options: 'i' } },
  ];
}
```

---

## HIGH PRIORITY - THIS WEEK

### 4. Add Request Body Validation
Location: Create `/foresite/back-end/middlewares/validateRequest.js`

```javascript
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    
    req.body = value;
    next();
  };
};
```

**Create schemas file:** `/foresite/back-end/validators/authSchemas.js`

```javascript
import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string()
    .required()
    .trim()
    .max(100)
    .messages({ 'string.empty': 'Name is required' }),
  email: Joi.string()
    .email()
    .required()
    .lowercase()
    .messages({ 'string.email': 'Valid email required' }),
  password: Joi.string()
    .min(12)
    .required()
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .messages({
      'string.min': 'Password must be at least 12 characters',
      'string.pattern.base': 'Password must contain uppercase, lowercase, and numbers',
    }),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({ 'string.pattern.base': 'Invalid phone number' }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fcmToken: Joi.string().optional(),
});
```

**Apply in routes:** `/foresite/back-end/routes/authRoutes.js`

```javascript
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from '../validators/authSchemas.js';

router.post('/register', authRateLimiter, validateRequest(registerSchema), register);
router.post('/login', authRateLimiter, validateRequest(loginSchema), login);
```

---

### 5. Fix Role Assignment Vulnerability
Location: `/foresite/back-end/controllers/authController.js` (Line 25)

**Current (Vulnerable):**
```javascript
const user = await User.create({
  name,
  email,
  password,
  phone,
  role: role || 'user',  // USER CAN SET ROLE!
});
```

**Fix:**
```javascript
const user = await User.create({
  name,
  email,
  password,
  phone,
  role: 'user',  // HARDCODED - Always user
});
```

Also update validator schema:
```javascript
export const registerSchema = Joi.object({
  // ... other fields
  // REMOVE role from schema - don't accept it
});
```

---

### 6. Add Rate Limiting to Missing Endpoints
Location: `/foresite/back-end/routes/authRoutes.js`

**Current:**
```javascript
router.post('/refresh-token', refreshToken);  // NO LIMIT!
```

**Fix:**
```javascript
import { authRateLimiter, strictRateLimiter } from '../middlewares/rateLimit.js';

router.post('/refresh-token', strictRateLimiter, refreshToken);
```

**Also fix inquiries:**
Location: `/foresite/back-end/routes/inquiryRoutes.js`

```javascript
import { strictRateLimiter } from '../middlewares/rateLimit.js';

router.post('/public', strictRateLimiter, createPublicInquiry);
```

---

### 7. Enforce Strong Password Policy
Location: `/foresite/back-end/models/User.js`

**Current:**
```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [6, 'Password must be at least 6 characters'],
  select: false,
}
```

**Fix:**
```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [12, 'Password must be at least 12 characters'],
  validate: {
    validator: function(v) {
      return /[A-Z]/.test(v) && /[a-z]/.test(v) && /[0-9]/.test(v);
    },
    message: 'Password must contain uppercase, lowercase, and numbers',
  },
  select: false,
}
```

---

## MEDIUM PRIORITY - THIS MONTH

### 8. Fix CORS Configuration
Location: `/foresite/back-end/config/cors.js`

**Current (Too Permissive):**
```javascript
if (process.env.NODE_ENV === 'development') {
  const isLocalhost = origin.startsWith('http://localhost') || 
                     origin.startsWith('http://127.0.0.1');
  const isReplit = origin.includes('.replit.dev');
  if (isLocalhost || isReplit) {
    return callback(null, true);
  }
}
```

**Fix:**
```javascript
const allowedLocalPorts = [3000, 3001, 5173, 4173];
const allowedLocalOrigins = allowedLocalPorts.map(port => 
  [`http://localhost:${port}`, `http://127.0.0.1:${port}`]
).flat();

if (process.env.NODE_ENV === 'development') {
  const isAllowedLocal = allowedLocalOrigins.includes(origin);
  if (isAllowedLocal) {
    return callback(null, true);
  }
}
```

---

### 9. Remove Auto-Populate for Performance
Location: `/foresite/back-end/models/Inquiry.js`

**Current (N+1 Query Problem):**
```javascript
inquirySchema.pre(/^find/, function (next) {
  this.populate({...}).populate({...}).populate({...});
  next();
});
```

**Fix:**
```javascript
// REMOVE the pre-hook entirely, populate manually in controllers

// In /foresite/back-end/controllers/inquiryController.js
export const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('property', 'title propertyType price address images')
    .populate('user', 'name email phone avatar')
    .populate('assignedTo', 'name email role');
  // ...
});

// For list queries, only populate if needed
export const getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
    // No populate unless specifically requested
  // ...
});
```

---

### 10. Add Audit Logging for Security Events
Location: Create `/foresite/back-end/middlewares/auditLogger.js`

```javascript
import fs from 'fs';
import path from 'path';
import { logger } from '../config/logger.js';

const auditLogPath = path.join(process.cwd(), 'logs', 'audit.log');

export const auditLog = (action, user, details) => {
  const record = {
    timestamp: new Date().toISOString(),
    action,
    userId: user?._id || null,
    userEmail: user?.email || 'anonymous',
    details,
    ip: details.ip || null,
  };
  
  logger.info(`[AUDIT] ${action}`, record);
  
  // Also write to audit log file
  fs.appendFileSync(
    auditLogPath,
    JSON.stringify(record) + '\n',
    'utf8'
  );
};
```

**Use in controllers:**
```javascript
import { auditLog } from '../middlewares/auditLogger.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    auditLog('LOGIN_FAILED', null, {
      email,
      ip: req.ip,
    });
    return res.status(401).json({...});
  }
  
  auditLog('LOGIN_SUCCESS', user, {
    ip: req.ip,
  });
  
  // ... rest of login
});
```

---

## VERIFICATION CHECKLIST

- [ ] All credentials removed from git history
- [ ] New credentials generated and in secure vault
- [ ] Input validation added to all endpoints
- [ ] Role assignment fixed (hardcoded as 'user')
- [ ] Rate limiting on all auth endpoints
- [ ] Password policy enforced (12+ chars, complexity)
- [ ] CORS configuration restricted
- [ ] N+1 query problem fixed
- [ ] Audit logging implemented
- [ ] Security headers verified
- [ ] npm audit passing
- [ ] All tests passing

---

## TESTING THE FIXES

```bash
# Test input validation
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"weak"}'  # Should fail

# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done  # 6th request should return 429

# Test role validation
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","password":"ValidPass123","role":"admin"}'  # Should ignore role

# Verify CORS
curl -H "Origin: http://localhost:9000" \
  -v http://localhost:3001/api/v1/health  # Should be blocked
```

---

