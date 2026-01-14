package com.example.hyperstyle.dto.request.customer;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
public class UpdateByUserClient {

    private String id;

    private String fullName;

    private Date dateOfBirth;

    private String phoneNumber;

    private String email;

    private Boolean gender;

    private MultipartFile avata;
}
