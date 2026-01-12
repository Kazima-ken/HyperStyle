import { request, requestAdress } from "../../../config/Request";
export class AddressApi {
    static a = (filter) => {
        return request({
            method: "GET",
            url: `/admin/address`,
            params: filter,
        });
    };

    static getAllAddressByUser = (idUser) => {
        return request({
            method: "GET",
            url: `/admin/address/address-user/${idUser}`,
        });
    };

    static getAllProvince = () => {
        return requestAdress({
            method: "GET",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
            },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        });
    };
    static getAllProvinceDistricts = (codeProvince) => {
        return requestAdress({
            method: "GET",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
            },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
            params: { province_id: codeProvince },
        });
    };
    static getAllProvinceWard = (codeDistrict) => {
        return requestAdress({
            method: "GET",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
            },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
            params: { district_id: codeDistrict },
        });
    };

    static getMoneyShip = (to_district_id, to_ward_code) => {
        return requestAdress({
            method: "GET",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
                shop_id: "5593709",
            },
            url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee`,
            params: {
                service_type_id: 2,
                insurance_value: "",
                coupon: "",
                from_district_id: 1450,
                to_district_id: to_district_id,
                to_ward_code: to_ward_code,
                height: 15,
                length: 15,
                weight: 1000,
                width: 15,
                from_ward_code: "22372"
            },
        });
    };

    static getDayShip = (to_district_id, to_ward_code) => {
        return requestAdress({
            method: "GET",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
                shop_id: "5593709",
            },
            url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
            params: {
                from_district_id: 1450,
                from_ward_code: "22372",
                to_district_id: to_district_id,
                to_ward_code: to_ward_code,
                service_id: 53320,
            },
        });
    };


    static create = (data) => {
        return request({
            method: "POST",
            url: `/admin/address`,
            data: data,
        });
    };

    static getAddressByUserIdAndStatus = (id) => {
        return request({
            method: "GET",
            url: `/admin/address/address-user-status/${id}`,
        });
    };

}
export default AddressApi;