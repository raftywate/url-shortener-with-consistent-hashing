package org.raftywate
        .urlshortenerwithconsistenthashing
        .ratelimit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RateLimitServiceTest {

    private StringRedisTemplate redisTemplate;

    private ValueOperations<String, String>
            valueOperations;

    private RateLimitService
            rateLimitService;

    @BeforeEach
    void setUp() {

        redisTemplate =
                mock(StringRedisTemplate.class);

        valueOperations =
                mock(ValueOperations.class);

        when(redisTemplate.opsForValue())
                .thenReturn(valueOperations);

        rateLimitService =
                new RateLimitService(
                        redisTemplate,
                        5
                );
    }

    @Test
    void shouldAllowFirstRequest() {

        when(valueOperations.get(anyString()))
                .thenReturn(null);

        boolean allowed =
                rateLimitService
                        .isAllowed("127.0.0.1");

        assertTrue(allowed);
    }

    @Test
    void shouldAllowRequestsUnderLimit() {

        when(valueOperations.get(anyString()))
                .thenReturn("3");

        boolean allowed =
                rateLimitService
                        .isAllowed("127.0.0.1");

        assertTrue(allowed);
    }

    @Test
    void shouldBlockRequestsOverLimit() {

        when(valueOperations.get(anyString()))
                .thenReturn("5");

        boolean allowed =
                rateLimitService
                        .isAllowed("127.0.0.1");

        assertFalse(allowed);
    }

    @Test
    void shouldIncrementCounter() {

        when(valueOperations.get(anyString()))
                .thenReturn("2");

        rateLimitService
                .isAllowed("127.0.0.1");

        verify(valueOperations)
                .increment(anyString());
    }
}