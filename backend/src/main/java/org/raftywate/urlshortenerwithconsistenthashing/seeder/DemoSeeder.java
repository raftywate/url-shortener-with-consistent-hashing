package org.raftywate.urlshortenerwithconsistenthashing.seeder;

import org.raftywate.urlshortenerwithconsistenthashing.service.UrlService;
import org.raftywate.urlshortenerwithconsistenthashing.analytics.AnalyticsService;
import org.raftywate.urlshortenerwithconsistenthashing.repository.UrlLookupRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DemoSeeder {

    private final UrlService urlService;
    private final AnalyticsService analyticsService;
    private final UrlLookupRepository urlLookupRepository;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.demo-seeding.enabled:true}")
    private boolean enabled;

    @Value("${app.shards.active-count:3}")
    private int activeShardsCount;

    private static final List<String> SAMPLE_URLS = List.of(
            "https://github.com/raftywate",
            "https://en.wikipedia.org/wiki/Consistent_hashing",
            "https://spring.io/projects/spring-boot",
            "https://news.ycombinator.com",
            "https://stackoverflow.com/questions/tagged/java",
            "https://reddit.com/r/java",
            "https://medium.com",
            "https://dev.to",
            "https://github.com/trending",
            "https://news.google.com",
            "https://youtube.com",
            "https://twitter.com",
            "https://netflix.com",
            "https://spotify.com",
            "https://amazon.com",
            "https://wikipedia.org",
            "https://cnn.com",
            "https://bbc.co.uk",
            "https://nytimes.com",
            "https://docker.com",
            "https://kubernetes.io",
            "https://redis.io",
            "https://postgresql.org",
            "https://elastic.co",
            "https://nginx.org",
            "https://cloudflare.com"
    );

    public DemoSeeder(UrlService urlService, AnalyticsService analyticsService,
                      UrlLookupRepository urlLookupRepository, JdbcTemplate jdbcTemplate) {
        this.urlService = urlService;
        this.analyticsService = analyticsService;
        this.urlLookupRepository = urlLookupRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        // Ensure the is_demo column exists in all mapped shard tables
        ensureDatabaseColumnsExist();

        if (enabled) {
            System.out.println("Application ready. Running initial demo database seeding...");
            seedDemoData();
        }
    }



    private void ensureDatabaseColumnsExist() {
        try {
            jdbcTemplate.execute(
                "ALTER TABLE url_lookup ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE"
            );
            System.out.println("Verified/Added is_demo column in url_lookup");
        } catch (Exception e) {
            System.err.println("Could not add is_demo to url_lookup: " + e.getMessage());
        }

        for (int i = 0; i < activeShardsCount; i++) {
            String shard = "shard_" + i;
            try {
                jdbcTemplate.execute(
                    "ALTER TABLE " + shard + ".url_mapping ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE"
                );
                System.out.println("Verified/Added is_demo column in " + shard + ".url_mapping");
            } catch (Exception e) {
                System.err.println("Could not add is_demo to " + shard + ".url_mapping: " + e.getMessage());
            }
        }
    }

    public void seedDemoData() {
        // Ensure columns exist before executing any database queries
        ensureDatabaseColumnsExist();

        try {
            Random rand = new Random();
            List<String> codes = new ArrayList<>();

            System.out.println("Creating short URLs for seeding...");
            // Step 1: Create short URLs (idempotent because of UrlService normalize & dedup check)
            for (String url : SAMPLE_URLS) {
                String code = urlService.createShortUrl(url, true);
                codes.add(code);
            }

            // Step 2: Ensure shard counts in AnalyticsService are updated for all seeded links
            for (String code : codes) {
                String shard = urlService.determineShard(code);
                analyticsService.incrementShardCount(shard);
            }

            // Step 3: Simulate redirect hits to generate realistic cache stats
            // To get a 60-80% hit rate, we can do 2 to 6 visits per code.
            // V = 2 -> 50% hit rate
            // V = 3 -> 66.7% hit rate
            // V = 4 -> 75% hit rate
            // V = 5 -> 80% hit rate
            // V = 6 -> 83.3% hit rate
            // Randomly distributing visits will average to ~70% cache hit rate
            System.out.println("Simulating redirect visits to warm cache and analytics...");
            for (String code : codes) {
                int visits = rand.nextInt(5) + 2; // 2 to 6 visits per code
                for (int i = 0; i < visits; i++) {
                    urlService.getOriginalUrl(code);
                }
            }

            System.out.println("Demo database seeding completed successfully. Seeded " + codes.size() + " URLs.");
        } catch (Exception e) {
            System.err.println("Error during demo database seeding: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
