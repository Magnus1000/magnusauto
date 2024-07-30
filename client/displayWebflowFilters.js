// Function to fetch Webflow products
async function fetchWebflowProducts() {
  console.log(`[${new Date().toISOString()}] Starting fetchWebflowProducts function`);

  try {
    // Replace with the actual URL of your serverless function
    const serverlessUrl = 'https://magnusauto-magnus1000team.vercel.app/api/fetchWebflowFilters';
    console.log(`[${new Date().toISOString()}] Fetching data from URL: ${serverlessUrl}`);

    const response = await fetch(serverlessUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`[${new Date().toISOString()}] Received response with status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Fetched Webflow products:`, data);

    // You can process or display the data here as needed
    // For example, if you want to display each product name:
    data.items.forEach(item => {
      console.log(`[${new Date().toISOString()}] Product Name: ${item.name}`);
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching Webflow products:`, error);
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log(`[${new Date().toISOString()}] DOM fully loaded, calling fetchWebflowProducts`);
  fetchWebflowProducts();
});