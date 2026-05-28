package org.raftywate.urlshortenerwithconsistenthashing.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;

import org.raftywate.urlshortenerwithconsistenthashing.analytics.AnalyticsService;

import org.raftywate.urlshortenerwithconsistenthashing.hashing.ConsistentHashingService;

import org.raftywate.urlshortenerwithconsistenthashing.repository.UrlLookupRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UrlServiceTest {

    private UrlService urlService;

    private StringRedisTemplate redisTemplate;

    private ConsistentHashingService hashingService;

    private AnalyticsService analyticsService;

    private UrlLookupRepository repository;

    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {

        redisTemplate = mock(StringRedisTemplate.class);

        hashingService =  mock(ConsistentHashingService.class);

        analyticsService =   mock(AnalyticsService.class);

        repository = mock(UrlLookupRepository.class);

        jdbcTemplate = mock(JdbcTemplate.class);

        urlService =
                new UrlService(
                        redisTemplate,
                        hashingService,
                        analyticsService,
                        repository,
                        jdbcTemplate
                );
    }

    @Test
    void shouldDetermineShardCorrectly() {

        when(
                hashingService.getNode(
                        "abc123"
                )
        ).thenReturn("shard_1");

        String shard =
                urlService.determineShard("abc123");

        assertEquals("shard_1",shard);
    }

    @Test
    void sameShortCodeShouldMapToSameShard() {

        when(
                hashingService.getNode(
                        "sameKey"
                )
        ).thenReturn("shard_2");

        String first = urlService.determineShard("sameKey");

        String second = urlService.determineShard("sameKey");

        assertEquals(first, second);
    }

    @Test
    void generatedShortCodeShouldRouteToValidShard() {

        when(
                hashingService.getNode(anyString())
        ).thenReturn("shard_0");

        String shortCode =
                urlService.generateShortCode();

        String shard = urlService.determineShard(shortCode);

        assertNotNull(shard);
    }
}