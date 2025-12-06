package com.matchme.controllers;

import com.matchme.dto.LoginDTO;
import com.matchme.dto.LoginResponseDTO;
import com.matchme.dto.RegisterDTO;
import com.matchme.dto.RegisterResponseDTO;
import com.matchme.entities.Profile;
import com.matchme.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v1/api/auth")
public class AuthController {

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Register a new user
    @PostMapping("/register")
    // Adding @Valid before @RequestBody tells Spring Boot to trigger the validation annotations inside the RegisterDTO
    // If validation fails, it will automatically return a 400 Bad Request error
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        Profile saved = authService.register(registerDTO);
        // Convert the saved Profile entity to a safe DTO for the API response
        RegisterResponseDTO responseDto = RegisterResponseDTO.fromProfile(saved);
        // Return the DTO in a ResponseEntity with an HTTP 201 Created status
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }
    // Endpoint for user login, validate the credentials, returns a JWT if success
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginResponseDTO responseDto = authService.login(loginDTO);
        return new ResponseEntity<>(responseDto, HttpStatus.OK);
    }
}
