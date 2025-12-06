package com.example.hyperstyle.infrastructure.exception.rest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.validation.ObjectError;

import java.util.List;

@Getter
@Setter
public class CustomException extends Exception {

    private Integer statusCode;
    private List<ObjectError> errors;

    public CustomException(Integer statusCode, List<ObjectError> errors) {
        super(errors != null && !errors.isEmpty()
                ? errors.get(0).getDefaultMessage()
                : "Validation error");
        this.statusCode = statusCode;
        this.errors = errors;
    }
}



