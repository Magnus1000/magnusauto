import Webflow from 'webflow-api';
import cors from 'cors';

// Initialize CORS middleware
const corsMiddleware = cors();

// Initialize Webflow client
const webflow = new Webflow({ token: process.env.WEBFLOW_API_TOKEN });

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
      const collectionId = process.env.COLLECTION_ID;
      if (!collectionId) {
        console.error(`[${new Date().toISOString()}] Collection ID not provided`);
        return res.status(400).json({ error: 'Collection ID not provided' });
      }

      console.log(`[${new Date().toISOString()}] Fetching collection with ID: ${collectionId}`);
      const collection = await webflow.collection({ collectionId });
      const items = await collection.items();

      console.log(`[${new Date().toISOString()}] Fetched products: ${JSON.stringify(items)}`);

      // Return the products
      res.status(200).json(items);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching products:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};