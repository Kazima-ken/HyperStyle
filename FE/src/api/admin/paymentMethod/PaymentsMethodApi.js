import { request } from "../../../config/Request";

export class PaymentsMethodApi {

    static findByIdBill = (id) => {
        return request({
            method: "GET",
            url: `/admin/payment-method/bill/` + id,
        });
    };


}
