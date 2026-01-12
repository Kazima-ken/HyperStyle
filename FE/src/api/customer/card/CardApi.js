import { request, requestAdress } from "../../../config/Request";

export class CartApi {
    static addCart = (data) => {
        return request({
            method: "POST",
            url: `/cart`,
            data: data
        });
    };
    static listCart = (idAccount) => {
        return request({
            method: "GET",
            url: `/cart/${idAccount}`,
        });
    };
    static quantityInCart = (idAccount) => {
        return request({
            method: "GET",
            url: `/cart/quantityInCart/${idAccount}`,
        });
    };

    static deleteCartDetail = (idCart) => {
        return request({
            method: "DELETE",
            url: `/cart/${idCart}`,
        });
    };
    static deleteAllCartDetail = (idAccount) => {
        return request({
            method: "DELETE",
            url: `/cart/deleteAll/${idAccount}`,
        });
    };

}

