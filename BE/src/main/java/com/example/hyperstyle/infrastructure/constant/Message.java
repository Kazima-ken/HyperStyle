package com.example.hyperstyle.infrastructure.constant;

public enum Message {

    SUCCESS("Success"),
    ERROR_UNKNOWN("Error Unknown"),
    LOGIN_FAIL("Tài khoản hoặc mật khẩu không đúng"),
    EMAIL_FAIL("Email hoặc mật khẩu không hợp lệ");




    private String message;

    Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}
