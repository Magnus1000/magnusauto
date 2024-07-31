// Function to fetch Webflow products
async function fetchWebflowProducts() {
    console.log(`[${new Date().toISOString()}] Starting fetchWebflowProducts function`);
  
    try {
      // Replace with the actual URL of your serverless function
      const serverlessUrl = 'https://magnusauto-magnus1000team.vercel.app/api/fetchWebflowFilters2';
  
      const response = await fetch(serverlessUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched Webflow products:', data);
  
    } catch (error) {
      console.error('Error fetching Webflow products:', error);
    }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchWebflowProducts);