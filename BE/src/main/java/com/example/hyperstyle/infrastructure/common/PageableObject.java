package com.example.hyperstyle.infrastructure.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

@Setter
@Getter
@AllArgsConstructor
public class PageableObject<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

    public PageableObject(Page<T> page){
        this.content =page.getContent();
        this.page =page.getNumber();
        this.size =page.getSize();
        this.totalElements =page.getTotalElements();
        this.totalPages =page.getTotalPages();
    }

}
