package com.matchme.enums;

public enum ExperienceLevel {
    BEGINNER("Beginner"),
    INTERMEDIATE("Intermediate"),
    ADVANCED("Advanced");

    private final String displayName;
    ExperienceLevel(String displayName) { this.displayName = displayName; }
    public String getDisplayName() { return displayName; }
}
