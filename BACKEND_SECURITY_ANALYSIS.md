# FORESITE BACKEND SECURITY & CODE QUALITY ANALYSIS

**Analysis Date:** 2025-11-14
**Codebase:** /foresite/back-end
**Runtime:** Node.js, Express.js, MongoDB, Redis

---

## CRITICAL SECURITY ISSUES

### 1. EXPOSED SECRETS IN VERSION CONTROL (CRITICAL)

**File:** `/foresite/back-end/.env`

**Issue:** Multiple sensitive credentials are exposed in the repository:
- MongoDB Atlas connection string with credentials: `mongodb+srv://deepu1403:deepu140385@foresite0.hwiukl2.mongodb.net/`
- Firebase Private Key (complete RSA key): Full encrypted private key exposed
- Cloudinary API Keys and Secrets: `465333518758486`, `e060PRgbR17f1CJiiDadPHUMKIc`
- Google Maps API Key: `AIzaSyCFUH71l-JHjpMpvaYQxUGAHdZ9r-t5VmM`
- JWT Secrets: `a937bea08caa37883d61be533dfd74de07c2d4c4d8e214fbe00256260127f37e`

**Impact:** Complete account compromise for all integrated services

**Recommendation:** 
- Immediately revoke all credentials
- Regenerate all keys/secrets
- Move to environment variables or secure secret management (AWS Secrets Manager, HashiCorp Vault)
- Use `.gitignore` (already configured but .env is tracked)
- Verify `.git` history and remove all secrets

**Evidence:**
```
/foresite/back-end/.env (lines 16-56)
MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, FIREBASE_PRIVATE_KEY, 
CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, GOOGLE_MAPS_API_KEY
```

---

### 2. DATABASE BACKUP SCRIPT WITH UNVALIDATED INPUT (HIGH)

**File:** `/foresite/back-end/scripts/dbBackup.js`

**Issue:** Shell command injection vulnerability in backup/restore operations
- Line 25: `mongodump --uri="${MONGO_URI}" --db=${DB_NAME} --out="${backupPath}"`
- Line 46: `mongorestore --uri="${MONGO_URI}" --db=${DB_NAME} "${backupPath}/${DB_NAME}"`
- No validation of `backupPath` parameter from command line arguments (line 70)

**Impact:** Arbitrary command execution if backupPath is attacker-controlled

**Vulnerable Code:**
```javascript
// Line 70 - no validation
const backupPath = process.argv[3];
if (!backupPath) {
  logger.error('Backup path is required for restore');
  process.exit(1);
}
restoreBackup(backupPath)  // Passed directly to shell
```

**Recommendation:**
- Validate backupPath: whitelist allowed characters, ensure it's within expected directory
- Use `child_process.execFile()` instead of `exec()` with array arguments
- Escape shell-sensitive characters

---

### 3. MISSING INPUT VALIDATION ON SEARCH PARAMETERS (HIGH)

**Files:**
- `/foresite/back-end/controllers/propertyController.js` (lines 34-42)
- `/foresite/back-end/controllers/userController.js` (lines 12-16)

**Issue:** NoSQL Injection vulnerable regex patterns
```javascript
// Property Controller Line 34-40
if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } },
    { 'address.city': { $regex: search, $options: 'i' } },
    { 'address.state': { $regex: search, $options: 'i' } },
    { keywords: { $in: [new RegExp(search, 'i')] } },
    { amenities: { $in: [new RegExp(search, 'i')] } },
  ];
}
```

**Risk:** User input directly creates RegExp objects without sanitization. Special regex characters like `.*` could be exploited.

