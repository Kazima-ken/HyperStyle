import { request } from "../../../config/Request";

export class ProductApi {
    static getAll = (params) => {
        return request({
            method: "get",
            url: "/admin/product",
            params: params
        });
    }

    static getAllName = (params) => {
        return request({
            method: "get",
            url: "/admin/product/getByName",
            params: params
        });
    }

    static create = (data) => {
        return request({
            method: "post",
            url: "/admin/product",
            data: data
        });
    }

    static getOne = (id) => {
        return request({
            method: "get",
            url: `/admin/product/${id}`
        });
    }

    static update = (id, data) => {
        return request({
            method: "put",
            url: `/admin/product/${id}`,
            data: data
        });
    }

    static delete = (id) => {
        return request({
            method: "delete",
            url: `/admin/product/${id}`
        });
    }

    static getAllImage = (id) => {
        return request({
            method: "get",
            url: `/admin/image/${id}`,
        });
    };

}