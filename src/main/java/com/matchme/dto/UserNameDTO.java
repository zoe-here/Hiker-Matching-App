package com.matchme.dto;

import jakarta.validation.constraints.NotBlank;

public class UserNameDTO {
    @NotBlank(message = "First name must not be blank")
    private String firstName;
    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    public UserNameDTO() {}

    public UserNameDTO(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public static UserNameDTO fromProfile(com.matchme.entities.Profile profile) {
        return new UserNameDTO(
            profile.getFirstName(),
            profile.getLastName()
        );
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
