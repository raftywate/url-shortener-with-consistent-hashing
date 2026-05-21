package org.raftywate.urlshortenerwithconsistenthashing.service;

import org.raftywate.urlshortenerwithconsistenthashing.analytics.AnalyticsService;
import org.raftywate.urlshortenerwithconsistenthashing.cache.CacheEntry;
import org.raftywate.urlshortenerwithconsistenthashing.hashing.ConsistentHashingService;
import org.raftywate.urlshortenerwithconsistenthashing.repository.UrlRepository;
import org.raftywate.urlshortenerwithconsistenthashing.model.UrlMapping;
import org.raftywate.urlshortenerwithconsistenthashing.sharding.SchemaRoutingService;
import org.raftywate.urlshortenerwithconsistenthashing.sharding.ShardContext;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.server.ResponseStatusException;
//import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;

import java.time.Duration;
import java.util.LinkedHashMap;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;

@Service
public class UrlService {

    private final UrlRepository repository;
    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final ConsistentHashingService hashingService;
    private final SchemaRoutingService schemaRoutingService;
    private final AnalyticsService analyticsService;
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

    public UrlService(UrlRepository repository, StringRedisTemplate redisTemplate,
                      ConsistentHashingService  hashingService, SchemaRoutingService schemaRoutingService,
                      AnalyticsService analyticsService) {
        this.repository = repository;
        this.redisTemplate = redisTemplate;
        this.hashingService = hashingService;
        this.schemaRoutingService = schemaRoutingService;
        this.analyticsService = analyticsService;
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

        //Generate Short Code first
        String shortCode = generateShortCode();

        //Then, determine the Shard
        String shard = hashingService.getNode(shortCode);
        analyticsService.incrementShardCount(shard);
        System.out.println("Routing to shard: " + shard);

        //Then switch the schema
        schemaRoutingService.setSchema(shard);

        //Create the entity now
        UrlMapping mapping = new UrlMapping();

        mapping.setOriginalUrl(originalUrl);

        mapping.setShortCode(shortCode);

        mapping.setCreatedAt(LocalDateTime.now());

        // SAVE DIRECTLY INTO CORRECT SHARD
        repository.save(mapping);

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
        String shard = hashingService.getNode(shortCode);

        System.out.println("Reading from shard: " + shard);

        schemaRoutingService.setSchema(shard);

        //DB Lookup
        Optional<UrlMapping> mapping = repository.findByShortCode(shortCode);

        String originalUrl = mapping.map(UrlMapping::getOriginalUrl)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "URL Not FOUND"));


        //Store in Redis with TTL
        redisTemplate.opsForValue().set(shortCode, originalUrl, Duration.ofMinutes(TTL_MINUTES));

        System.out.println("Stored in Redis Cache");
        analyticsService.incrementRedirects();
        return originalUrl;
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
//        //store in cache
//        cache.put(shortCode, new CacheEntry(originalUrl, LocalDateTime.now()));
//        System.out.println("Current cache: " + cache);
//        return originalUrl;
//    }

    private String generateShortCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }
}