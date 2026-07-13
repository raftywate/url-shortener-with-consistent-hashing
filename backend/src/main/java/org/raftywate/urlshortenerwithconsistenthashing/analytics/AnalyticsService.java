package org.raftywate.urlshortenerwithconsistenthashing.analytics;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AnalyticsService {
    //multiple requests update counters simultaneously so, AtomicLong keeps it thread-safe
    private final AtomicLong cacheHits =
            new AtomicLong(0);

    private final AtomicLong cacheMisses =
            new AtomicLong(0);

    private final AtomicLong totalRedirects =
            new AtomicLong(0);

    private final Map<String, AtomicLong> shardCounts =
            new ConcurrentHashMap<>();

    public AnalyticsService() {

        shardCounts.put("shard_0",
                new AtomicLong(0));

        shardCounts.put("shard_1",
                new AtomicLong(0));

        shardCounts.put("shard_2",
                new AtomicLong(0));
    }

    // CACHE METRICS

    public void incrementCacheHits() {
        cacheHits.incrementAndGet();
    }

    public void incrementCacheMisses() {
        cacheMisses.incrementAndGet();
    }

    public long getCacheHits() {
        return cacheHits.get();
    }

    public long getCacheMisses() {
        return cacheMisses.get();
    }

    // REDIRECT METRICS

    public void incrementRedirects() {
        totalRedirects.incrementAndGet();
    }

    public long getTotalRedirects() {
        return totalRedirects.get();
    }

    // SHARD METRICS

    public void incrementShardCount(String shard) {

        shardCounts
                .computeIfAbsent(shard, k -> new AtomicLong(0))
                .incrementAndGet();
    }

    public Map<String, AtomicLong> getShardCounts() {
        return shardCounts;
    }
}