import axios from "axios";


// // ------ production URL for deployed site------------//

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend base URL
  headers: {
    "Content-Type": "application/json",
   
  },
});


/* =========================
   REQUEST INTERCEPTOR
   Automatically attach token
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
   Handle token expiry
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      
      // ✅ Optional: Force redirect to login page
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

// see exactly what URL the frontend is hitting and the response from the backend.
api.interceptors.request.use((config) => {
  if (config.url === "/" || config.url === "" || !config.url) {
    console.error("❌ INVALID API CALL:", config);
  }
  return config;
});

// api.interceptors.request.use((config) => {
//   console.log("API Request:", config.method, config.url, config.data);
//   return config;
// });
// api.interceptors.response.use(
//   (res) => {
//     console.log("API Response:", res);
//     return res;
//   },
//   (err) => {
//     console.error("API Error:", err.response);
//     return Promise.reject(err);
//   }
// );

export default api;
