export function soapEnvelope(bodyXml) {
  return `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        ${bodyXml}
      </soap:Body>
    </soap:Envelope>
    `;
}
