package org.raftywate.urlshortenerwithconsistenthashing.controller;

import org.raftywate.urlshortenerwithconsistenthashing.analytics.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(
            AnalyticsService analyticsService) {

        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics/cache")
    public Map<String, Object> getCacheAnalytics() {

        Map<String, Object> response =
                new HashMap<>();

        long hits =
                analyticsService.getCacheHits();

        long misses =
                analyticsService.getCacheMisses();

        long total = hits + misses;

        double hitRate =
                total == 0
                        ? 0
                        : ((double) hits / total) * 100;

        response.put("cacheHits", hits);

        response.put("cacheMisses", misses);

        response.put("hitRate", hitRate);

        return response;
    }

    @GetMapping("/analytics/shards")
    public Map<String, Long> getShardAnalytics() {

        Map<String, Long> response =
                new HashMap<>();

        analyticsService
                .getShardCounts()
                .forEach((shard, count) ->
                        response.put(
                                shard,
                                count.get()));

        return response;
    }

    @GetMapping("/analytics/redirects")
    public Map<String, Long> getRedirectAnalytics() {

        Map<String, Long> response =
                new HashMap<>();

        response.put(
                "totalRedirects",
                analyticsService
                        .getTotalRedirects());

        return response;
    }
}