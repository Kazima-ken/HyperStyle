import { jwtDecode } from "jwt-decode";

export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`; 
};

export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(";");

    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(nameEQ)) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
};


export const getAccessToken = () => getCookie("accessToken");
export const getRefreshToken = () => getCookie("refreshToken");

export const setAccessToken = (token) => {
    if (token) setCookie("accessToken", token, 1);
};

export const setRefreshToken = (token) => {
    if (token) setCookie("refreshToken", token, 7);
};

export const saveUserFromToken = (token) => {
    if (!token || typeof token !== "string") return;

    try {
        const decoded = jwtDecode(token);
        const user = {
            id: decoded.id,
            email: decoded.email,
            roles: decoded.roles,
            fullName: decoded.fullName,
            avatar: decoded.avata || decoded.avatar,
            exp: decoded.exp * 1000,
        };
        setCookie("userInfo", JSON.stringify(user), 1);
        return user;
    } catch (e) {
        console.error("Lỗi decode token:", e);
        return null;
    }
};

// Xóa sạch dữ liệu đăng nhập
export const clearAuth = () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userInfo");
};