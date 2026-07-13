package org.raftywate.urlshortenerwithconsistenthashing.hashing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.TreeMap;

@Service
public class ConsistentHashingService {

    private final TreeMap<Integer, String> ring = new TreeMap<>();
    private static final int VIRTUAL_NODES = 100;

    public ConsistentHashingService() {
        this(3);
    }

    @Autowired
    public ConsistentHashingService(@Value("${app.shards.active-count:3}") int activeShardsCount) {
        System.out.println("Initializing Consistent Hash Ring with active shard count: " + activeShardsCount);
        for (int i = 0; i < activeShardsCount; i++) {
            addNode("shard_" + i);
        }
    }

    public int getHash(String key) {

        try {

            MessageDigest md = MessageDigest.getInstance("MD5");

            byte[] digest = md.digest(key.getBytes());

            int hash = ((digest[0] & 0xFF) << 24)
                    | ((digest[1] & 0xFF) << 16)
                    | ((digest[2] & 0xFF) << 8)
                    | (digest[3] & 0xFF);

            return hash & 0x7fffffff;

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public void addNode(String nodeName) {

        for (int i = 0; i < VIRTUAL_NODES; i++) {

            String virtualNodeName = nodeName + "#VN" + i;

            int hash = getHash(virtualNodeName);

            ring.put(hash, nodeName);

            System.out.println(virtualNodeName +
                    " added at " + hash);
        }
    }

    public String getNode(String key) {

        if (ring.isEmpty()) {
            return null;
        }

        int hash = getHash(key);

        // Find first node clockwise
        Integer nodeHash = ring.ceilingKey(hash);

        // Wrap around ring
        if (nodeHash == null) {
            nodeHash = ring.firstKey();
        }

        return ring.get(nodeHash);
    }

    public void printRing() {
        System.out.println(ring);
    }

    public String getNodeModulo(String key, int serverCount) {

        int hash = Math.abs(key.hashCode());

        int serverIndex = hash % serverCount;

        return "Server-" + (char) ('A' + serverIndex);
    }

    public int getRingSize() {
        return ring.size();
    }
}