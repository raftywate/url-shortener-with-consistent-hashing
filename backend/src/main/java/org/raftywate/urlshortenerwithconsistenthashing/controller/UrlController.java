package org.raftywate.urlshortenerwithconsistenthashing.controller;

import org.raftywate.urlshortenerwithconsistenthashing.ratelimit.RateLimitService;
import org.raftywate.urlshortenerwithconsistenthashing.service.UrlService;
import org.raftywate.urlshortenerwithconsistenthashing.dto.UrlRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import java.net.URI;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:5173")
public class UrlController {

    private final UrlService service;
    private final RateLimitService rateLimitService;

    public UrlController(UrlService service, RateLimitService rateLimitService) {
        this.service = service;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/shorten")
    //@Valid triggers validation on DTO before method executes
    public String shorten(@Valid @RequestBody UrlRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteUser();

        boolean allowed = rateLimitService.isAllowed(ipAddress);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }
//        System.out.println("Received URL: " + request.getUrl());
        return service.createShortUrl(request.getUrl());
    }

    @GetMapping("/r/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {

        String originalUrl = service.getOriginalUrl(shortCode);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }
}