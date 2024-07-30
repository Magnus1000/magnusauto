import axios from 'axios';
import cors from 'cors';

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

export default (req, res) => {
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
      if (!siteId) {
        console.error(`[${new Date().toISOString()}] Site ID not provided`);
        return res.status(400).json({ error: 'Site ID not provided' });
      }

      console.log(`[${new Date().toISOString()}] Fetching products for site ID: ${siteId}`);
      const response = await webflowApi.get(`/sites/${siteId}/products`, {
        params: {
          limit: 100 // Adjust as needed, max is 100
        }
      });

      console.log(`[${new Date().toISOString()}] Fetched products: ${JSON.stringify(response.data)}`);

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