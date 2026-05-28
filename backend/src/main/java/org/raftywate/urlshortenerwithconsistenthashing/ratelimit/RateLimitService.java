package org.raftywate.urlshortenerwithconsistenthashing.ratelimit;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private static final int MAX_REQUESTS = 5;

    private final StringRedisTemplate redisTemplate;

    public RateLimitService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean isAllowed(String ipAddress) {

        String key = "rate_limit:" + ipAddress;

        String currentCount =
                redisTemplate.opsForValue().get(key);

        // FIRST REQUEST
        if (currentCount == null) {

            redisTemplate.opsForValue()
                    .set(key, "1", Duration.ofMinutes(1));

            return true;
        }

        int requests =
                Integer.parseInt(currentCount);

        // LIMIT EXCEEDED
        if (requests >= MAX_REQUESTS) {
            return false;
        }

        // INCREMENT COUNTER
        redisTemplate.opsForValue()
                .increment(key); //increment redis operation here is atomic meaning it's safe under concurrency

        return true;
    }
}