package org.raftywate.urlshortenerwithconsistenthashing.repository;

import org.raftywate.urlshortenerwithconsistenthashing.model.UrlLookup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UrlLookupRepository
        extends JpaRepository<UrlLookup, Long> {

    Optional<UrlLookup>
    findByOriginalUrl(String originalUrl);
}