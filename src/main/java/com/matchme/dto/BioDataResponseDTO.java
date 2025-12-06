package com.matchme.dto;

import com.matchme.entities.Profile;
import com.matchme.enums.*;
import java.util.Set;

public record BioDataResponseDTO(
        Long id,
        ExperienceLevel ownExperienceLevel,
        Pace ownPace,
        Region ownRegion,
        Set<Language> ownLanguages,
        Set<HikeType> ownHikeTypes
) {
    public static BioDataResponseDTO fromProfile(Profile profile) {
        return new BioDataResponseDTO(
                profile.getId(),
                profile.getOwnExperienceLevel(),
                profile.getOwnPace(),
                profile.getOwnRegion(),
                profile.getOwnLanguages(),
                profile.getOwnHikeTypes()
        );
    }
}