**Recommendation:**
- Use `escapeStringRegexp()` library or manually escape: `search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
- Validate search length (max 100 chars)
- Consider using MongoDB text search instead of regex

---

### 4. INSECURE JWT HANDLING (MEDIUM)

**Files:**
- `/foresite/back-end/config/jwtConfig.js` (lines 4-7)
- `/foresite/back-end/server.js` (lines 62-71)

**Issues:**
1. Fallback secrets used if env vars missing:
   ```javascript
   export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
   export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
   ```
   
2. Session secret fallback (Line 63):
   ```javascript
   secret: process.env.SESSION_SECRET || 'fallback-secret'
   ```

3. No JWT algorithm validation - could accept weak algorithms

**Recommendation:**
- Remove fallback secrets - fail fast if env vars missing
- Explicitly specify algorithm in jwt.verify/sign: `algorithm: 'HS256'`
- Implement JWT expiration checking stricter than `7d` for access tokens

---

### 5. OVERLY PERMISSIVE CORS IN DEVELOPMENT (MEDIUM)

**File:** `/foresite/back-end/config/cors.js` (lines 43-51)

**Issue:**
```javascript
if (process.env.NODE_ENV === 'development') {
  const isLocalhost = origin.startsWith('http://localhost') || 
                     origin.startsWith('http://127.0.0.1');
  const isReplit = origin.includes('.replit.dev');
  if (isLocalhost || isReplit) {
    return callback(null, true);  // ALLOW ALL LOCALHOST PORTS
  }
}
```

**Risk:** Allows all localhost ports (3000-9999) and any Replit domain in development

**Recommendation:**
- Whitelist specific ports: `3000, 3001, 5173`
- Remove Replit wildcard unless necessary
- Use strict CORS even in development

---

### 6. PASSWORD VALIDATION TOO WEAK (MEDIUM)

**File:** `/foresite/back-end/models/User.js` (lines 20-25)

**Issue:**
```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [6, 'Password must be at least 6 characters'],  // TOO WEAK
  select: false,
}
```

**Recommendation:**
- Minimum 12 characters for passwords
- Enforce complexity: uppercase, lowercase, numbers, special chars
- Use regex validation in model or controller
- Implement password strength meter on frontend

---

### 7. DATE PARAMETER INJECTION RISK (MEDIUM)

**File:** `/foresite/back-end/controllers/adminController.js` (lines 85-89)

**Issue:**
```javascript
const { startDate, endDate } = req.query;
const dateFilter = {};
if (startDate) dateFilter.$gte = new Date(startDate);  // No validation
if (endDate) dateFilter.$lte = new Date(endDate);
```

**Risk:** `new Date()` with invalid input creates Invalid Date, but no validation of format

**Recommendation:**
```javascript
const validateDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error('Invalid date');
  if (date > new Date()) throw new Error('Future date not allowed');
  return date;
};
```

---

## HIGH PRIORITY CODE QUALITY ISSUES

### 1. NO REQUEST BODY VALIDATION (HIGH)

**All Controllers** - Missing schema validation using Joi/Yup

**Examples:**
- `/foresite/back-end/controllers/authController.js` (line 9): `register()` accepts `req.body` directly
- `/foresite/back-end/controllers/inquiryController.js` (line 56): `createInquiry()` no input validation
- `/foresite/back-end/controllers/propertyController.js` (line 86): `createProperty()` accepts raw `req.body`

**Current Issue:**
```javascript
// authController.js - No validation
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  // Directly creates user without validating
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user',  // ROLE CAN BE SET BY USER!
  });
