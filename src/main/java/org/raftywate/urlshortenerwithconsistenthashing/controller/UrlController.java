package org.raftywate.urlshortenerwithconsistenthashing.controller;

import org.raftywate.urlshortenerwithconsistenthashing.dto.UrlRequest;
import org.raftywate.urlshortenerwithconsistenthashing.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.net.URI;

@RestController
public class UrlController {

    private final UrlService service;

    public UrlController(UrlService service) {
        this.service = service;
    }

    @PostMapping("/shorten")
    //@Valid triggers validation on DTO before method executes
    public String shorten(@Valid @RequestBody UrlRequest request) {
//        System.out.println("Received URL: " + request.getUrl());
        return service.createShortUrl(request.getUrl());
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {

        String originalUrl = service.getOriginalUrl(shortCode);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }
}