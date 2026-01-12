import { filter } from "lodash";
import { request } from "../../../config/Request";

export class ColorApi {
    static getAllcolor = (filter) => {
        return request({ method: "get", url: "/admin/color", params: filter });
    }

    static createcolor = (data) => {
        return request({ method: "post", url: "/admin/color", data: data });
    }

    static updatecolor = (id, data) => {
        return request({ method: "post", url: `/admin/color/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/color/${id}` });
    }

    static getAllCode = () => {
        return request({ method: "get", url: `/admin/color/code` });
    }

    static getOneByColorCode = (colorCode) => {
        return request({ method: "get", url: `/admin/color/code/${colorCode}` });
    }

}