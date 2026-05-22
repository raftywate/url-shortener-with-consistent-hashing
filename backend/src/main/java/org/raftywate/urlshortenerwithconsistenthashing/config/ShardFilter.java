package org.raftywate.urlshortenerwithconsistenthashing.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.raftywate.urlshortenerwithconsistenthashing.hashing.ConsistentHashingService;
import org.raftywate.urlshortenerwithconsistenthashing.sharding.ShardContext;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
//this filter runs exactly one per HTTP request
public class ShardFilter extends OncePerRequestFilter {

    private final ConsistentHashingService hashingService;

    public ShardFilter(
            ConsistentHashingService hashingService) {

        this.hashingService = hashingService;
    }

    //actual request interception point
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {

            String path = request.getRequestURI();

            if (path.length() > 1) {

                String shortCode = path.substring(1);

                String shard =
                        hashingService.getNode(shortCode);

                System.out.println(
                        "Request routed to: " + shard);

                ShardContext.setCurrentShard(shard);
            }

            //this means to continue the request now, w/o this, the request stops here
            filterChain.doFilter(request, response);

        } finally {

            ShardContext.clear();

            System.out.println(
                    "Shard context cleared");
        }
    }
}