import { request } from "../../../config/Request";
export class AccountApi {
    static getAllAccount = () => {
        return request({
            method: "GET",
            url: `/admin/account`,
        });
    };
    static getAll = (filter) => {
        return request({
            method: "GET",
            url: `/admin/account`,
            params: filter,
        });
    };
    static getAllStaff = (filter) => {
        return request({
            method: "GET",
            url: `/admin/account/staff`,
            params: filter,
        });
    };
    static create = (data) => {
        return request({
            method: "POST",
            url: `/admin/staff`,
            data: data,
        });
    };

    static getOne = (id) => {
        return request({
            method: "GET",
            url: `/admin/staff/${id}`,
        });
    };

    static update = (id, data) => {
        return request({
            method: "PUT",
            url: `/admin/staff/${id}`,
            data: data,
        });
    };
}
