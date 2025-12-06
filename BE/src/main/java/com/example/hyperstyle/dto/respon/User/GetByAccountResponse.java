package com.example.hyperstyle.dto.respon.User;

import org.springframework.beans.factory.annotation.Value;

public interface GetByAccountResponse {
    @Value("#{target.id}")
    String getId();
}
