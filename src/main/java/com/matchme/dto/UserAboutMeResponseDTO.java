package com.matchme.dto;

import java.time.LocalDate;
import com.matchme.enums.Gender;
import com.matchme.entities.Profile;

public class UserAboutMeResponseDTO extends UserAboutMeDTO {
    private final Long userId;

    public UserAboutMeResponseDTO(Long userId, LocalDate birthDate, Gender gender, String aboutMe) {
        super(birthDate, gender, aboutMe);
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public static UserAboutMeResponseDTO fromProfile(Profile profile) {
        return new UserAboutMeResponseDTO(
            profile.getId(),
            profile.getBirthDate(),
            profile.getGender(),
            profile.getAboutMe()
        );
    }
}
