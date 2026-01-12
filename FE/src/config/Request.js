import axios from "axios";
import { AppConfig, AppConfigAddress } from "./AppConfig";
import { store } from "../app/store";
import { SetLoadingTrue, SetLoadingFalse } from "../app/reducer/LoadingReducer";
import {
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    clearAuth,
} from "./Cookies";


export const request = axios.create({
    baseURL: AppConfig.apiUrl,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const requestAdress = axios.create({
    baseURL: AppConfigAddress.apiUrl,
});

// --- REQUEST INTERCEPTOR ---
request.interceptors.request.use(
    (config) => {
        store.dispatch(SetLoadingTrue());

        const token = getAccessToken();

        // --- DEBUG LOG (Mở F12 để xem Token có được lấy đúng không) ---
        // console.log(">>> URL:", config.url);
        // console.log(">>> Token gửi đi:", token); 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Đảm bảo không bị dính Content-Type JSON khi gửi file
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => {
        store.dispatch(SetLoadingFalse());
        return Promise.reject(error);
    }
);

// --- RESPONSE INTERCEPTOR ---
request.interceptors.response.use(
    (response) => {
        store.dispatch(SetLoadingFalse());
        return response;
    },
    async (error) => {
        store.dispatch(SetLoadingFalse());

        const originalRequest = error.config;

        // Nếu lỗi 401 (Hết hạn token) thì mới Refresh
        // Lỗi 403 (Forbidden) sẽ KHÔNG nhảy vào đây -> Nó sẽ throw error ra ngoài
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url.includes("/public/refresh")) {
                // Nếu chính cái API refresh cũng lỗi -> Logout luôn tránh loop vô tận
                handleLogout();
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                handleLogout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return request(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;

            try {
                const res = await axios.post(`${AppConfig.apiUrl}/public/refresh`, {
                    token: refreshToken,
                });

                const newAccessToken = res.data.token; // Đảm bảo backend trả về field tên là 'token'
                setAccessToken(newAccessToken);

                request.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return request(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Nếu lỗi 403, code sẽ chạy xuống đây và trả về lỗi cho hàm gọi API
        return Promise.reject(error);
    }
);

const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
};