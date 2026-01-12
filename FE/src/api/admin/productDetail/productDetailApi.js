import { request } from "../../../config/Request";

export class ProductDetailApi {
    static getAll = (params) => {
        return request({
            method: "get",
            url: "/admin/product-details",
            params: params
        });
    }

    static getOne = (id) => {
        return request({
            method: "get",
            url: `/admin/product-details/${id}`
        });
    }

    static getOneByProduct = (id) => {
        return request({
            method: "get",
            url: `/admin/product-details/product/${id}`
        });
    }

    static addListProduct = (data) => {
        return request({
            method: "post",
            url: "/admin/product-details",
            data: data,
        });
    };

    static updateListProduct = (data) => {
        return request({
            method: "PUT",
            url: `/admin/product-details/list-data`,
            data: data,
        });
    };

    static update = (id, data) => {
        return request({
            method: "put",
            url: `/admin/product-details/${id}`,
            data: data
        });
    }

    static delete = (id) => {
        return request({
            method: "delete",
            url: `/admin/product-details/${id}`
        });
    }

    static getOneClient = (id) => {
        return request({
            method: "get",
            url: `/admin/product-details/client/${id}`
        })
    }

}