```

**Recommendation:**
- Implement Joi schemas for all endpoints:
  ```javascript
  const registerSchema = Joi.object({
    name: Joi.string().required().max(100),
    email: Joi.string().email().required(),
    password: Joi.string().min(12).required()
      .pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/[0-9]/),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    role: Joi.string().valid('user').default('user'),
  });
  ```
- Create validation middleware: `validateRequest(schema)`
- Apply to all routes

---

### 2. ROLE-BASED ACCESS CONTROL VULNERABILITY (MEDIUM)

**File:** `/foresite/back-end/controllers/authController.js` (line 25)

**Issue:**
```javascript
const user = await User.create({
  name,
  email,
  password,
  phone,
  role: role || 'user',  // User can set their own role!
});
```

Users can register with `admin` or `agent` role. Registration endpoint has no role validation.

**Recommendation:**
- Remove role from registration: `role: 'user'` (hardcoded)
- Only admins should assign roles via separate endpoint
- Validate role in schema

---

### 3. MISSING ERROR HANDLING IN ASYNC OPERATIONS (MEDIUM)

**File:** `/foresite/back-end/controllers/inquiryController.js` (lines 75-83)

**Issue:**
```javascript
try {
  await sendEmail({
    to: email,
    subject: 'Inquiry Confirmation',
    html: `<p>Thank you for your inquiry. We will get back to you soon.</p>`,
  });
} catch (error) {
  logger.error('Failed to send inquiry confirmation email:', error);
  // ERROR SILENTLY IGNORED - response still 201
}
```

Email failures don't prevent response or notify user.

**Recommendation:**
- Define critical vs non-critical failures
- Critical: Return 500 error
- Non-critical: Log and return 201 with warning
- Implement retry logic with exponential backoff

---

### 4. NO RATE LIMITING ON CRITICAL ENDPOINTS (MEDIUM)

**File:** `/foresite/back-end/routes/authRoutes.js`

**Protected Routes:**
- Line 18: `router.post('/register', authRateLimiter, register);` (5 per 15min)
- Line 19: `router.post('/login', authRateLimiter, login);` (5 per 15min)
- Line 23: `router.post('/forgot-password', authRateLimiter, forgotPassword);` (5 per 15min)

**Issue:** Line 21 - No rate limiter on refresh token:
```javascript
router.post('/refresh-token', refreshToken);  // NO RATE LIMIT!
```

**Recommendation:**
```javascript
router.post('/refresh-token', strictRateLimiter, refreshToken);
```

---

### 5. MISSING OUTPUT ENCODING/SANITIZATION (MEDIUM)

**File:** `/foresite/back-end/controllers/inquiryController.js` (lines 239-246)

**Issue:**
```javascript
html: `
  <h2>Thank You for Your Inquiry</h2>
  <p>Dear ${name},</p>  // NOT ESCAPED!
  <p>Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.</p>
  <p><strong>Your Message:</strong></p>
  <p>${message}</p>  // NOT ESCAPED!
  <p>Best regards,<br>Foresite Real Estate Team</p>
`,
```

If `name` or `message` contains HTML/script, it could be injected into email.

**Recommendation:**
- Use `escapeHtml()` library or manually escape
- Use template engine (Handlebars, EJS)

---

## MEDIUM PRIORITY ISSUES

### 1. NO PAGINATION VALIDATION (MEDIUM)

**Files:**
- `/foresite/back-end/controllers/propertyController.js` (lines 8-20)
- `/foresite/back-end/controllers/inquiryController.js` (lines 8)

**Issue:**
```javascript
const { page = 1, limit = 12, ... } = req.query;
// No validation - user could request limit: 1000000
const properties = await Property.find(query)
  .limit(limit * 1)  // Arbitrary limit!
  .skip((page - 1) * limit);
