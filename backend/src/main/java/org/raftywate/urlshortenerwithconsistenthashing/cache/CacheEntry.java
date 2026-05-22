package org.raftywate.urlshortenerwithconsistenthashing.cache;

import java.time.LocalDateTime;

public class CacheEntry {

    private String originalUrl;
    private LocalDateTime createdAt;

    public CacheEntry(String originalUrl, LocalDateTime createdAt) {
        this.originalUrl = originalUrl;
        this.createdAt = createdAt;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}