package org.raftywate.urlshortenerwithconsistenthashing.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "url_lookup")
public class UrlLookup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(
            name = "original_url",
            unique = true,
            nullable = false,
            length = 2000
    )
    private String originalUrl;

    @Setter
    @Column(
            name = "short_code",
            nullable = false,
            unique = true
    )
    private String shortCode;

    @Setter
    @Column(
            name = "is_demo",
            nullable = false
    )
    private boolean isDemo = false;

}