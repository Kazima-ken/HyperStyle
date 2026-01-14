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

        static getAllAddressByAccount = (idAccount) => {
        return request({
            method: "GET",
            url: `/admin/address/address-account/${idAccount}`,
        });
    };



    static create = (data) => {
        return request({
            method: "POST",
            url: `/admin/address`,
            data: data,
        });
    };

    static createByAccount = (data) => {
        return request({
            method: "POST",
            url: `/admin/address/account`,
            data: data,
        });
    };

    static getAddressByUserIdAndStatus = (id) => {
        return request({
            method: "GET",
            url: `/admin/address/address-user-status/${id}`,
        });
    };

    static getAddressByUserIdAccountAndStatus = (id) => {
        return request({
            method: "GET",
            url: `/admin/address/address-account-status/${id}`,
        });
    };

    static getAllProvince = () => {
        return requestAdress({
            method: "GET",
            headers: { token: "e497593c-ae67-11f0-9ad4-42983ef74521" },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/province`,
        });
    };

    static getAllProvinceDistricts = (codeProvince) => {
        return requestAdress({
            method: "GET",
            headers: { token: "e497593c-ae67-11f0-9ad4-42983ef74521" },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/district`,
            params: { province_id: codeProvince },
        });
    };

    static getAllProvinceWard = (codeDistrict) => {
        return requestAdress({
            method: "GET",
            headers: { token: "e497593c-ae67-11f0-9ad4-42983ef74521" },
            url: `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
            params: { district_id: codeDistrict },
        });
    };

    static getAvailableServices = (shop_id, from_district, to_district) => {
        return requestAdress({
            method: "POST",
            url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
            headers: { token: "e497593c-ae67-11f0-9ad4-42983ef74521" },
            data: {
                shop_id: parseInt(shop_id),
                from_district: parseInt(from_district),
                to_district: parseInt(to_district),
            },
        });
    };

    // 2. Tính phí ship (Nhận service_id động)
    static calculateFee = (shop_id, service_id, insurance_value, to_district_id, to_ward_code) => {
        return requestAdress({
            method: "GET",
            url: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
                shop_id: parseInt(shop_id),
            },
            params: {
                service_id: service_id, // Truyền ID lấy từ API trên vào đây
                insurance_value: insurance_value,
                coupon: null,
                from_district_id: 1450,
                to_district_id: parseInt(to_district_id),
                to_ward_code: to_ward_code,
                height: 15, length: 15, weight: 1000, width: 15,
            },
        });
    };

    // 3. Tính ngày giao hàng (Nhận service_id động)
    static getDayShip = (to_district_id, to_ward_code, service_id) => {
        return requestAdress({
            method: "GET",
            url: `https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime`,
            headers: {
                token: "e497593c-ae67-11f0-9ad4-42983ef74521",
                shop_id: 5593709,
            },
            params: {
                from_district_id: 3440,      // Sửa thành 3440 (Bắc Từ Liêm)
                from_ward_code: "13010",
                to_district_id: parseInt(to_district_id),
                to_ward_code: to_ward_code,
                service_id: service_id, // Bắt buộc phải có service_id đúng tuyến
            },
        });
    };



}

export default AddressApi;