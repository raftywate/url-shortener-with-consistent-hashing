package org.raftywate.urlshortenerwithconsistenthashing.benchmark;

public class RedistributionStats {

    private final int moduloMoved;

    private final int consistentMoved;

    public RedistributionStats(
            int moduloMoved,
            int consistentMoved) {

        this.moduloMoved = moduloMoved;

        this.consistentMoved = consistentMoved;
    }

    public int getModuloMoved() {
        return moduloMoved;
    }

    public int getConsistentMoved() {
        return consistentMoved;
    }
}