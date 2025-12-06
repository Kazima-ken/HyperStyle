package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.User;
import com.example.hyperstyle.entity.Account;
import com.example.hyperstyle.repository.UserRepository;
import com.example.hyperstyle.infrastructure.constant.Roles;
import com.example.hyperstyle.infrastructure.constant.Status;
import com.example.hyperstyle.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;

    // CREATE CUSTOMER (Giả định mật khẩu cần được mã hóa sau)
    public User createCustomer(User user, String rawPassword) {

        User savedUser = userRepository.save(user);

        Account account = new Account();
        account.setUser(savedUser);
        account.setEmail(savedUser.getEmail());
        account.setPassword(rawPassword); // Cần mã hóa bằng PasswordEncoder
        account.setRoles(Roles.ROLE_USER);
        account.setStatus(Status.DANG_SU_DUNG);

        accountRepository.save(account);

        return savedUser;
    }

    // READ - GET ALL CUSTOMERS
    public List<User> getAllCustomers() {
        return accountRepository.findByRoles(Roles.ROLE_USER)
                .stream()
                .map(Account::getUser)
                .collect(Collectors.toList());
    }

    // READ - GET CUSTOMER BY ID
    public Optional<User> getCustomerById(String id) {
        return userRepository.findById(id);
    }

    // UPDATE CUSTOMER
    public User updateCustomer(String id, User updated) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // SỬA LỖI NAME và PHONE
        user.setFullName(updated.getFullName());
        user.setPhoneNumber(updated.getPhoneNumber());
        // user.setAddress(updated.getAddress()); // TẠM BỎ HOẶC THAY BẰNG cccd
        user.setEmail(updated.getEmail());

        return userRepository.save(user);
    }

    // DELETE CUSTOMER
    public void deleteCustomer(String userId) {
        // Cần thêm findByUser_Id vào AccountRepository
        Account account = accountRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Account not found for user: " + userId));

        accountRepository.delete(account);
        userRepository.deleteById(userId);
    }
}