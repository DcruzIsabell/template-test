export class XogoApi {

    constructor() {
      this.baseUrl = 'https://api2-staging.xogo.io';
      this.apiVersion = '/v2/api';
      this.token = localStorage.getItem('token');
    }
  
    async get(endpoint) {
      const response = await fetch(`${this.baseUrl}${this.apiVersion}${endpoint}`, {
        
        method: 'GET',
        headers: {
          'x-api-version': '1.0',
          'x-manager-key': this.token,
        }
      });
        if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response; // Ensure this is a standard Response object

    }
  
    async post( endpoint, data) {
      const response = await fetch(`${this.baseUrl}${this.apiVersion}${endpoint}`, {
        method: 'POST',
        headers: {
          'x-api-version': '1.0',
          'x-manager-key': this.token,
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    }
  
  }