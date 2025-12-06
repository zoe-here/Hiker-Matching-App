package com.matchme.dto;

public class UserNameResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;

    public UserNameResponseDTO() {}

    public UserNameResponseDTO(Long id, String firstName, String lastName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public static UserNameResponseDTO fromProfile(com.matchme.entities.Profile profile) {
        return new UserNameResponseDTO(
            profile.getId(),
            profile.getFirstName(),
            profile.getLastName()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
