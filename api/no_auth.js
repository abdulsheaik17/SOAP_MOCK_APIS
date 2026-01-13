import { soapEnvelope } from '../utils/soap.js';
import { parseSoapRequest } from '../utils/soapParser.js';
import { setCorsHeaders } from '../utils/cors.js';

// Mock weather data
const weatherData = {
  'Chennai': { place: 'Chennai', temperature: 28, humidity: 75, condition: 'Partly Cloudy' },
  'Bangalore': { place: 'Bangalore', temperature: 32, humidity: 65, condition: 'Sunny' },
  'Mumbai': { place: 'Mumbai', temperature: 35, humidity: 80, condition: 'Humid' },
  'Kolkata': { place: 'Kolkata', temperature: 30, humidity: 70, condition: 'Cloudy' },
  'Delhi': { place: 'Delhi', temperature: 33, humidity: 55, condition: 'Clear' },
  'Hyderabad': { place: 'Hyderabad', temperature: 31, humidity: 60, condition: 'Sunny' },
  'Pune': { place: 'Pune', temperature: 29, humidity: 68, condition: 'Pleasant' }
};

export default function handler(req, res) {
  const { operation, params } = parseSoapRequest(req.body);
  
  let responseBody = '';
  
  // Handle different operations
  if (operation === 'GetWeather' || operation === 'GetWeatherRequest') {
    const city = params.city || params.place;
    
    if (city) {
      // Return weather for specific city
      const cityData = weatherData[city];
      if (cityData) {
        responseBody = `
    <GetWeatherResponse>
      <success>
        <city>
          <place>${cityData.place}</place>
          <temperature>${cityData.temperature}</temperature>
          <humidity>${cityData.humidity}</humidity>
          <condition>${cityData.condition}</condition>
        </city>
      </success>
    </GetWeatherResponse>
    `;
      } else {
        responseBody = `
    <GetWeatherResponse>
      <error>
        <message>City '${city}' not found</message>
      </error>
    </GetWeatherResponse>
    `;
      }
    } else {
      // Return all cities if no city specified
      const citiesXml = Object.values(weatherData).map(city => `
        <city>
          <place>${city.place}</place>
          <temperature>${city.temperature}</temperature>
          <humidity>${city.humidity}</humidity>
          <condition>${city.condition}</condition>
        </city>`).join('');
      
      responseBody = `
    <GetWeatherResponse>
      <success>
        ${citiesXml}
      </success>
    </GetWeatherResponse>
    `;
    }
  } else {
    // Default response for unknown operations
    responseBody = `
    <GetWeatherResponse>
      <error>
        <message>Unknown operation: ${operation || 'null'}</message>
        <supportedOperations>GetWeather</supportedOperations>
      </error>
    </GetWeatherResponse>
    `;
  }
  
  // Set CORS headers
  setCorsHeaders(res);
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(soapEnvelope(responseBody));
}