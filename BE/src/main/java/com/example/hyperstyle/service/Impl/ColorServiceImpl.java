package com.example.hyperstyle.service.Impl;

import com.example.hyperstyle.dto.request.color.CreateColorRequest;
import com.example.hyperstyle.dto.request.color.GetColorRequest;
import com.example.hyperstyle.dto.request.color.UpdateColorRequest;
import com.example.hyperstyle.dto.response.color.ColorResponse;
import com.example.hyperstyle.entity.Color;
import com.example.hyperstyle.infrastructure.exception.rest.RestApiException;
import com.example.hyperstyle.repository.ColorRepository;
import com.example.hyperstyle.service.ColorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColorServiceImpl implements ColorService {

    @Autowired
    ColorRepository colorRepository;

    @Override
    public List<ColorResponse> getAllColor(GetColorRequest request) {
        return colorRepository.getAll(request);
    }

    @Override
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu
    public Color createColor(@Valid CreateColorRequest request) {
        // 1. Chuẩn hóa dữ liệu đầu vào (Loại bỏ khoảng trắng thừa, viết hoa mã Hex)
        String trimName = request.getName().trim();
        String formattedCode = request.getCode().trim().toUpperCase();

        // 2. Kiểm tra trùng tên (Bỏ qua hoa thường để chính xác hơn)
        if (colorRepository.existsByNameIgnoreCase(trimName)) {
            throw new RestApiException("Tên màu sắc '" + trimName + "' đã tồn tại!");
        }

        // 3. Kiểm tra trùng mã màu (Quan trọng: Tránh 1 màu có nhiều tên gây rối kho)
        if (colorRepository.existsByCodeIgnoreCase(formattedCode)) {
            throw new RestApiException("Mã màu '" + formattedCode + "' đã được sử dụng!");
        }

        // 4. Mapping dữ liệu
        Color color = new Color();
        color.setCode(formattedCode);
        color.setName(trimName);
        color.setStatus(request.getStatus());

        return colorRepository.save(color);
    }

    @Override
    public Color updateColor(@Valid UpdateColorRequest request) {
        Color update = colorRepository.findById(request.getId())
                .orElseThrow(() -> new RestApiException("Color Không Tồn Tại"));

        Color check = colorRepository.findByName(request.getName());
        if (check != null) {
            throw new RestApiException("Color Đã Tồn Tại");
        }

        update.setCode(request.getCode());
        update.setName(request.getName());
        update.setStatus(request.getStatus());

        return colorRepository.save(update);
    }

    @Override
    public Boolean deleteColor(String id) {

        Color color = colorRepository.findById(id).orElseThrow(() -> new RestApiException("Color Không Tồn Tại"));
        colorRepository.delete(color);

        return true;
    }

    @Override
    public Color getOneById(String id) {
        Color color = colorRepository.findById(id).orElseThrow(() -> new RestApiException("Color Không Tồn Tại"));
        return color;
    }

    @Override
    public List<Color> getAllCode() {

        return colorRepository.getAllCode();
    }

    @Override
    public Color getOneByCode(String code) {
        Color color = colorRepository.getOneByCode(code);
        if (color == null) {
            throw new RestApiException("Color Không Tồn Tại");
        }
        return color;
    }
}
