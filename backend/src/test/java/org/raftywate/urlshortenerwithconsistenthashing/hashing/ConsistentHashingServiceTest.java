package org.raftywate
        .urlshortenerwithconsistenthashing
        .hashing;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class ConsistentHashingServiceTest {

    private final ConsistentHashingService
            hashingService =
            new ConsistentHashingService();

    @Test
    void sameKeyShouldAlwaysMapToSameShard() {

        String first =
                hashingService.getNode(
                        "exampleKey"
                );

        String second =
                hashingService.getNode(
                        "exampleKey"
                );

        assertEquals(first, second);
    }

    @Test
    void hashFunctionShouldBeDeterministic() {

        int firstHash =
                hashingService.getHash(
                        "testKey"
                );

        int secondHash =
                hashingService.getHash(
                        "testKey"
                );

        assertEquals(
                firstHash,
                secondHash
        );
    }

    @Test
    void ringShouldContainVirtualNodes() {

        int expectedSize =
                3 * 100;

        assertEquals(
                expectedSize,
                hashingService.getRingSize()
        );
    }

    @Test
    void addingNodeShouldIncreaseRingSize() {

        int before =
                hashingService.getRingSize();

        hashingService.addNode(
                "shard_3"
        );

        int after =
                hashingService.getRingSize();

        assertTrue(after > before);
    }

    @Test
    void keysShouldDistributeAcrossShards() {

        Set<String> assignedShards =
                new HashSet<>();

        for (int i = 0; i < 1000; i++) {

            assignedShards.add(
                    hashingService.getNode(
                            "key-" + i
                    )
            );
        }

        assertTrue(
                assignedShards.size() > 1
        );
    }

    @Test
    void shouldWrapAroundRingCorrectly() {

        String shard =
                hashingService.getNode(
                        "veryLargeHashKey999999"
                );

        assertNotNull(shard);
    }

    @Test
    void addingNodeShouldCauseMinimalRedistribution() {

        ConsistentHashingService
                hashingService =
                new ConsistentHashingService();

        java.util.Map<String, String>
                beforeMapping =
                new java.util.HashMap<>();

        for (int i = 0; i < 1000; i++) {

            String key = "key-" + i;

            beforeMapping.put(
                    key,
                    hashingService.getNode(key)
            );
        }

        hashingService.addNode("shard_3");

        int remapped = 0;

        for (int i = 0; i < 1000; i++) {

            String key = "key-" + i;

            String after =
                    hashingService.getNode(key);

            if (
                    !beforeMapping
                            .get(key)
                            .equals(after)
            ) {

                remapped++;
            }
        }

        assertTrue(remapped < 400);
    }
}