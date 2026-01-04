package com.example.hyperstyle.util;

import com.example.hyperstyle.infrastructure.common.PageableObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

@Getter
@Setter
@NoArgsConstructor
public class ResponseObject<T> {

    private boolean success;
    private String message;
    private T data;

    private ResponseObject(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    public static <T> ResponseObject<T> success(T data) {
        return new ResponseObject<>(true, "Thành công", data);
    }

    public static <T> ResponseObject<T> success(String message, T data) {
        return new ResponseObject<>(true, message, data);
    }

    public static <T> ResponseObject<PageableObject<T>> success(Page<T> page) {
        return new ResponseObject<>(
                true,
                "Thành công",
                new PageableObject<>(page)
        );
    }

    public static <T> ResponseObject<T> error(String message) {
        return new ResponseObject<>(false, message, null);
    }
}

