
import { request } from "../../../config/Request";
export class BillApi {
  static getAllStatusBill = () => {
    return request({
      method: "GET",
      url: `/admin/bill/status-bill`,
    });
  };

  static getAll = (filter) => {
    return request({
      method: "GET",
      url:
        `/admin/bill?startTimeString=` +
        filter.startTimeString +
        `&endTimeString=` +
        filter.endTimeString +
        `&status=` +
        filter.status +
        `&endDeliveryDateString=` +
        filter.endDeliveryDateString +
        `&startDeliveryDateString=` +
        filter.startDeliveryDateString +
        `&key=` +
        filter.key +
        `&employees=` +
        filter.employees +
        `&user=` +
        filter.user +
        `&phoneNumber=` +
        filter.phoneNumber +
        `&type=` +
        filter.type +
        `&page=` +
        filter.page,
    });
  };

  static getAllProductsInBillByIdBill = (data) => {
    return request({
      method: "GET",
      url: `/admin/bill-detail`,
      params: data,
    });
  };

  static getDetailBill = (id) => {
    return request({
      method: "GET",
      url: `/admin/bill/detail/` + id,
    });
  };

  static getAllHistoryInBillByIdBill = (id) => {
    return request({
      method: "GET",
      url: `/admin/bill-history/` + id,
    });
  };

  static getCountPayMentPostpaidByIdBill = (id) => {
    return request({
      method: "GET",
      url: `/admin/bill/count-paymet-post-paid/${id}`,
    });
  };

  static UpdateShipBill = (data) => {
    return request({
      method: "POST",
      url: `/admin/bill/ship-bill`,
      data: data,
    });
  };

  static changeStatusBill = (id, data) => {
    return request({
      method: "PUT",
      url: `/admin/bill/change-status/` + id,
      data: data, // <--- SỬA THÀNH DATA: để đẩy dữ liệu vào Body JSON
    });
  };

  static BillGiveBack = (idBill) => {
    return request({
      method: "GET",
      url: `/admin/bill/give-back?idBill=${idBill}`,
    });
  };

  static Create = (data) => {
    return request({
      method: "POST",
      url: `/admin/bill`,
      data: data,
    });
  }

}
