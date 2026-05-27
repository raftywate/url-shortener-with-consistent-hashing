CREATE SCHEMA IF NOT EXISTS shard_0;
CREATE SCHEMA IF NOT EXISTS shard_1;
CREATE SCHEMA IF NOT EXISTS shard_2;

CREATE TABLE IF NOT EXISTS shard_0.url_mapping (
    id BIGSERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shard_1.url_mapping (
    id BIGSERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shard_2.url_mapping (
    id BIGSERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP
);