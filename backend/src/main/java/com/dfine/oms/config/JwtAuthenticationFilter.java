package com.dfine.dfineoms.config;

import com.dfine.dfineoms.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // if there is no token, or it doesn't start with "Bearer ", reject and move on
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // extract the raw token string (removing the "Bearer " prefix)
        final String jwt = authHeader.substring(7);

        if (jwtUtil.validateToken(jwt)) {
            String email = jwtUtil.extractEmail(jwt);
            String role = jwtUtil.extractRole(jwt); // extract the role claim from the token
            System.out.println("=== THE JWT ROLE IS: [" + role + "] ===");

            // if the token is valid and no one is currently logged in to this request thread
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // converts the string role into a Spring Security granted authority
                List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role));

                // creates an official Spring Security authentication token including the authorities
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        email, null, authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // saves it to the context so controllers can extract the Principal and roles are enforced
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}