package org.raftywate.urlshortenerwithconsistenthashing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UrlShortenerWithConsistentHashingApplication {

    public static void main(String[] args) {
        SpringApplication.run(UrlShortenerWithConsistentHashingApplication.class, args);
    }

}
