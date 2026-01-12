import { filter } from "lodash";
import { request } from "../../../config/Request";

export class SoleApi {
    static getAllsole = (filter) => {
        return request({ method: "get", url: "/admin/sole", params: filter });
    }

    static createsole = (data) => {
        return request({ method: "post", url: "/admin/sole", data: data });
    }

    static updatesole = (id, data) => {
        return request({ method: "post", url: `/admin/sole/${id}`, data: data });
    }

    static getOne = (id) => {
        return request({ method: "get", url: `/admin/sole/${id}` });
    }

}