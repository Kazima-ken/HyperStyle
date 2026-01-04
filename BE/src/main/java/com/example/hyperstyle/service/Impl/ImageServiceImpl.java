package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.entity.Image;
import com.example.hyperstyle.repository.ImageRepository;
import com.example.hyperstyle.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // 1. Lombok sẽ tự tạo Constructor cho các biến final
public class ImageServiceImpl implements ImageService {

    // 2. Thay @Autowired bằng private final
    private final ImageRepository imageRepository;

    @Override
    public List<Image> getAllByProductId(String id) {
        return imageRepository.getAllByProduct(id);
    }
}
