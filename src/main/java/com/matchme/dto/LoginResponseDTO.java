package com.matchme.dto;

public class LoginResponseDTO {
    private final String token; // To hold the JWT ("dummy-jwt-token" for now)
    private final Long userId;
    private final String firstName; // So the UI can immediately display a welcome message

    public LoginResponseDTO(String token, Long userId, String firstName) {
        this.token = token;
        this.userId = userId;
        this.firstName = firstName;
    }

    // --- Getters ---
    // Jackson (for JSON serialization) uses these getter methods to create the JSON response

    public String getToken() {
        return token;
    }
    public Long getUserId() {
        return userId;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getTokenType() {
        // The token type is always "Bearer" for JWTs
        return "Bearer"; // Return the constant string "Bearer" directly
    }
}


