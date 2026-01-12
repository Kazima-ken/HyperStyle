import { filter } from "lodash";
import { request } from "../../../config/Request";

export class CategoryApi {
    static getAllCategories = (filter) => {
        return request({ method: "get", url: "/admin/category", params: filter });
    }

    static createCategory = (data) => {
        return request({ method: "post", url: "/admin/category", data: data });
    }

    static updateCategory = (id, data) => {
        return request({ method: "post", url: `/admin/category/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/category/${id}` });
    }


}