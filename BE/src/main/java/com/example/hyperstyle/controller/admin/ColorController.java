package com.example.hyperstyle.controller.admin;

import com.example.hyperstyle.dto.request.color.CreateColorRequest;
import com.example.hyperstyle.dto.request.color.GetColorRequest;
import com.example.hyperstyle.dto.request.color.UpdateColorRequest;
import com.example.hyperstyle.service.ColorService;
import com.example.hyperstyle.util.ResponseObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/color")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ColorController {

    @Autowired
    private final ColorService colorService;

    @GetMapping
    public ResponseObject<?> getAll(@ModelAttribute GetColorRequest request) {
        return ResponseObject.success(colorService.getAllColor(request));
    }

    @GetMapping("{id}")
    public ResponseObject<?> getOneById(@PathVariable("id") String id) {
        return ResponseObject.success(colorService.getOneById(id));
    }

    @PostMapping
    public ResponseObject<?> create(@RequestBody CreateColorRequest request) {
        return ResponseObject.success(colorService.createColor(request));
    }

    @PostMapping("/{id}")
    public ResponseObject<?> update(@RequestBody UpdateColorRequest request, @PathVariable("id") String id) {
        request.setId(id);
        return ResponseObject.success(colorService.updateColor(request));
    }

    @DeleteMapping("{id}")
    public ResponseObject<?> delete(@PathVariable("id") String id) {
        return ResponseObject.success(colorService.deleteColor(id));
    }

    @GetMapping("/code")
    public ResponseObject<?> getAllCode() {
        return ResponseObject.success(colorService.getAllCode());
    }

    @GetMapping("/code/{code}")
    public ResponseObject<?> getOneCode(@PathVariable("code") String code) {
        String formattedCode = code.startsWith("#") ? code : "#" + code;

        return ResponseObject.success(colorService.getOneByCode(formattedCode));
    }

}
