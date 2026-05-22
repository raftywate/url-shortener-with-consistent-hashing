package org.raftywate.urlshortenerwithconsistenthashing.benchmark;

import org.raftywate.urlshortenerwithconsistenthashing.hashing.ConsistentHashingService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConsistentHashingBenchmark {

    private static final List<String> INITIAL_SHARDS = List.of(
            "shard_0",
            "shard_1",
            "shard_2"
    );

    private static final String NEW_SHARD =
            "shard_3";

    private static final int TOTAL_KEYS = 1000;

    public static void main(String[] args) {

        ConsistentHashingService hashing =
                new ConsistentHashingService();

        initializeShards(
                hashing,
                INITIAL_SHARDS
        );

        printHashRing(hashing);

        printSampleLookups(hashing);

        Map<String, Integer> distribution =
                getDistribution(
                        hashing,
                        TOTAL_KEYS
                );

        printDistribution(distribution);

        RedistributionStats stats =
                getRedistributionStats(
                        hashing,
                        TOTAL_KEYS
                );

        printRedistributionStats(stats);
    }

    // INITIALIZATION

    private static void initializeShards(
            ConsistentHashingService hashing,
            List<String> shards) {

        for (String shard : shards) {

            hashing.addNode(shard);
        }
    }

    // HASH RING

    private static void printHashRing(
            ConsistentHashingService hashing) {

        System.out.println(
                "\n===== HASH RING =====");

        hashing.printRing();
    }

    // SAMPLE LOOKUPS

    private static void printSampleLookups(
            ConsistentHashingService hashing) {

        System.out.println(
                "\n===== SAMPLE LOOKUPS =====");

        printLookup(hashing, "google");

        printLookup(hashing, "youtube");

        printLookup(hashing, "github");
    }

    private static void printLookup(
            ConsistentHashingService hashing,
            String key) {

        System.out.println(
                key + " -> " +
                        hashing.getNode(key)
        );
    }

    // DISTRIBUTION TEST

    private static Map<String, Integer>
    getDistribution(
            ConsistentHashingService hashing,
            int totalKeys) {

        Map<String, Integer> distribution =
                initializeDistributionMap();

        for (int i = 0; i < totalKeys; i++) {

            String key = generateKey(i);

            String shard =
                    hashing.getNode(key);

            distribution.put(
                    shard,
                    distribution.get(shard) + 1
            );
        }

        return distribution;
    }

    private static Map<String, Integer>
    initializeDistributionMap() {

        Map<String, Integer> distribution =
                new HashMap<>();

        for (String shard : INITIAL_SHARDS) {

            distribution.put(shard, 0);
        }

        return distribution;
    }

    private static void printDistribution(
            Map<String, Integer> distribution) {

        System.out.println(
                "\n===== DISTRIBUTION TEST =====");

        System.out.println(distribution);
    }

    // REDISTRIBUTION TEST

    private static RedistributionStats
    getRedistributionStats(
            ConsistentHashingService hashing,
            int totalKeys) {

        Map<String, String> moduloBefore =
                new HashMap<>();

        Map<String, String> moduloAfter =
                new HashMap<>();

        Map<String, String> consistentBefore =
                new HashMap<>();

        Map<String, String> consistentAfter =
                new HashMap<>();

        // BEFORE ADDING NEW SHARD
        for (int i = 0; i < totalKeys; i++) {

            String key = generateKey(i);

            moduloBefore.put(
                    key,
                    hashing.getNodeModulo(
                            key,
                            INITIAL_SHARDS.size()
                    )
            );

            consistentBefore.put(
                    key,
                    hashing.getNode(key)
            );
        }

        // ADD NEW SHARD
        System.out.println(
                "\n===== ADDING NEW SHARD =====");

        hashing.addNode(NEW_SHARD);

        // AFTER ADDING NEW SHARD
        for (int i = 0; i < totalKeys; i++) {

            String key = generateKey(i);

            moduloAfter.put(
                    key,
                    hashing.getNodeModulo(
                            key,
                            INITIAL_SHARDS.size() + 1
                    )
            );

            consistentAfter.put(
                    key,
                    hashing.getNode(key)
            );
        }

        int moduloMoved =
                countMovements(
                        moduloBefore,
                        moduloAfter,
                        totalKeys
                );

        int consistentMoved =
                countMovements(
                        consistentBefore,
                        consistentAfter,
                        totalKeys
                );

        return new RedistributionStats(
                moduloMoved,
                consistentMoved
        );
    }

    private static int countMovements(
            Map<String, String> before,
            Map<String, String> after,
            int totalKeys) {

        int moved = 0;

        for (int i = 0; i < totalKeys; i++) {

            String key = generateKey(i);

            if (!before.get(key)
                    .equals(after.get(key))) {

                moved++;
            }
        }

        return moved;
    }

    private static void printRedistributionStats(
            RedistributionStats stats) {

        System.out.println(
                "\n===== REDISTRIBUTION RESULTS =====");

        System.out.println(
                "Modulo moved keys: "
                        + stats.getModuloMoved()
        );

        System.out.println(
                "Consistent hashing moved keys: "
                        + stats.getConsistentMoved()
        );
    }

    // UTILITIES

    private static String generateKey(int index) {

        return "URL-" + index;
    }
}