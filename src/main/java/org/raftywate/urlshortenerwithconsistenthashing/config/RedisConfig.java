package org.raftywate.urlshortenerwithconsistenthashing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;

//tells spring that this class creates application config
@Configuration
public class RedisConfig {


    //tells Spring to manage this object globally
    @Bean
    //StringRedisTemplate is Redis Client for Java, and it lets Java talk to Redis server
    public StringRedisTemplate redisTemplate(RedisConnectionFactory factory) {
        return new StringRedisTemplate(factory);
    }
}