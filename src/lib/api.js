import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthCheck = url === "/me" || url.endsWith("/me") || url.includes("/auth/get-session");

    if (error.response?.status === 401 && !isAuthCheck && !isRedirecting) {
      isRedirecting = true;
      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      setTimeout(() => { isRedirecting = false; }, 2000);
    }
    return Promise.reject(error);
  }
);

export default api;
