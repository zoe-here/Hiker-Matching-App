package com.matchme.dto;

import java.time.LocalDate;

import com.matchme.entities.Profile;
import com.matchme.enums.Gender;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public class UserAboutMeDTO {

    @NotNull(message = "Birth date must not be null")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;
    @NotNull(message = "Gender must not be null")
    private Gender gender;
    @Size(max = 1000, message = "About me cannot be longer than 1000 characters")
    private String aboutMe;

    public UserAboutMeDTO(LocalDate birthDate, Gender gender, String aboutMe) {
    
        this.birthDate = birthDate;
        this.gender = gender;
        this.aboutMe = aboutMe;
    }

    public static UserAboutMeDTO fromProfile(Profile profile) {
        return new UserAboutMeDTO(
            profile.getBirthDate(),
            profile.getGender(),
            profile.getAboutMe()
        );
    }


    public LocalDate getBirthDate() {
        return birthDate;
    }

    public Gender getGender() {
        return gender;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

   
}
