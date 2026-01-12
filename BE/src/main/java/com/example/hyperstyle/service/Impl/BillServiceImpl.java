package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.Payment.CreatePaymentsMethodRequest;
import com.example.hyperstyle.dto.request.bill.BillRequest;
import com.example.hyperstyle.dto.request.bill.ChangeStatusBillRequest;
import com.example.hyperstyle.dto.request.bill.CreateBillDetailRequest;
import com.example.hyperstyle.dto.request.bill.CreateBillRequest;
import com.example.hyperstyle.dto.response.ShipRequest;
import com.example.hyperstyle.dto.response.bill.BillResponse;
import com.example.hyperstyle.dto.response.bill.BillReturnedResponse;
import com.example.hyperstyle.dto.response.bill.FindBillByStatusRespose;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.entity.Bill;
import com.example.hyperstyle.entity.BillDetail;
import com.example.hyperstyle.entity.BillHistory;
import com.example.hyperstyle.entity.PaymentsMethod;
import com.example.hyperstyle.entity.ProductDetail;
import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.infrastructure.constant.BillStatus;
import com.example.hyperstyle.infrastructure.constant.BillType;
import com.example.hyperstyle.infrastructure.constant.Message;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.AccountRepository;
import com.example.hyperstyle.repository.BillDetailRepository;
import com.example.hyperstyle.repository.BillHistoryRepository;
import com.example.hyperstyle.repository.BillRepository;
import com.example.hyperstyle.repository.PaymentsMethodRepository;
import com.example.hyperstyle.repository.ProductDetailRepository;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.service.BillService;
import com.example.hyperstyle.util.ResponseObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private BillDetailRepository billDetailRepository;
    @Autowired
    private PaymentsMethodRepository paymentsMethodRepository;
    @Autowired
    private BillHistoryRepository billHistoryRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public List<BillResponse> getAll(String email, BillRequest request) {

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email: " + email));

        // Xử lý ngày tháng (giữ nguyên code của bạn)
        if (request.getEndDate() != null) {
            request.setEndDate(atEndOfDay(request.getEndDate()));
        }
        if (request.getEndDeliveryDate() != null) {
            request.setEndDeliveryDate(atEndOfDay(request.getEndDeliveryDate()));
        }

        // --- SỬA LOGIC STATUS TẠI ĐÂY ---
        if (request.getStatus() != null && !request.getStatus().isEmpty()) {
            // Nếu có chọn trạng thái -> Gán cờ hiệu để SQL biết là KHÁC NULL
            request.setConverStatus("0"); // Giá trị chuỗi bất kỳ, miễn không phải null
        } else {
            // Nếu không chọn gì -> Gán status = null và converStatus = null
            request.setStatus(null);
            request.setConverStatus(null);
        }
        // --------------------------------

        return billRepository.getAll(account.getId(), account.getRoles().name(), request);
    }

    private Date atEndOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    @Override
    public List<FindBillByStatusRespose> getAllSatusBill() {
        return billRepository.countBillByStatus();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
// 1. Đổi tên tham số idStaff -> staffEmail cho đúng bản chất
    public Bill create(String staffEmail, CreateBillRequest request) {

        // --- SỬA ĐOẠN NÀY ---
        // Vì Controller truyền Email, nên phải tìm bằng findByEmail
        Account staff = accountRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại hoặc Token không hợp lệ: " + staffEmail));
        // --------------------

        // Lấy tên nhân viên an toàn
        String staffName = (staff.getUser() != null) ? staff.getUser().getFullName() : staff.getEmail();

        // 2. Tạo Bill
        Bill bill = new Bill();
        bill.setCode(request.getCode());
        bill.setStaff(staff);
        bill.setCreateBy(staffName);

        // Xử lý khách hàng (Khách hàng thì vẫn tìm theo ID như cũ là đúng, vì FE gửi ID lên)
        if (request.getIdUser() != null && !request.getIdUser().isEmpty()) {
            Account customer = accountRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy Tài khoản khách hàng có ID: " + request.getIdUser()));

            bill.setAccount(customer);
        }

        bill.setUserName(request.getUserName());
        bill.setPhoneNumber(request.getPhoneNumber());
        bill.setAddress(request.getAddress());
        bill.setNote(request.getNote());
        bill.setEmail(request.getEmail());

        // Xử lý tiền
        try {
            // Lưu ý: Request gửi String nên cần convert, thêm check null nếu cần
            BigDecimal totalMoney = request.getTotalMoney() != null ? new BigDecimal(request.getTotalMoney()) : BigDecimal.ZERO;
            BigDecimal moneyShip = request.getMoneyShip() != null ? new BigDecimal(request.getMoneyShip()) : BigDecimal.ZERO;

            bill.setTotalMoney(totalMoney);
            bill.setMoneyShip(moneyShip);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Lỗi định dạng tiền tệ: Vui lòng kiểm tra lại số tiền");
        }

        try {
            bill.setType(BillType.valueOf(request.getTypeBill()));
        } catch (IllegalArgumentException | NullPointerException e) {
            bill.setType(BillType.ONLINE);
        }

        BillStatus initialStatus = BillStatus.CHO_XAC_NHAN;
        bill.setBillStatus(initialStatus);

        // Xử lý ngày giao hàng
        if (request.getDeliveryDate() != null && !request.getDeliveryDate().isEmpty()) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                bill.setShippingDate(sdf.parse(request.getDeliveryDate()));
            } catch (ParseException e) {
                // Log lỗi nhưng không chặn luồng, hoặc ném lỗi tùy nghiệp vụ
                System.err.println("Lỗi parse ngày giao hàng: " + e.getMessage());
            }
        }

        bill.setCreatedDate(LocalDateTime.now());

        // --- LƯU BILL ---
        Bill savedBill = billRepository.save(bill);

        // 3. GHI LỊCH SỬ
        BillHistory history = new BillHistory();
        history.setBill(savedBill);
        history.setStaff(staff);
        history.setActionDescription("Tạo mới hóa đơn");
        history.setBillStatus(initialStatus);
        history.setCreatedBy(staffName);
        history.setCreatedDate(LocalDateTime.now()); // Nên set thời gian tạo
        billHistoryRepository.save(history);

        // 4. Xử lý Bill Detail
        if (request.getBillDetailRequests() != null) {
            for (CreateBillDetailRequest detailReq : request.getBillDetailRequests()) {
                ProductDetail productDetail = productDetailRepository.findById(detailReq.getIdProduct())
                        .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại ID: " + detailReq.getIdProduct()));

                if (productDetail.getQuantity() < detailReq.getQuantity()) {
                    throw new RuntimeException("Sản phẩm " + productDetail.getCode() + " không đủ số lượng trong kho");
                }

                // Trừ kho
                productDetail.setQuantity(productDetail.getQuantity() - detailReq.getQuantity());
                productDetailRepository.save(productDetail);

                // Tạo BillDetail
                BillDetail billDetail = new BillDetail();
                billDetail.setBill(savedBill);
                billDetail.setProductDetail(productDetail);
                billDetail.setQuantity(detailReq.getQuantity());
                // Check null price
                billDetail.setPrice(detailReq.getPrice() != null ? new BigDecimal(detailReq.getPrice()) : BigDecimal.ZERO);
                billDetail.setBillStatus(initialStatus);

                billDetailRepository.save(billDetail);
            }
        }

        // 5. Xử lý Thanh toán
        if (request.getPaymentsMethodRequests() != null) {
            for (CreatePaymentsMethodRequest paymentReq : request.getPaymentsMethodRequests()) {
                PaymentsMethod payment = new PaymentsMethod();
                payment.setBill(savedBill);
                payment.setEmployees(staff);
                payment.setMethod(paymentReq.getMethod());
                payment.setTotalMoney(paymentReq.getTotalMoney());
                payment.setDescription(paymentReq.getActionDescription());
                payment.setPaymentStatus(paymentReq.getStatus());
                payment.setVnpTransaction(paymentReq.getTransaction());
                payment.setCreatedBy(staffName);

                paymentsMethodRepository.save(payment);
            }
        }

        return savedBill;
    }

    @Override
    public Bill getOneByid(String id) {
        Optional<Bill> bill = billRepository.findById(id);
        if (!bill.isPresent()) {
            throw new RestApiException("Bill Không tồn tại");
        }
        return bill.get();
    }

    @Override
    public boolean getShipBill(ShipRequest request) {
        Optional<Bill> optional = billRepository.findById(request.getIdBill());
        optional.get().setMoneyShip(request.getShip());
        billRepository.save(optional.get());
        return true;
    }

    @Override
    public int countPayMentPostpaidByIdBill(String id) {
        return paymentsMethodRepository.countPayMentPostpaidByIdBill(id);
    }

    @Override
    public List<BillReturnedResponse> getBillReturned(String idBill) {
        return billRepository.getBillReturned(idBill);
    }

    @Override
    @Transactional
    public Bill changedStatusbill(String id, String emailStaff, ChangeStatusBillRequest request) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RestApiException("Hóa đơn không tồn tại"));

        Account account = accountRepository.findByEmail(emailStaff)
                .orElseThrow(() -> new RestApiException("Nhân viên không tồn tại"));

        // Lấy trạng thái mới từ Request gửi lên
        BillStatus inputStatus = request.getNewStatus();

        if (inputStatus == null) {
            throw new RestApiException("Trạng thái mới không được để trống");
        }

        // --- VALIDATE LOGIC HỦY ĐƠN ---
        // Nếu client gửi lên là DA_HUY, cần kiểm tra xem có được hủy không
        if (inputStatus == BillStatus.DA_HUY) {
            if (bill.getBillStatus() == BillStatus.THANH_CONG ||
                    bill.getBillStatus() == BillStatus.VAN_CHUYEN) {
                throw new RestApiException("Đơn hàng đang giao hoặc đã xong, không thể hủy");
            }
        }

        // --- CẬP NHẬT TRẠNG THÁI ---
        bill.setBillStatus(inputStatus);

        // --- CẬP NHẬT NGÀY THÁNG TƯƠNG ỨNG VỚI TRẠNG THÁI ---
        Date now = new Date();

        switch (inputStatus) {
            case XAC_NHAN:
                bill.setConfirmationDate(now);
                break;

            case VAN_CHUYEN: // Hoặc CHO_VAN_CHUYEN tùy quy trình
                bill.setShippingDate(now);
                break;

            case DA_THANH_TOAN:
                bill.setReceiveDate(now);
                break;

            case THANH_CONG:
                bill.setCompletionDate(now);
                paymentsMethodRepository.updateAllByIdBill(id);
                // Logic cộng điểm user...
                break;

            default:
                // Các trạng thái khác (TAO_HOA_DON, TRA_HANG...) không cần set ngày đặc biệt
                break;
        }

        // --- LƯU LỊCH SỬ ---
        bill.setStaff(account);
        BillHistory billHistory = new BillHistory();
        billHistory.setBill(bill);
        billHistory.setBillStatus(inputStatus); // Lưu trạng thái mới vào lịch sử
        billHistory.setActionDescription(request.getActionDescription());
        billHistory.setStaff(account);
        billHistoryRepository.save(billHistory);

        Bill savedBill = billRepository.save(bill);

        // Gửi thông báo socket
        messagingTemplate.convertAndSend("/app/admin-notifications", ResponseObject.success(true));

        return savedBill;
    }


}
