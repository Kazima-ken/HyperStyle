import { request } from "../../../config/Request";
export class CustomerApi {
    static getAll = (filter) => {
        return request({
            method: "GET",
            url: `/admin/customers`,
            params: filter,
        });
    };

    static getOne = (id) => {
        return request({
            method: "GET",
            url: `/admin/customers/${id}`,
        });
    };

    static update = (id, data) => {
    return request({
        method: "PUT",
        url: `/admin/customers/${id}`,
        data: data,
    });
};

}
