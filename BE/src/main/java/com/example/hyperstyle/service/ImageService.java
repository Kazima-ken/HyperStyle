package com.example.hyperstyle.service;

import com.example.hyperstyle.entity.Image;

import java.util.List;

public interface ImageService {

    List<Image> getAllByProductId(String id);

}
