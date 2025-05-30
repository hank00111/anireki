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
	withCredentials: true,	headers: {
		"Content-Type": "application/json",
		"Accept": "application/json",
		"Referrer-Policy": "strict-origin-when-cross-origin",
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options": "DENY",
	},
});

// service.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     // 從 localStorage 獲取 token
//     const token = localStorage.getItem('token');
//     if (token) {
//       // 在請求頭中添加 token
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

//     // 如果 API 回傳的是自訂的成功/失敗結構
//     if (res && typeof res.success !== 'undefined') {
//       if (res.success) {
//         return res;
//       } else {
//         // 業務邏輯錯誤
//         console.error('API error:', res.message || '未知錯誤');
//         // 可以在此處理特定錯誤碼，例如：
//         if (res.code === 401) {
//           // 登入過期，清除用戶資料
//           localStorage.removeItem('token');
//           window.location.href = '/login'; // 導向登入頁面
//         }
//         return Promise.reject(new Error(res.message || '未知錯誤'));
//       }
//     }

//
//     return res;
//   },
//   (error: AxiosError) => {
//     const { response } = error;

//     if (response) {
//       // 處理 HTTP 狀態碼錯誤
//       switch (response.status) {
//         case 400:
//           console.error('請求錯誤');
//           break;
//         case 401:
//           console.error('未授權，請重新登入');
//           localStorage.removeItem('token');
//           window.location.href = '/login';
//           break;
//         case 403:
//           console.error('拒絕訪問');
//           break;
//         case 404:
//           console.error('請求地址出錯');
//           break;
//         case 408:
//           console.error('請求超時');
//           break;
//         case 500:
//           console.error('伺服器內部錯誤');
//           break;
//         case 501:
//           console.error('服務未實現');
//           break;
//         case 502:
//           console.error('網關錯誤');
//           break;
//         case 503:
//           console.error('服務不可用');
//           break;
//         case 504:
//           console.error('網關超時');
//           break;
//         default:
//           console.error(`連接錯誤 ${response.status}`);
//       }
//     } else {
//
//       if (error.message && error.message.includes('timeout')) {
//         console.error('請求超時，請檢查網路');
//       } else {
//         console.error('網路異常，請檢查網路連接');
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
