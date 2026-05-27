package org.raftywate.urlshortenerwithconsistenthashing.service;

import org.raftywate.urlshortenerwithconsistenthashing.hashing.ConsistentHashingService;
import org.raftywate.urlshortenerwithconsistenthashing.repository.UrlLookupRepository;
import org.raftywate.urlshortenerwithconsistenthashing.analytics.AnalyticsService;
import org.raftywate.urlshortenerwithconsistenthashing.model.UrlLookup;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class UrlService {

    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final ConsistentHashingService hashingService;
    private final JdbcTemplate jdbcTemplate;
    private final AnalyticsService analyticsService;
    private final UrlLookupRepository urlLookupRepository;
//    thread-safe concurrent access
//    private final Map<String, String> cache = new ConcurrentHashMap<>();

//    loadFactor controls resizing threshold and 0.75f is the default Java value
//    accessOrder = true means order by recent access and not the INSERTION Order, thus, enabling LRU behavior
//    private final Map<String, CacheEntry> cache =
//        new LinkedHashMap<>(100, 0.75f, true) {
//
////        removeEldestEntry is called automatically by Java after every insertion
//            @Override
//            protected boolean removeEldestEntry(Map.Entry<String, CacheEntry> eldest) {
//                return size() > 3;
//            }
//        };

    private static final long TTL_MINUTES = 1; //Cache entries older than 1 min will become invalid

    private final StringRedisTemplate redisTemplate;

    public UrlService(
            StringRedisTemplate redisTemplate,
            ConsistentHashingService hashingService,
            AnalyticsService analyticsService,
            UrlLookupRepository urlLookupRepository,
            JdbcTemplate jdbcTemplate) {

        this.redisTemplate = redisTemplate;
        this.hashingService = hashingService;
        this.analyticsService = analyticsService;
        this.urlLookupRepository = urlLookupRepository;
        this.jdbcTemplate = jdbcTemplate;
    }


    private String encodeBase62(long value) {
        StringBuilder sb = new StringBuilder();

        while (value > 0) {
            int remainder = (int) (value % 62);
            sb.append(BASE62.charAt(remainder));
            value /= 62;
        }

        return sb.reverse().toString();
    }

        public String createShortUrl(String originalUrl) {

            originalUrl = originalUrl.trim();

            if (!originalUrl.startsWith("http")) {

                originalUrl = "https://" + originalUrl;
            }

            // DEDUP CHECK
            Optional<UrlLookup> existingLookup = urlLookupRepository.findByOriginalUrl(originalUrl);

            if (existingLookup.isPresent()) {
                System.out.println("Existing short code found");
                return existingLookup.get().getShortCode();
            }

            // GENERATE SHORT CODE
            String shortCode =
                    generateShortCode();

            // DETERMINE SHARD
            String shard =
                    hashingService.getNode(shortCode);

            System.out.println(
                    "Routing to shard: " + shard);

            // INSERT INTO SHARD
            String insertQuery = """
                INSERT INTO %s.url_mapping
                (original_url, short_code, created_at)
                VALUES (?, ?, ?)
                """.formatted(shard);

            jdbcTemplate.update(
                    insertQuery,
                    originalUrl,
                    shortCode,
                    Timestamp.valueOf(LocalDateTime.now())
            );

            // ANALYTICS
            analyticsService
                    .incrementShardCount(shard);

            // SAVE GLOBAL LOOKUP
            UrlLookup lookup =
                    new UrlLookup();

            lookup.setOriginalUrl(originalUrl);
            lookup.setShortCode(shortCode);
            urlLookupRepository.save(lookup);

            return shortCode;
        }

    public String getOriginalUrl(String shortCode) {
        //Checking Redis cache
        String cachedUrl = redisTemplate.opsForValue().get(shortCode);

        //Cache Hit
        if (cachedUrl != null) {
            System.out.println("Redis Cache Hit");
            analyticsService.incrementCacheHits();
            return cachedUrl;
        }

        System.out.println("Redis Cache Miss");

        analyticsService.incrementCacheMisses();

        //determine shard
        String shard = hashingService.getNode(shortCode);

        System.out.println("Reading from shard: " + shard);

        // QUERY SHARD DIRECTLY
        String query = """
                SELECT original_url
                FROM %s.url_mapping
                WHERE short_code = ?
                """.formatted(shard);

        try {
            String originalUrl =
                    jdbcTemplate.queryForObject(
                            query,
                            String.class,
                            shortCode
                    );

            //Store in Redis
            redisTemplate.opsForValue()
                    .set(
                            shortCode,
                            originalUrl,
                            Duration.ofMinutes(TTL_MINUTES)
                    );

            System.out.println("Stored in Redis Cache");

            analyticsService.incrementRedirects();

            return originalUrl;

        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "URL NOT FOUND"
            );
        }
    }

//    public String getOriginalUrl(String shortCode) {
//
//        CacheEntry cached = cache.get(shortCode);
//
//        //CACHE HIT
//        if(cached != null) {
//            //Check TTL
//            //checking if the expiry time of the cache is in the future or after the current time
//            if(cached.getCreatedAt().plusMinutes(TTL_MINUTES).isAfter(LocalDateTime.now())) {
//                System.out.println("Cache Hit");
//                System.out.println("Current cache: " + cache);
//                return cached.getOriginalUrl();
//            }
//
//            //Expired
//            System.out.println("Cache Expired");
//            cache.remove(shortCode);
//        }
//
//        System.out.println("CACHE MISS!");
//
//        //DB Lookup
//        Optional<UrlMapping> mapping = repository.findByShortCode(shortCode);
//        String originalUrl = mapping.map(UrlMapping::getOriginalUrl)
//                .orElseThrow(() ->
//                        new ResponseStatusException(HttpStatus.NOT_FOUND, "URL not found"));
//
//        //store in cache,
//        //cache.put(shortCode, new CacheEntry(originalUrl, LocalDateTime.now()));
//        System.out.println("Current cache: " + cache);
//        return originalUrl;
//    }

    private String generateShortCode() {

        long timestamp =
                System.currentTimeMillis();

        long random =
                (long) (Math.random() * 100000);

        long combined =
                timestamp + random;

        return encodeBase62(combined);
    }
}