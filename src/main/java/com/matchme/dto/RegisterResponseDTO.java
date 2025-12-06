package com.matchme.dto;

import com.matchme.entities.Profile;
import com.matchme.enums.*;
import java.time.LocalDate;
import java.util.Set;

public class RegisterResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Gender gender;
    private LocalDate birthDate;

    private ExperienceLevel ownExperienceLevel;
    private Pace ownPace;
    private Region ownRegion;
    private Set<Language> ownLanguages;
    private Set<HikeType> ownHikeTypes;

    // --- Constructor ---
    public RegisterResponseDTO(Long id, String firstName, String lastName, String email, Gender gender, LocalDate birthDate,
                               ExperienceLevel ownExperienceLevel, Pace ownPace, Region ownRegion,
                               Set<Language> ownLanguages, Set<HikeType> ownHikeTypes) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.birthDate = birthDate;
        this.ownExperienceLevel = ownExperienceLevel;
        this.ownPace = ownPace;
        this.ownRegion = ownRegion;
        this.ownLanguages = ownLanguages;
        this.ownHikeTypes = ownHikeTypes;
    }

    // Static factory method to convert the entity to this DTO
    public static RegisterResponseDTO fromProfile(Profile profile) {
        // Create and return a new RegisterResponseDTO from the Profile entity
        return new RegisterResponseDTO(
                profile.getId(),
                profile.getFirstName(),
                profile.getLastName(),
                profile.getEmail(),
                profile.getGender(),
                profile.getBirthDate(),
                profile.getOwnExperienceLevel(),
                profile.getOwnPace(),
                profile.getOwnRegion(),
                profile.getOwnLanguages(),
                profile.getOwnHikeTypes()
        );
    }

    // --- Getters for all fields ---
    public Long getId() {
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }
    public Gender getGender() {
        return gender;
    }
    public LocalDate getBirthDate() {
        return birthDate;
    }
    public ExperienceLevel getOwnExperienceLevel() {
        return ownExperienceLevel;
    }
    public Pace getOwnPace() {
        return ownPace;
    }
    public Region getOwnRegion() {
        return ownRegion;
    }
    public Set<Language> getOwnLanguages() {
        return ownLanguages;
    }
    public Set<HikeType> getOwnHikeTypes() {
        return ownHikeTypes;
    }
}

