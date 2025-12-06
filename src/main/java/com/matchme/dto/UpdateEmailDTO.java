package com.matchme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UpdateEmailDTO {
    @NotBlank(message = "New email must not be blank")
    @Email(message = "Please provide a valid email address")
    private String newEmail;

    @NotBlank(message = "Password confirmation is required")
    private String password;


    public String getNewEmail() {
        return newEmail;
    }
    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail.toLowerCase().trim();
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
