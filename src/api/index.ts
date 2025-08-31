import axios, { AxiosInstance } from "axios";
//, AxiosRequestConfig, AxiosResponse, AxiosError

// interface ApiResponse<T = any> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   code?: number;
// }

const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 30000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

// service.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     // Get token from localStorage
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Add token to request headers
//       config.headers = {
//         ...config.headers,
//         'Authorization': `Bearer ${token}`,
//       };
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// service.interceptors.response.use(
//   (response: AxiosResponse): AxiosResponse['data'] => {
//     const res = response.data;

//     // If API returns custom success/failure structure
//     if (res && typeof res.success !== 'undefined') {
//       if (res.success) {
//         return res;
//       } else {
//         // Business logic error
//         console.error('API error:', res.message || 'Unknown error');
//         // Handle specific error codes here, for example:
//         if (res.code === 401) {
//           // Login expired, clear user data
//           localStorage.removeItem('token');
//           window.location.href = '/login'; // Redirect to login page
//         }
//         return Promise.reject(new Error(res.message || 'Unknown error'));
//       }
//     }

//
//     return res;
//   },
//   (error: AxiosError) => {
//     const { response } = error;

//     if (response) {
//       // Handle HTTP status code errors
//       switch (response.status) {
//         case 400:
//           console.error('Bad request');
//           break;
//         case 401:
//           console.error('Unauthorized, please login again');
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//           break;
//         case 403:
//           console.error('Access denied');
//           break;
//         case 404:
//           console.error('Request address error');
//           break;
//         case 408:
//           console.error('Request timeout');
//           break;
//         case 500:
//           console.error('Internal server error');
//           break;
//         case 501:
//           console.error('Service not implemented');
//           break;
//         case 502:
//           console.error('Gateway error');
//           break;
//         case 503:
//           console.error('Service unavailable');
//           break;
//         case 504:
//           console.error('Gateway timeout');
//           break;
//         default:
//           console.error(`Connection error ${response.status}`);
//       }
//     } else {
//       if (error.message && error.message.includes('timeout')) {
//         console.error('Request timeout, please check network');
//       } else {
//         console.error('Network error, please check network connection');
//       }
//     }

//     return Promise.reject(error);
//   }
// );

//
// export const get = <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
//   return service.get(url, { params });
// };

//
// export const post = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
//   return service.post(url, data);
// };

//
// export const put = <T = any>(url: string, data?: any): Promise<ApiResponse<T>> => {
//   return service.put(url, data);
// };

//
// export const del = <T = any>(url: string, params?: any): Promise<ApiResponse<T>> => {
//   return service.delete(url, { params });
// };

export default service;
