package com.matchme.dto;

import java.util.Set;
import com.matchme.enums.*;

public class UserPreferenceDTO {
   
    private ExperienceLevel preferredExperienceLevel;
    private Pace preferredPace;
    private Region preferredRegion;
    private Set<Language> preferredLanguages;
    private Set<HikeType> preferredHikeTypes;

    public UserPreferenceDTO() {}

    public UserPreferenceDTO(ExperienceLevel preferredExperienceLevel, Pace preferredPace, Region preferredRegion, Set<Language> preferredLanguages, Set<HikeType> preferredHikeTypes) {
        this.preferredExperienceLevel = preferredExperienceLevel;
        this.preferredPace = preferredPace;
        this.preferredRegion = preferredRegion;
        this.preferredLanguages = preferredLanguages;
        this.preferredHikeTypes = preferredHikeTypes;
    }

    public ExperienceLevel getPreferredExperienceLevel() { return preferredExperienceLevel; }
    public void setPreferredExperienceLevel(ExperienceLevel preferredExperienceLevel) { this.preferredExperienceLevel = preferredExperienceLevel; }
    public Pace getPreferredPace() { return preferredPace; }
    public void setPreferredPace(Pace preferredPace) { this.preferredPace = preferredPace; }
    public Region getPreferredRegion() { return preferredRegion; }
    public void setPreferredRegion(Region preferredRegion) { this.preferredRegion = preferredRegion; }
    public Set<Language> getPreferredLanguages() { return preferredLanguages; }
    public void setPreferredLanguages(Set<Language> preferredLanguages) { this.preferredLanguages = preferredLanguages; }
    public Set<HikeType> getPreferredHikeTypes() { return preferredHikeTypes; }
    public void setPreferredHikeTypes(Set<HikeType> preferredHikeTypes) { this.preferredHikeTypes = preferredHikeTypes; }

    public static UserPreferenceDTO fromProfile(com.matchme.entities.Profile profile) {
        return new UserPreferenceDTO(
            profile.getPreferredExperienceLevel(),
            profile.getPreferredPace(),
            profile.getPreferredRegion(),
            profile.getPreferredLanguages(),
            profile.getPreferredHikeTypes()
        );
    }
}
