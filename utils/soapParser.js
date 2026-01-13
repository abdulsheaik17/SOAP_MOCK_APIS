/**
 * Parses SOAP request body to extract operation name and parameters
 * @param {string|Buffer} rawBody - Raw request body
 * @returns {Object} - Parsed data with operation and params
 */
export function parseSoapRequest(rawBody) {
  const bodyString = rawBody.toString();
  
  // Extract content from SOAP Body
  const bodyMatch = bodyString.match(/<soap:Body[^>]*>([\s\S]*?)<\/soap:Body>/i) ||
                    bodyString.match(/<Body[^>]*>([\s\S]*?)<\/Body>/i);
  
  if (!bodyMatch) {
    return { operation: null, params: {} };
  }
  
  const bodyContent = bodyMatch[1].trim();
  
  // Extract operation name (first XML element in body)
  const operationMatch = bodyContent.match(/<([^:>\s]+)[:>]/) || 
                         bodyContent.match(/<([a-zA-Z][a-zA-Z0-9]*)[\s>]/);
  const operation = operationMatch ? operationMatch[1] : null;
  
  // Extract parameters (simple key-value pairs)
  const params = {};
  const paramMatches = bodyContent.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)[^>]*>([^<]*)<\/\1>/g);
  
  for (const match of paramMatches) {
    const key = match[1];
    const value = match[2].trim();
    // Skip the operation element itself
    if (key !== operation && value) {
      params[key] = value;
    }
  }
  
  return { operation, params };
}
