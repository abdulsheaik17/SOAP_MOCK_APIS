import { soapEnvelope } from '../utils/soap.js';
import { parseSoapRequest } from '../utils/soapParser.js';

// Mock service details
const services = {
  'service1': {
    wsMapID: 'Map-003',
    wsMapName: 'Service 1',
    wsCred: { xApiKey: '1234' },
    description: 'Service Description 1',
    active: true,
    url: '/webservice1',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    parameters: { param1: 'value1', param2: 'value2' }
  },
  'service2': {
    wsMapID: 'Map-004',
    wsMapName: 'Service 2',
    wsCred: { xApiKey: '5678' },
    description: 'Service Description 2',
    active: true,
    url: '/webservice2',
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' },
    parameters: { param1: 'data1', param2: 'data2' }
  },
  'service3': {
    wsMapID: 'Map-005',
    wsMapName: 'Service 3',
    wsCred: { xApiKey: '9012' },
    description: 'Service Description 3',
    active: false,
    url: '/webservice3',
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer token' },
    parameters: { id: '123', action: 'update' }
  }
};

export default function handler(req, res) {
  const apiKey = req.headers["x-api-key"];
  
  if (apiKey !== "1234") {
    return res.status(403).send("Forbidden");
  }
  
  const { operation, params } = parseSoapRequest(req.body);
  
  let responseBody = '';
  
  // Handle different operations
  if (operation === 'GetServiceDetails' || operation === 'GetServiceDetailsRequest') {
    const serviceName = params.serviceName || params.service || params.name;
    const serviceID = params.serviceID || params.id || params.wsMapID;
    
    if (serviceName || serviceID) {
      // Find service by name or ID
      const service = services[serviceName] || 
                     Object.values(services).find(s => s.wsMapID === serviceID);
      
      if (service) {
        const headersXml = Object.entries(service.headers).map(([key, value]) => 
          `<${key}>${value}</${key}>`).join('\n            ');
        const paramsXml = Object.entries(service.parameters).map(([key, value]) => 
          `<${key}>${value}</${key}>`).join('\n            ');
        
        responseBody = `
    <GetServiceDetailsResponse>
      <success>
        <mapping>
          <wsMapID>${service.wsMapID}</wsMapID>
          <wsMapName>${service.wsMapName}</wsMapName>
          <wsCred>
            <xApiKey>${service.wsCred.xApiKey}</xApiKey>
          </wsCred>
          <description>${service.description}</description>
          <active>${service.active}</active>
          <url>${service.url}</url>
          <method>${service.method}</method>
          <headers>
            ${headersXml}
          </headers>
          <parameters>
            ${paramsXml}
          </parameters>
        </mapping>
      </success>
    </GetServiceDetailsResponse>
    `;
      } else {
        responseBody = `
    <GetServiceDetailsResponse>
      <error>
        <message>Service '${serviceName || serviceID}' not found</message>
      </error>
    </GetServiceDetailsResponse>
    `;
      }
    } else {
      // Return all services
      const servicesXml = Object.values(services).map(service => {
        const headersXml = Object.entries(service.headers).map(([key, value]) => 
          `<${key}>${value}</${key}>`).join('\n            ');
        const paramsXml = Object.entries(service.parameters).map(([key, value]) => 
          `<${key}>${value}</${key}>`).join('\n            ');
        
        return `
        <mapping>
          <wsMapID>${service.wsMapID}</wsMapID>
          <wsMapName>${service.wsMapName}</wsMapName>
          <wsCred>
            <xApiKey>${service.wsCred.xApiKey}</xApiKey>
          </wsCred>
          <description>${service.description}</description>
          <active>${service.active}</active>
          <url>${service.url}</url>
          <method>${service.method}</method>
          <headers>
            ${headersXml}
          </headers>
          <parameters>
            ${paramsXml}
          </parameters>
        </mapping>`;
      }).join('');
      
      responseBody = `
    <GetServiceDetailsResponse>
      <success>
        ${servicesXml}
      </success>
    </GetServiceDetailsResponse>
    `;
    }
  } else {
    // Default response for unknown operations
    responseBody = `
    <GetServiceDetailsResponse>
      <error>
        <message>Unknown operation: ${operation || 'null'}</message>
        <supportedOperations>GetServiceDetails</supportedOperations>
      </error>
    </GetServiceDetailsResponse>
    `;
  }
  
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(soapEnvelope(responseBody));
}
  