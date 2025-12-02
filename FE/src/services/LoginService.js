import { request } from "../config/Request";

export class LoginService {
    static loginAccountService = (data) => {
        return request({
            method: "POST",
            url: `/public/login`,
            data: data,
        })
    }

    static SignupAccountService = (data) => {
        return request({
            method: "POST",
            url: `/public/signup`,
            data: data,
        })
    }

    static changePassword = (data) => {
        return request({
            method: "POST",
            url: `/public/change-password`,
            data: data,
        })
    }
}