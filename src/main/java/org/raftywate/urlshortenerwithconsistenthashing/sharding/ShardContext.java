package org.raftywate.urlshortenerwithconsistenthashing.sharding;

public class ShardContext {
    //ThreadLocal stores request-specific data per thread so each HTTP request may route to different shard
    //ThreadLocal means each thread gets its own private copy of variable(telling what the current request is for)
    //so, instead of a regular datatype such as String, we're using ThreadLocal<String>
    private static final ThreadLocal<String> currentShard =
            new ThreadLocal<>();

    public static void setCurrentShard(String shard) {
        currentShard.set(shard);
    }

    public static String getCurrentShard() {
        return currentShard.get();
    }

    public static void clear() {
        currentShard.remove();
    }
}