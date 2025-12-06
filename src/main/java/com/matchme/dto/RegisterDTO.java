package com.matchme.dto;

import java.time.LocalDate;
import java.util.Set;
import com.matchme.enums.*;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public class RegisterDTO {

    @NotBlank(message = "First name must not be blank")
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    private String lastName;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Password must not be blank")
    private String password;

    @NotNull(message = "Birth date must not be null")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @NotNull(message = "Gender must not be null")
    private Gender gender;

    @NotNull(message = "Experience level must not be null")
    private ExperienceLevel ownExperienceLevel;

    @NotNull(message = "Pace must not be null")
    private Pace ownPace;

    @NotNull(message = "Region must not be null")
    private Region ownRegion;

    @NotEmpty(message = "At least one language must be selected")
    private Set<Language> ownLanguages;
    @NotEmpty(message = "At least one hike type must be selected")
    private Set<HikeType> ownHikeTypes;

    public RegisterDTO() {}

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { 
        this.email = email.toLowerCase().trim(); 
    }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    public ExperienceLevel getOwnExperienceLevel() { return ownExperienceLevel; }
    public void setOwnExperienceLevel(ExperienceLevel ownExperienceLevel) { this.ownExperienceLevel = ownExperienceLevel; }
    public Pace getOwnPace() { return ownPace; }
    public void setOwnPace(Pace ownPace) { this.ownPace = ownPace; }
    public Region getOwnRegion() { return ownRegion; }
    public void setOwnRegion(Region ownRegion) { this.ownRegion = ownRegion; }
    public Set<Language> getOwnLanguages() { return ownLanguages; }
    public void setOwnLanguages(Set<Language> ownLanguages) { this.ownLanguages = ownLanguages; }
    public Set<HikeType> getOwnHikeTypes() { return ownHikeTypes; }
    public void setOwnHikeTypes(Set<HikeType> ownHikeTypes) { this.ownHikeTypes = ownHikeTypes; }
}
