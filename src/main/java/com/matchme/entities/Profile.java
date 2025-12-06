package com.matchme.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.matchme.enums.*;

@Entity
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

    @NotBlank(message = "First name must not be blank")
    @Column(nullable = false) // Database constraint
    private String firstName;

    @NotBlank(message = "Last name must not be blank")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Stores the bcrypt-hashed password

    @NotNull(message = "Birth date must not be null")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    @Column(length = 1000)
    private String aboutMe;

    
    @NotNull(message = "Gender must not be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;


    private String profilePictureUrl;  //Path/URL to the image

    // --- User's OWN Hiking Biographical Data ---

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceLevel ownExperienceLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Pace ownPace;

    // For Region and HikeType, we store the constant name, but display using getDisplayName()
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Region ownRegion;

    // @ElementCollection tells JPA to create a new table
    @ElementCollection(targetClass = Language.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "user_own_languages", joinColumns = @JoinColumn(name = "profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Set<Language> ownLanguages = new HashSet<>();

    @ElementCollection(targetClass = HikeType.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "user_own_hike_types", joinColumns = @JoinColumn(name = "profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "hike_type")
    private Set<HikeType> ownHikeTypes = new HashSet<>();

    // --- User's PREFERENCE for a Hiking Partner ---

    @Enumerated(EnumType.STRING)
    private ExperienceLevel preferredExperienceLevel;

    @Enumerated(EnumType.STRING)
    private Pace preferredPace;

    @Enumerated(EnumType.STRING)
    private Region preferredRegion;

    @ElementCollection(targetClass = Language.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "user_preferred_languages", joinColumns = @JoinColumn(name = "profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "language")
    private Set<Language> preferredLanguages = new HashSet<>();

    @ElementCollection(targetClass = HikeType.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "user_preferred_hike_types", joinColumns = @JoinColumn(name = "profile_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "hike_type")
    private Set<HikeType> preferredHikeTypes = new HashSet<>();

    /* To track if profile is complete for recommendations
       A flag can be simpler for querying than checking mandatory fields in the service layer */
    private boolean profileCompleted = false;


    public Profile() {
        // No-argument constructor required by JPA
        // Collections like ownLanguages, ownHikeTypes are already initialized at field declaration
    }

    // Fields like aboutMe, profilePictureUrl, and all the preferred... attributes are not included, could be filled later
    public Profile(String firstName, String lastName, String email, String password, LocalDate birthDate, Gender gender,
                   ExperienceLevel ownExperienceLevel, Pace ownPace, Region ownRegion) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.gender= gender; 
        this.ownExperienceLevel = ownExperienceLevel;
        this.ownPace = ownPace;
        this.ownRegion = ownRegion;
        // profileCompleted would be set based on logic in service layer
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getAboutMe() {
        return aboutMe;
    }
    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }
    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public ExperienceLevel getOwnExperienceLevel() {
        return ownExperienceLevel;
    }
    public void setOwnExperienceLevel(ExperienceLevel ownExperienceLevel) {
        this.ownExperienceLevel = ownExperienceLevel;
    }

    public Pace getOwnPace() {
        return ownPace;
    }
    public void setOwnPace(Pace ownPace) {
        this.ownPace = ownPace;
    }

    public Region getOwnRegion() {
        return ownRegion;
    }
    public void setOwnRegion(Region ownRegion) {
        this.ownRegion = ownRegion;
    }

    public Set<Language> getOwnLanguages() {
        return ownLanguages;
    }
    public void setOwnLanguages(Set<Language> ownLanguages) {
        this.ownLanguages = ownLanguages;
    }

    public Set<HikeType> getOwnHikeTypes() {
        return ownHikeTypes;
    }
    public void setOwnHikeTypes(Set<HikeType> ownHikeTypes) {
        this.ownHikeTypes = ownHikeTypes;
    }

    public ExperienceLevel getPreferredExperienceLevel() {
        return preferredExperienceLevel;
    }
    public void setPreferredExperienceLevel(ExperienceLevel preferredExperienceLevel) {
        this.preferredExperienceLevel = preferredExperienceLevel;
    }

    public Pace getPreferredPace() {
        return preferredPace;
    }
    public void setPreferredPace(Pace preferredPace) {
        this.preferredPace = preferredPace;
    }

    public Region getPreferredRegion() {
        return preferredRegion;
    }
    public void setPreferredRegion(Region preferredRegion) {
        this.preferredRegion = preferredRegion;
    }

    public Set<Language> getPreferredLanguages() {
        return preferredLanguages;
    }
    public void setPreferredLanguages(Set<Language> preferredLanguages) {
        this.preferredLanguages = preferredLanguages;
    }

    public Set<HikeType> getPreferredHikeTypes() {
        return preferredHikeTypes;
    }
    public void setPreferredHikeTypes(Set<HikeType> preferredHikeTypes) {
        this.preferredHikeTypes = preferredHikeTypes;
    }

    public boolean isProfileCompleted() {
        return profileCompleted;
    }
    public void setProfileCompleted(boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }

    public Gender getGender() {
        return gender;
    }
    public void setGender(Gender gender) {
        this.gender = gender;
    }

}
