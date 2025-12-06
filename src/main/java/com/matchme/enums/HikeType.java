package com.matchme.enums;

public enum HikeType {
    FOREST_TRAIL("Forest Trail"),  // Hiking through wooded areas
    COASTAL_HIKE("Coastal Hike"),  // Hiking along the seashore or cliffs
    BOG_BOARDWALK("Bog Boardwalk"),  // Hiking through bogs/mires, typically on wooden paths
    NATURE_RESERVE_PATH("Nature Reserve Path"),  // Trails within protected nature areas or national parks
    ISLAND_TREK("Island Trek"),  // Hiking on one of Estonia's many islands (e.g., Saaremaa, Hiiumaa)
    LAKESIDE_LOOP("Lakeside Loop"),  // Trails around lakes
    RIVER_VALLEY_HIKE("River Valley Hike"),  // Hiking along or in river valleys (e.g., Ahja, Piusa)
    HISTORICAL_SITE_WALK("Historical Site Walk"),  // Walks that incorporate historical or cultural landmarks
    DAY_HIKE("Day Hike"),  // General category for hikes completed in a single day
    MULTI_DAY_TREK("Multi-Day Trek"),  // Longer hikes spanning more than one day (e.g., sections of RMK trails)
    TRAIL_RUNNING("Trail Running"),  // Running on nature trails
    LEISURELY_NATURE_WALK("Leisurely Nature Walk"),  // Shorter, easier walks focused on enjoying nature
    CITY_WALK("City Walk");  // Walks in parks or nature areas within cities

    private final String displayName;

    HikeType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
