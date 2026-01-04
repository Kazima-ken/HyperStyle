package com.example.hyperstyle.service;

import com.example.hyperstyle.dto.request.color.CreateColorRequest;
import com.example.hyperstyle.dto.request.color.GetColorRequest;
import com.example.hyperstyle.dto.request.color.UpdateColorRequest;
import com.example.hyperstyle.dto.response.color.ColorResponse;
import com.example.hyperstyle.entity.Color;
import jakarta.validation.Valid;

import java.util.List;

public interface ColorService {

    List<ColorResponse> getAllColor(final GetColorRequest request);

    Color createColor(@Valid final CreateColorRequest request);

    Color updateColor(@Valid final UpdateColorRequest request);

    Boolean deleteColor(String id);

    Color getOneById(String id);

    List<Color> getAllCode();

    Color getOneByCode(String code);

}
