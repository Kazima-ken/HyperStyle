package com.example.hyperstyle.infrastructure.exception.rest;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RestApiException.class)
    public ResponseEntity<ErrorResponse> handleRestApiException(RestApiException ex) {
        return ResponseEntity.badRequest().body(
                new ErrorResponse(
                        HttpStatus.BAD_REQUEST.value(),
                        ex.getMessage(),
                        LocalDateTime.now()
                )
        );
    }

//    @ExceptionHandler(CustomException.class)
//    public ResponseEntity<?> handleCustomException(CustomException ex) {
//
//        return ResponseEntity
//                .status(ex.getStatusCode() != null ? ex.getStatusCode() : 400)
//                .body(ex.getErrors());
//    }
}

