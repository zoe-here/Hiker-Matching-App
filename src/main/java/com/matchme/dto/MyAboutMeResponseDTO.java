package com.matchme.dto;

import java.time.LocalDate;

import com.matchme.entities.Profile;
import com.matchme.enums.Gender;

public class MyAboutMeResponseDTO extends UserAboutMeDTO {
    private final String email;
    private final Long userId;
    public MyAboutMeResponseDTO(LocalDate birthDate, Gender gender, String aboutMe, String email, Long id) {
        super(birthDate, gender, aboutMe);
        this.email = email;
        this.userId = id;
        
    }

    public String getEmail() {
        return email;
    }

    public Long getUserId() {
        return userId;
    }

    public static MyAboutMeResponseDTO fromProfile(Profile profile) {
        return new MyAboutMeResponseDTO(
            profile.getBirthDate(),
            profile.getGender(),
            profile.getAboutMe(),
            profile.getEmail(),
            profile.getId()
        );
    }
}
