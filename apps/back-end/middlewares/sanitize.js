import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

export const sanitizeMiddleware = [
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized key: ${key} in request from ${req.ip}`);
    },
  }),
  xss(),
];
