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
    public Color createColor(@Valid CreateColorRequest request) {

        Color check = colorRepository.findByName(request.getName());

        if (check != null) {
            throw new RestApiException("Color Đã Tồn Tại");
        }

        Color color = new Color();
        color.setCode(request.getCode());
        color.setName(request.getName());
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
        if(color == null){
            throw new RestApiException("Color Không Tồn Tại");
        }
        return color;
    }
}
