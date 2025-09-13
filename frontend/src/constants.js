const LOCAL_API = 'http://localhost:5000/api';

// Production (Render)
const PROD_API = 'https://employee-management-system-2y4w.onrender.com/api';

// Switch based on environment
// You can manually change `isProduction` or detect automatically
const isProduction = true; // set to true when deploying
export const API_BASE_URL = isProduction ? PROD_API : LOCAL_API;