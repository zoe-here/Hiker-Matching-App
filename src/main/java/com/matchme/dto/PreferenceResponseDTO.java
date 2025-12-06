package com.matchme.dto;

import com.matchme.entities.Profile;
import com.matchme.enums.*;
import java.util.Set;

public record PreferenceResponseDTO(
        Long id,
        ExperienceLevel preferredExperienceLevel,
        Pace preferredPace,
        Region preferredRegion,
        Set<Language> preferredLanguages,
        Set<HikeType> preferredHikeTypes
) {
    public static PreferenceResponseDTO fromProfile(Profile profile) {
        return new PreferenceResponseDTO(
                profile.getId(),
                profile.getPreferredExperienceLevel(),
                profile.getPreferredPace(),
                profile.getPreferredRegion(),
                profile.getPreferredLanguages(),
                profile.getPreferredHikeTypes()
        );
    }
}
