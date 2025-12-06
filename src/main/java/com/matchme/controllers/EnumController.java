package com.matchme.controllers;

import com.matchme.enums.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/v1/api/enums")
public class EnumController {

    @GetMapping("/region")
    public List<Map<String, String>> getRegions() {
        return Arrays.stream(Region.values())
                .map(region -> Map.of("name", region.name(), "displayName", region.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/gender")
    public List<Map<String, String>> getGenders() {
        return Arrays.stream(Gender.values())
                .map(gender -> Map.of("name", gender.name(), "displayName", gender.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/experience-level")
    public List<Map<String, String>> getExperienceLevels() {
        return Arrays.stream(ExperienceLevel.values())
                .map(experienceLevel -> Map.of("name", experienceLevel.name(), "displayName", experienceLevel.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/pace")
    public List<Map<String, String>> getPaces() {
        return Arrays.stream(Pace.values())
                .map(pace -> Map.of("name", pace.name(), "displayName", pace.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/language")
    public List<Map<String, String>> getLanguages() {
        return Arrays.stream(Language.values())
                .map(language -> Map.of("name", language.name(), "displayName", language.getDisplayName()))
                .collect(Collectors.toList());
    }

    @GetMapping("/hike-type")
    public List<Map<String, String>> getHikeTypes() {
        return Arrays.stream(HikeType.values())
                .map(hikeType -> Map.of("name", hikeType.name(), "displayName", hikeType.getDisplayName()))
                .collect(Collectors.toList());
    }
}
