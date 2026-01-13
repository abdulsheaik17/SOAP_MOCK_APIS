# SOAP API Testing Guide for Postman

This guide explains how to test the 3 SOAP APIs using Postman.

## Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

## Available SOAP Endpoints

### 1. No Authentication API
- **URL**: `http://localhost:3000/api/no-auth`
- **Method**: POST
- **Authentication**: None required
- **Response**: Weather data for multiple cities

### 2. Basic Authentication API
- **URL**: `http://localhost:3000/api/basic-auth`
- **Method**: POST
- **Authentication**: Basic Auth
  - Username: `abc`
  - Password: `1234`
- **Response**: Mapping data (Map-001, Map-002)

### 3. X-API-Key Authentication API
- **URL**: `http://localhost:3000/api/x-api-key`
- **Method**: POST
- **Authentication**: X-API-Key header
  - Header Name: `X-API-Key`
  - Header Value: `1234`
- **Response**: Service details (Map-003)

## Testing in Postman

### Setup for All Requests

1. **Method**: Select `POST`
2. **URL**: Use the appropriate endpoint URL
3. **Headers**: 
   - Add `Content-Type: text/xml` or `Content-Type: application/xml`
4. **Body**: 
   - Select `raw`
   - Choose `XML` from the dropdown
   - Add a simple SOAP request body (see examples below)

### Request Body Examples

**The APIs now parse the request body and return dynamic responses based on the parameters you send!**

#### 1. Weather API Request Bodies

**Get weather for all cities:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetWeather />
  </soap:Body>
</soap:Envelope>
```

**Get weather for a specific city:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetWeather>
      <city>Chennai</city>
    </GetWeather>
  </soap:Body>
</soap:Envelope>
```

**Available cities:** Chennai, Bangalore, Mumbai, Kolkata, Delhi, Hyderabad, Pune

#### 2. Mappings API Request Bodies

**Get all mappings:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetMappings />
  </soap:Body>
</soap:Envelope>
```

**Get only active mappings:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetMappings>
      <activeOnly>true</activeOnly>
    </GetMappings>
  </soap:Body>
</soap:Envelope>
```

**Get a specific mapping by ID:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetMappings>
      <mapID>Map-001</mapID>
    </GetMappings>
  </soap:Body>
</soap:Envelope>
```

**Available mapping IDs:** Map-001, Map-002, Map-003, Map-004

#### 3. Service Details API Request Bodies

**Get all services:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetServiceDetails />
  </soap:Body>
</soap:Envelope>
```

**Get a specific service by name:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetServiceDetails>
      <serviceName>service1</serviceName>
    </GetServiceDetails>
  </soap:Body>
</soap:Envelope>
```

**Get a specific service by ID:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetServiceDetails>
      <serviceID>Map-003</serviceID>
    </GetServiceDetails>
  </soap:Body>
</soap:Envelope>
```

**Available services:** service1, service2, service3

### Step-by-Step for Each API

#### 1. No Authentication API

1. Create a new request in Postman
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/no-auth`
4. Go to **Headers** tab:
   - Add: `Content-Type` = `text/xml`
5. Go to **Body** tab:
   - Select `raw`
   - Choose `XML` from dropdown
   - Paste the SOAP request body (see example above)
6. Click **Send**

**Expected Response**: 
- If no city specified: XML with weather data for all cities (Chennai, Bangalore, Mumbai, Kolkata, Delhi, Hyderabad, Pune)
- If city specified: XML with weather data for that specific city only
- If city not found: Error message

#### 2. Basic Authentication API

1. Create a new request in Postman
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/basic-auth`
4. Go to **Authorization** tab:
   - Type: Select `Basic Auth`
   - Username: `abc`
   - Password: `1234`
5. Go to **Headers** tab:
   - Add: `Content-Type` = `text/xml`
6. Go to **Body** tab:
   - Select `raw`
   - Choose `XML` from dropdown
   - Paste the SOAP request body
7. Click **Send**

**Expected Response**: 
- If no parameters: XML with all mappings (Map-001, Map-002, Map-003, Map-004)
- If `activeOnly=true`: XML with only active mappings
- If `mapID` specified: XML with that specific mapping
- If mapping not found: Error message

**Note**: If you get 401 Unauthorized, check that the Basic Auth credentials are correct.

#### 3. X-API-Key Authentication API

1. Create a new request in Postman
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/x-api-key`
4. Go to **Headers** tab:
   - Add: `Content-Type` = `text/xml`
   - Add: `X-API-Key` = `1234`
5. Go to **Body** tab:
   - Select `raw`
   - Choose `XML` from dropdown
   - Paste the SOAP request body
6. Click **Send**

**Expected Response**: 
- If no parameters: XML with all services (service1, service2, service3)
- If `serviceName` or `serviceID` specified: XML with that specific service details
- If service not found: Error message

**Note**: If you get 403 Forbidden, check that the X-API-Key header value is exactly `1234`.

## How Dynamic Request Bodies Work

The APIs now **parse and use the request body** to return dynamic responses:

1. **Operation Name**: The first XML element inside `<soap:Body>` is treated as the operation name (e.g., `GetWeather`, `GetMappings`, `GetServiceDetails`)

2. **Parameters**: Any child elements inside the operation element are extracted as parameters (e.g., `<city>Chennai</city>` becomes `params.city = "Chennai"`)

3. **Dynamic Responses**: Based on the parameters, the API returns different data:
   - **No parameters**: Returns all available data
   - **With parameters**: Returns filtered/specific data
   - **Invalid parameters**: Returns error messages

### Example Flow

**Request:**
```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetWeather>
      <city>Chennai</city>
    </GetWeather>
  </soap:Body>
</soap:Envelope>
```

**What happens:**
1. Parser extracts operation: `GetWeather`
2. Parser extracts parameter: `city = "Chennai"`
3. API looks up weather data for Chennai
4. Returns weather response for Chennai only

## Response Format

All responses will be wrapped in a SOAP envelope:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <!-- Response content here -->
  </soap:Body>
</soap:Envelope>
```

## Troubleshooting

- **Connection Refused**: Make sure the server is running (`npm start`)
- **401 Unauthorized**: Check Basic Auth credentials (username: `abc`, password: `1234`)
- **403 Forbidden**: Check X-API-Key header value is `1234`
- **Empty Response**: Ensure you're sending a POST request with XML body

## Health Check

You can verify the server is running by making a GET request to:
- **URL**: `http://localhost:3000/health`
- **Method**: GET
- **Expected Response**: `{"status":"ok","message":"SOAP Mock Server is running"}`
