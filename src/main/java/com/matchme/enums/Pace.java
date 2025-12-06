package com.matchme.enums;

public enum Pace {
    LEISURELY("Leisurely"),
    SLOW("Slow"),
    MODERATE("Moderate"),
    FAST("Fast");

    private final String displayName;
    Pace(String displayName) { this.displayName = displayName; }
    public String getDisplayName() { return displayName; }
}
