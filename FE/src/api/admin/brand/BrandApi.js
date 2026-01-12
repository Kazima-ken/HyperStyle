import { filter } from "lodash";
import { request } from "../../../config/Request";

export class BrandApi {
    static getAllBrand = (filter) => {
        return request({ method: "get", url: "/admin/brand", params: filter, });
    }

    static createBrand = (data) => {
        return request({ method: "post", url: "/admin/brand", data: data });
    }

    static updateBrand = (id, data) => {
        return request({ method: "post", url: `/admin/brand/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/brand/${id}` });
    }

}