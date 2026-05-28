package org.raftywate
        .urlshortenerwithconsistenthashing
        .controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import org.raftywate
        .urlshortenerwithconsistenthashing
        .dto.UrlRequest;

import org.raftywate
        .urlshortenerwithconsistenthashing
        .ratelimit.RateLimitService;

import org.raftywate
        .urlshortenerwithconsistenthashing
        .service.UrlService;

import static org.mockito.ArgumentMatchers.anyString;

import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UrlController.class)
class UrlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UrlService urlService;

    @MockBean
    private RateLimitService rateLimitService;

    @Test
    void shouldShortenUrlSuccessfully()
            throws Exception {

        UrlRequest request =
                new UrlRequest();

        request.setUrl(
                "https://google.com"
        );

        when(
                rateLimitService
                        .isAllowed(anyString())
        ).thenReturn(true);

        when(
                urlService.createShortUrl(
                        anyString()
                )
        ).thenReturn("abc123");

        mockMvc.perform(

                        post("/shorten")

                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )

                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isOk());
    }

    @Test
    void shouldRejectWhenRateLimitExceeded()
            throws Exception {

        UrlRequest request =
                new UrlRequest();

        request.setUrl(
                "https://google.com"
        );

        when(
                rateLimitService
                        .isAllowed(anyString())
        ).thenReturn(false);

        mockMvc.perform(

                        post("/shorten")

                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )

                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(
                        status()
                                .isTooManyRequests()
                );
    }

    @Test
    void shouldRejectInvalidRequest()
            throws Exception {

        UrlRequest request =
                new UrlRequest();

        request.setUrl("");

        mockMvc.perform(

                        post("/shorten")

                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )

                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(status().isBadRequest());
    }
}