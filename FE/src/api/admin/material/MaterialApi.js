import { filter } from "lodash";
import { request } from "../../../config/Request";

export class MaterialApi {
    static getAllMaterial = (filter) => {
        return request({ method: "get", url: "/admin/material", params: filter });
    }

    static createMaterial = (data) => {
        return request({ method: "post", url: "/admin/material", data: data });
    }

    static updateMaterial = (id, data) => {
        return request({ method: "post", url: `/admin/material/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/material/${id}` });
    }

}