```

**Recommendation:**
```javascript
const page = Math.max(1, parseInt(req.query.page) || 1);
const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
```

---

### 2. ADMIN BULK DELETE WITHOUT VERIFICATION (MEDIUM)

**File:** `/foresite/back-end/controllers/adminController.js` (lines 193-231)

**Issue:**
```javascript
export const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  // No confirmation, no audit log, no soft delete option
  const result = await User.deleteMany({ _id: { $in: userIds } });
  logger.info(`Bulk delete: ${result.deletedCount} users deleted`);
  res.status(200).json({ ... });
});
```

**Recommendation:**
- Implement soft delete (mark as deleted)
- Require admin confirmation via 2FA
- Create audit trail
- Implement approval workflow

---

### 3. INSUFFICIENT LOGGING OF SECURITY EVENTS (MEDIUM)

**Issue:** No logging for:
- Failed login attempts
- Role changes
- Admin actions
- Failed authentication
- Privilege escalation attempts

**Recommendation:**
- Log all security-relevant events to separate audit log
- Include: user ID, action, timestamp, IP, result
- Implement log rotation and retention policy

---

### 4. MISSING RATE LIMIT ON PUBLIC ENDPOINTS (MEDIUM)

**File:** `/foresite/back-end/routes/inquiryRoutes.js` (line 18)

**Issue:**
```javascript
router.post('/public', createPublicInquiry);  // NO RATE LIMIT!
```

Users can spam unlimited inquiries.

**Recommendation:**
```javascript
router.post('/public', strictRateLimiter, createPublicInquiry);
```

---

### 5. UNVALIDATED REDIRECT IN RESET PASSWORD (MEDIUM)

**File:** `/foresite/back-end/controllers/authController.js` (line 181)

**Issue:**
```javascript
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
// FRONTEND_URL from .env, could be attacker-controlled
```

If FRONTEND_URL is compromised, users get redirect to phishing site.

**Recommendation:**
- Validate FRONTEND_URL against whitelist
- Use relative URLs

---

## PERFORMANCE ISSUES

### 1. N+1 QUERY PROBLEM (MEDIUM)

**File:** `/foresite/back-end/models/Inquiry.js` (lines 90-102)

**Current:** 
```javascript
inquirySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'property',
    select: 'title propertyType price address images',
  }).populate({
    path: 'user',
    select: 'name email phone avatar',
  }).populate({
    path: 'assignedTo',
    select: 'name email role',
  });
  next();
});
```

**Issue:** Auto-populates on ALL find queries, even when not needed. Causes:
- Slow queries when not needed
- Memory overhead
- 3 additional database lookups per inquiry

**Recommendation:**
- Remove auto-populate from pre-hooks
- Explicitly populate only when needed in controller
- Implement select() in controllers

---

### 2. UNOPTIMIZED AGGREGATION QUERIES (MEDIUM)

**File:** `/foresite/back-end/controllers/adminController.js` (lines 38-55)

**Issue:**
```javascript
const userGrowth = await User.aggregate([
  { $match: { createdAt: { $gte: twelveMonthsAgo } } },
  { $group: { _id: { year, month }, count: { $sum: 1 } } },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
  { $limit: 12 },  // LIMIT AT END - inefficient
]);
```

**Recommendation:**
```javascript
const userGrowth = await User.aggregate([
  { $match: { createdAt: { $gte: twelveMonthsAgo } } },
  { $group: { _id: { year, month }, count: { $sum: 1 } } },
  { $sort: { '_id.year': 1, '_id.month': 1 } },
]).limit(12);  // Or limit before sort
```

---

### 3. MISSING DATABASE INDEXES (MEDIUM)

**File:** `/foresite/back-end/models/Property.js`

**Issue:** Missing indexes on commonly searched fields:
- `status` (line 24)
- `listingType` (line 27)
- `propertyType` (line 18)
- `price` (line 32)
- Compound indexes on frequent filter combinations

**Recommendation:**
```javascript
propertySchema.index({ status: 1, listingType: 1, price: 1 });
propertySchema.index({ price: 1, status: 1 });
```

---

### 4. CACHE INVALIDATION ISSUES (MEDIUM)

**File:** `/foresite/back-end/middlewares/cache.js` (lines 46-61)

**Issue:**
```javascript
export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const key = pattern || `cache:${req.baseUrl}*`;
          await cacheDel(key);  // Pattern matching might not work
