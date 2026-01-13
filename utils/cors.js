/**
 * Set CORS headers on response
 * @param {Object} res - Express response object
 */
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, SOAPAction, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}
