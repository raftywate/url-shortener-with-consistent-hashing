package org.raftywate.urlshortenerwithconsistenthashing.sharding;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
//Since the Spring boot automatically talk to the default overall schema,
//we make a routing system to let it talk to the particular shard where the data is to be stored.
//So, we're here writing out own Query instead of using the JPA(analogous of EF Core in .NET)
@Service
public class SchemaRoutingService {
    //Spring automatically gives us DB manager object
    //You don't manually create: new EntityManager()
    @PersistenceContext
    //EntityManager is JPA's low-level database controller or the direct DB interaction interface
    //because we need raw SQL execution here
    private EntityManager entityManager;

    @Transactional
    public void setSchema(String schema) {

        entityManager.createNativeQuery(
                        "SET search_path TO " + schema)
                .executeUpdate();
    }
}