package com.example.hyperstyle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class HyperstyleApplication {

    public static void main(String[] args) {
        SpringApplication.run(HyperstyleApplication.class, args);
    }

}
