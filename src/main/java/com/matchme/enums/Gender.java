package com.matchme.enums;

public enum Gender {
    MALE("Male"),
    FEMALE("Female"),
    NON_BINARY("Non-binary"),
    TRANSGENDER("Transgender"),
    INTERSEX("Intersex"),
    OTHER("Other"),
    PREFER_NOT_TO_SAY("Prefer not to say");

    private final String displayName;
    Gender(String displayName) { this.displayName = displayName; }
    public String getDisplayName() { return displayName; }
}