```

**Risk:** Wildcard pattern invalidation may not work correctly with redis

**Recommendation:**
- Maintain cache key registry
- Use explicit key invalidation
- Implement versioning for cache keys

---

## BEST PRACTICES GAPS

### 1. MISSING API DOCUMENTATION (LOW-MEDIUM)

**Status:** API routes defined but no:
- OpenAPI/Swagger documentation
- Request/response schemas
- Error response codes documented
- Field descriptions

**Recommendation:**
- Implement Swagger/OpenAPI with `swagger-jsdoc`
- Document all endpoints with JSDoc comments

---

### 2. INSUFFICIENT TEST COVERAGE (MEDIUM)

**Test Files Found:**
- `/foresite/back-end/tests/auth.test.js`
- `/foresite/back-end/tests/user.test.js`
- `/foresite/back-end/tests/property.test.js`
- `/foresite/back-end/tests/inquiry.test.js`

**Issues:**
- No tests for security middleware
- No tests for error handling
- No tests for input validation
- No integration tests for CORS/CSRF

---

### 3. MONITORING & OBSERVABILITY (MEDIUM)

**File:** `/foresite/back-end/config/monitoring.js`

**Issues:**
- No APM integration (New Relic, DataDog)
- No distributed tracing
- No metrics for database performance
- MONITORING_ENABLED=false by default

**Recommendation:**
- Integrate Sentry for error tracking
- Use prom-client metrics (already installed)
- Implement health check endpoints

---

### 4. MISSING SECURITY HEADERS CONFIGURATION (MEDIUM)

**File:** `/foresite/back-end/middlewares/helmet.js`

**Issue:**
```javascript
crossOriginEmbedderPolicy: false,  // Should be true
crossOriginResourcePolicy: { policy: 'cross-origin' },  // Should be 'same-origin'
```

**Recommendation:**
```javascript
crossOriginEmbedderPolicy: true,
crossOriginResourcePolicy: { policy: 'same-origin' },
permittedCrossDomainPolicies: { permittedPolicies: 'none' }
```

---

### 5. NO DEPENDENCY VULNERABILITY SCANNING (MEDIUM)

**Issue:** No `npm audit` in CI/CD, dependencies not regularly updated

**Package.json vulnerabilities to check:**
- bcryptjs (2.4.3) - old version, check for alternatives
- jsonwebtoken (9.0.2) - verify latest security patches
- cors (2.8.5) - several versions behind latest

**Recommendation:**
- Run `npm audit` in CI/CD
- Update dependencies regularly
- Use `dependabot` or similar tool

---

## SUMMARY TABLE

| Severity | Category | Count | Details |
|----------|----------|-------|---------|
| CRITICAL | Exposed Secrets | 1 | .env file with all credentials |
| HIGH | Input Validation | 2 | NoSQL injection in search, command injection |
| HIGH | Access Control | 1 | User role assignment in registration |
| HIGH | Rate Limiting | 2 | Missing on refresh-token, public endpoints |
| MEDIUM | Password Policy | 1 | 6-char minimum too weak |
| MEDIUM | CORS Config | 1 | Overly permissive in dev |
| MEDIUM | JWT Handling | 1 | Fallback secrets |
| MEDIUM | Error Handling | 3 | Silent failures, no validation |
| MEDIUM | Pagination | 1 | No limit/page bounds |
| MEDIUM | Date Validation | 1 | Unvalidated date parameters |
| MEDIUM | Output Encoding | 1 | XSS in email templates |
| MEDIUM | Admin Actions | 1 | No audit trail for bulk deletes |
| MEDIUM | Logging | 1 | Missing security event logs |
| MEDIUM | Performance | 4 | N+1 queries, indexes, aggregation |
| LOW | Documentation | 1 | Missing API docs |
| LOW | Testing | 1 | Insufficient coverage |

---

## IMMEDIATE ACTION ITEMS (Priority Order)

1. **REMOVE .env FILE FROM GIT HISTORY** - Use `git-filter-branch` or `git-filter-repo`
2. **REVOKE ALL EXPOSED CREDENTIALS** - Database, API keys, Firebase key
3. **FIX COMMAND INJECTION** - Validate dbBackup.js backupPath parameter
4. **ADD INPUT VALIDATION** - Implement Joi schemas for all endpoints
5. **FIX ROLE ASSIGNMENT** - Remove role from registration, hardcode as 'user'
6. **ADD RATE LIMITING** - Apply to refresh-token and public endpoints
7. **ENFORCE PASSWORD POLICY** - Minimum 12 chars, complexity requirements
8. **FIX CORS** - Remove wildcard Replit domain
9. **IMPROVE LOGGING** - Add audit trail for security events
10. **OPTIMIZE QUERIES** - Remove auto-populate, add indexes, fix aggregations

---

## COMPLIANCE CONSIDERATIONS

- GDPR: Implement data deletion, audit logs
- OWASP Top 10: Address injection, broken authentication, sensitive data exposure
- CWE: Cover CWE-78 (OS command injection), CWE-89 (SQL injection), CWE-347 (Improper verification)

