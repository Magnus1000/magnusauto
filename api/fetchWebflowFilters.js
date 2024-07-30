const axios = require('axios');
const cors = require('cors');

// Initialize CORS middleware
const corsMiddleware = cors();

// Create an axios instance with base configuration
const webflowApi = axios.create({
  baseURL: 'https://api.webflow.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.WEBFLOW_API_TOKEN}`,
    'accept': 'application/json',
    'content-type': 'application/json'
  }
});

module.exports = (req, res) => {
  corsMiddleware(req, res, async () => {
    console.log(`[${new Date().toISOString()}] Incoming request: ${req.method} ${req.url}`);

    // Only allow GET requests
    if (req.method !== 'GET') {
      console.warn(`[${new Date().toISOString()}] Method Not Allowed: ${req.method}`);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
      // Fetch products from Webflow API
      const siteId = process.env.SITE_ID;
      console.log(`[${new Date().toISOString()}] Attempting to use SITE_ID: ${siteId}`);

      if (!siteId) {
        console.error(`[${new Date().toISOString()}] SITE_ID environment variable is not set`);
        return res.status(400).json({ error: 'SITE_ID environment variable is not set' });
      }

      console.log(`[${new Date().toISOString()}] Fetching products for site ID: ${siteId}`);
      const response = await webflowApi.get(`/sites/${siteId}/products`, {
        params: {
          limit: 100 // Adjust as needed, max is 100
        }
      });

      console.log(`[${new Date().toISOString()}] Fetched products successfully. Count: ${response.data.items?.length || 0}`);

      // Return the products
      res.status(200).json(response.data);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching products:`, error.response?.data || error.message);
      if (error.response) {
        res.status(error.response.status).json({ error: error.response.data });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  });
};