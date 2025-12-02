import { request } from "../config/Request";

export class AccountApi {
    static getAccount() {
        return request({
            method: "GET",
            url: `/account`
        })
    }


}