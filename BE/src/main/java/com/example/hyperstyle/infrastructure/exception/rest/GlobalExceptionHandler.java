package com.example.hyperstyle.infrastructure.exception.rest;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bắt lỗi RestApiException do bạn tự ném ra (VD: Trùng mã SP)
    @ExceptionHandler(RestApiException.class)
    public ResponseEntity<?> handleRestApiException(RestApiException ex) {
        // Trả về đối tượng ResponseObject hoặc Map đơn giản
        // Ở đây mình trả về Map cho nhanh, bạn có thể bọc trong ResponseObject.error(...)
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", "FAIL");
        errorResponse.put("message", ex.getMessage());

        // Trả về HTTP Code 400 (Bad Request) thay vì 500
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // Bắt lỗi Validate (@NotBlank, @NotNull...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("status", "FAIL");
        response.put("message", "Lỗi dữ liệu đầu vào");
        response.put("errors", errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}

