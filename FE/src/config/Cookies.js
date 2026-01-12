import { jwtDecode } from "jwt-decode";


import { getCookie, setCookie, deleteCookie } from "./CookiesRequest";

// Lấy access token
export const getAccessToken = () => getCookie("accessToken");

// Lấy refresh token
export const getRefreshToken = () => getCookie("refreshToken");
// Lưu access token
export const setAccessToken = (token) => {
    if (token) setCookie("accessToken", token, 1); // 1 ngày
};

// Lưu refresh token
export const setRefreshToken = (token) => {
    if (token) setCookie("refreshToken", token, 7); // 7 ngày
};

// Lưu user info decode từ access token
export const saveUserFromToken = (token) => {
    if (!token || typeof token !== "string" || token.split(".").length !== 3) return;

    try {
        const decoded = jwtDecode(token);
        const user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.roles,
            fullName: decoded.fullName,
            avatar: decoded.avata,
            exp: decoded.exp * 1000,
        };
        setCookie("userInfo", JSON.stringify(user), 1);
    } catch (e) {
        console.error("saveUserFromToken error:", e);
    }
};


// Xóa toàn bộ token và user info
export const clearAuth = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userInfo");
};

export const clearAccessToken = () => {
    deleteCookie("accessToken");
}
