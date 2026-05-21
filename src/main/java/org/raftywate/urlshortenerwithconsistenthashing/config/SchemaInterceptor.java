package org.raftywate.urlshortenerwithconsistenthashing.config;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.raftywate.urlshortenerwithconsistenthashing.sharding.ShardContext;
import org.springframework.stereotype.Component;

@Component
public class SchemaInterceptor {

    @PersistenceContext
    private EntityManager entityManager;

    @PostConstruct
    public void init() {

        System.out.println(
                "SchemaInterceptor initialized");
    }

    public void applyShard() {

        String shard = ShardContext.getCurrentShard();

        if (shard != null) {

            entityManager.createNativeQuery(
                            "SET search_path TO " + shard)
                    .executeUpdate();
        }
    }
}