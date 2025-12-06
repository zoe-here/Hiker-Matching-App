package com.matchme.dto;

import java.util.Set;
import com.matchme.entities.Profile;
import com.matchme.enums.*;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public class UserBioDataDTO {
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

    public UserBioDataDTO(ExperienceLevel ownExperienceLevel, Pace ownPace, Region ownRegion, Set<Language> ownLanguages, Set<HikeType> ownHikeTypes) {
        this.ownExperienceLevel = ownExperienceLevel;
        this.ownPace = ownPace;
        this.ownRegion = ownRegion;
        this.ownLanguages = ownLanguages;
        this.ownHikeTypes = ownHikeTypes;
    }

    public static UserBioDataDTO fromProfile(Profile profile) {
        return new UserBioDataDTO(
            profile.getOwnExperienceLevel(),
            profile.getOwnPace(),
            profile.getOwnRegion(),
            profile.getOwnLanguages(),
            profile.getOwnHikeTypes()
        );
    }

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
