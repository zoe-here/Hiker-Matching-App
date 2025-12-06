package com.matchme.enums;

public enum Region {
    HARJUMAA("Harju County"),
    HIIUMAA("Hiiu County"),
    IDA_VIRUMAA("Ida-Viru County"),
    JOGEVAMAA("Jõgeva County"),
    JARVAMAA("Järva County"),
    LAANEMAA("Lääne County"),
    LAANE_VIRUMAA("Lääne-Viru County"),
    POLVAMAA("Põlva County"),
    PARNUMAA("Pärnu County"),
    RAPLAMAA("Rapla County"),
    SAAREMAA("Saare County"),
    TARTUMAA("Tartu County"),
    VALGAMAA("Valga County"),
    VILJANDIMAA("Viljandi County"),
    VORUMAA("Võru County");

    private final String displayName;

    Region(String displayName) {
        this.displayName = displayName;
    }
    public String getDisplayName() {
        return displayName;
    }
}
