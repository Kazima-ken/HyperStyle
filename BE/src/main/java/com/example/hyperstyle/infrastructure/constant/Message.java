package com.example.hyperstyle.infrastructure.constant;

public enum Message {

    SUCCESS("Success"),
    ERROR_UNKNOWN("Error Unknown");

    
    private String message;

    Message(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

}
