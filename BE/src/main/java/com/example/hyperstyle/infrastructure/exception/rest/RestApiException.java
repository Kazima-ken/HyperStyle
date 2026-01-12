package com.example.hyperstyle.infrastructure.exception.rest;

import com.example.hyperstyle.infrastructure.constant.Message;

public class RestApiException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private String message;

    public RestApiException() {
        super();
    }

    public RestApiException(Message status) {
        super(status.getMessage());
    }

    public RestApiException(String message) {
        super(message);
    }

    public void setMessage(String message) {
        this.message = message;
    }
}