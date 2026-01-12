import { filter } from "lodash";
import { request } from "../../../config/Request";

export class SizeApi {
    static getAllSize = (filter) => {
        return request({ method: "get", url: "/admin/size", params: filter });
    }

    static createSize = (data) => {
        return request({ method: "post", url: "/admin/size", data: data });
    }

    static updateSize = (id, data) => {
        return request({ method: "post", url: `/admin/size/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/size/${id}` });
    }

    static getOneByName = (name) => {
        return request({ method: "get", url: `/admin/size/name/${name}` });
    }

}