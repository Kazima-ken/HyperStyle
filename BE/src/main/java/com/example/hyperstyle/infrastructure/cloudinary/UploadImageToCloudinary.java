package com.example.hyperstyle.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.example.hyperstyle.dto.request.image.ImageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service // 1. Đổi thành Service
public class UploadImageToCloudinary {

    @Autowired
    private Cloudinary cloudinary;

    // 2. Bỏ @Async ở đây đi (Vì bên trong bạn đã tự xử lý bất đồng bộ rồi)
    public CompletableFuture<List<CloudinaryResult>> uploadImagesAsync(List<ImageRequest> fileDTOs) {

        List<CompletableFuture<CloudinaryResult>> futures = fileDTOs.stream()
                .map(fileDTO -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String publicId = UUID.randomUUID().toString();
                        Map<String, String> imageUploadData = new HashMap<>();
                        imageUploadData.put("public_id", publicId);

                        // Lưu ý: getBytes() có thể ném IOException
                        Map result = cloudinary.uploader().upload(fileDTO.getFiles().getBytes(), imageUploadData);

                        String url = (String) result.get("url");
                        String color = fileDTO.getColor();

                        return new CloudinaryResult(url, color);
                    } catch (IOException e) {
                        // Ném exception để CompletableFuture biết task này bị lỗi
                        throw new RuntimeException("Lỗi upload ảnh: " + e.getMessage());
                    }
                }))
                .collect(Collectors.toList());

        // Gom tất cả các luồng lại
        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
                .thenApply(v -> futures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList()));
    }

    // ... Các hàm khác giữ nguyên ...
}
