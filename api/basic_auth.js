import { soapEnvelope } from '../utils/soap.js';
import { parseSoapRequest } from '../utils/soapParser.js';
import { setCorsHeaders } from '../utils/cors.js';

// Mock mapping data
const mappings = {
  'Map-001': {
    wsMapID: 'Map-001',
    wsMapName: 'Mapping 1',
    wsCred: { username: 'abc', password: '1234' },
    description: 'Mapping Description 1',
    active: true
  },
  'Map-002': {
    wsMapID: 'Map-002',
    wsMapName: 'Mapping 2',
    wsCred: { username: 'abc', password: '1234' },
    description: 'Mapping Description 2',
    active: true
  },
  'Map-003': {
    wsMapID: 'Map-003',
    wsMapName: 'Mapping 3',
    wsCred: { username: 'xyz', password: '5678' },
    description: 'Mapping Description 3',
    active: false
  },
  'Map-004': {
    wsMapID: 'Map-004',
    wsMapName: 'Mapping 4',
    wsCred: { username: 'test', password: 'test123' },
    description: 'Mapping Description 4',
    active: true
  }
};

export default function handler(req, res) {
  // Set CORS headers for all responses
  setCorsHeaders(res);
  
  const auth = req.headers.authorization;
  
  if (auth !== "Basic YWJjOjEyMzQ=") {
    return res.status(401).send("Unauthorized");
  }
  
  const { operation, params } = parseSoapRequest(req.body);
  
  let responseBody = '';
  
  // Handle different operations
  if (operation === 'GetMappings' || operation === 'GetMappingsRequest') {
    const mapID = params.mapID || params.wsMapID || params.id;
    const activeOnly = params.activeOnly === 'true' || params.active === 'true';
    
    if (mapID) {
      // Return specific mapping
      const mapping = mappings[mapID];
      if (mapping) {
        responseBody = `
    <GetMappingsResponse>
      <success>
        <mapping>
          <wsMapID>${mapping.wsMapID}</wsMapID>
          <wsMapName>${mapping.wsMapName}</wsMapName>
          <wsCred>
            <username>${mapping.wsCred.username}</username>
            <password>${mapping.wsCred.password}</password>
          </wsCred>
          <description>${mapping.description}</description>
          <active>${mapping.active}</active>
        </mapping>
      </success>
    </GetMappingsResponse>
    `;
      } else {
        responseBody = `
    <GetMappingsResponse>
      <error>
        <message>Mapping '${mapID}' not found</message>
      </error>
    </GetMappingsResponse>
    `;
      }
    } else {
      // Return all mappings (filter by active if requested)
      let filteredMappings = Object.values(mappings);
      if (activeOnly) {
        filteredMappings = filteredMappings.filter(m => m.active);
      }
      
      const mappingsXml = filteredMappings.map(mapping => `
        <mapping>
          <wsMapID>${mapping.wsMapID}</wsMapID>
          <wsMapName>${mapping.wsMapName}</wsMapName>
          <wsCred>
            <username>${mapping.wsCred.username}</username>
            <password>${mapping.wsCred.password}</password>
          </wsCred>
          <description>${mapping.description}</description>
          <active>${mapping.active}</active>
        </mapping>`).join('');
      
      responseBody = `
    <GetMappingsResponse>
      <success>
        ${mappingsXml}
      </success>
    </GetMappingsResponse>
    `;
    }
  } else {
    // Default response for unknown operations
    responseBody = `
    <GetMappingsResponse>
      <error>
        <message>Unknown operation: ${operation || 'null'}</message>
        <supportedOperations>GetMappings</supportedOperations>
      </error>
    </GetMappingsResponse>
    `;
  }
  
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(soapEnvelope(responseBody));
}
