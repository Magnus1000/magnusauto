const Airtable = require('airtable');
const cors = require('cors');

// Initialize CORS middleware
const corsMiddleware = cors();

// Configure Airtable
Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY
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
      // Extract query parameters
      const { make, model, year } = req.query;

      // Fetch categories from Airtable
      const baseId = process.env.AIRTABLE_BASE_ID;
      const tableId = process.env.AIRTABLE_CATEGORIES_TABLE_ID;
      console.log(`[${new Date().toISOString()}] Attempting to use AIRTABLE_BASE_ID: ${baseId} and AIRTABLE_CATEGORIES_TABLE_ID: ${tableId}`);

      if (!baseId || !tableId) {
        console.error(`[${new Date().toISOString()}] AIRTABLE_BASE_ID or AIRTABLE_CATEGORIES_TABLE_ID environment variable is not set`);
        return res.status(400).json({ error: 'AIRTABLE_BASE_ID or AIRTABLE_CATEGORIES_TABLE_ID environment variable is not set' });
      }

      console.log(`[${new Date().toISOString()}] Fetching categories from Airtable`);

      const base = Airtable.base(baseId);
      const table = base(tableId);

      // Construct the filter formula
      let filterFormulaParts = [];
      if (make) {
        filterFormulaParts.push(`{Make} = '${make}'`);
      }
      if (model) {
        filterFormulaParts.push(`{Model} = '${model}'`);
      }
      if (year) {
        filterFormulaParts.push(`OR(FIND('${year}', {Years}) > 0, {Years} = '${year}')`);
      }

      let filterByFormula = filterFormulaParts.length > 0 ? `AND(${filterFormulaParts.join(', ')})` : '';

      console.log(`[${new Date().toISOString()}] Filter formula: ${filterByFormula}`);

      const records = await table.select({
        maxRecords: 100, // Adjust as needed
        view: 'Grid view', // Adjust to your view name if different
        filterByFormula: filterByFormula || undefined
      }).all();

      console.log(`[${new Date().toISOString()}] Fetched categories successfully. Count: ${records.length}`);

      // Transform Airtable response and extract category_ids
      const transformedData = {
        items: records.map(record => ({
          ...record.fields
        }))
      };

      // Extract category_ids
      const categoryIds = records.map(record => record.fields.category_id).filter(Boolean);

      console.log(`[${new Date().toISOString()}] Extracted category_ids: ${categoryIds.join(', ')}`);

      // Return the transformed categories and category_ids
      res.status(200).json({
        ...transformedData,
        categoryIds: categoryIds
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching categories:`, error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};