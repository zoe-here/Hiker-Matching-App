package com.matchme.enums;

public enum Language {
    ENGLISH("English"),
    ESTONIAN("Estonian"),
    RUSSIAN("Russian"),
    FINNISH("Finnish"),
    SWEDISH("Swedish"),
    LATVIAN("Latvian"),
    LITHUANIAN("Lithuanian");

    private final String displayName;
    Language(String displayName) { this.displayName = displayName; }
    public String getDisplayName() { return displayName; }
}
