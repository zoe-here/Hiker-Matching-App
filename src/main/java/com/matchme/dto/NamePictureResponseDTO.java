package com.matchme.dto;
import com.matchme.entities.Profile;

public record NamePictureResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String profilePictureUrl
) {
    // No constructor, getters needed here. The compiler writes them
    public static NamePictureResponseDTO fromProfile(Profile profile) {
        // The record's constructor is called automatically here
        return new NamePictureResponseDTO(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getProfilePictureUrl()
        );
    }
}
