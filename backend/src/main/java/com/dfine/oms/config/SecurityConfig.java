package com.dfine.dfineoms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // explicitly permits all preflight OPTIONS requests so the browser isn't blocked
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/reviews/**",
                                "/api/variants/**",
                                "/api/inventory/**",
                                "/api/restock/**",
                                "/api/cart/**",
                                "/api/cart-item/**",
                                "/api/orders/**",
                                "/api/payments/**",
                                "/api/payment/**",
                                "/api/couriers/**",
                                "/api/courier/**",
                                "/api/courier",
                                "/api/shipments/**",
                                "/api/delivery/**",
                                "/api/bank-transfer/**",
                                "/api/cod/**"
                        ).permitAll()
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        // covers both the exact string and the Spring Security format
                        .requestMatchers("/api/admin/**").hasAnyAuthority(
                                "ADMIN", "MANAGER", "STORE_STAFF",
                                "ROLE_ADMIN", "ROLE_MANAGER", "ROLE_STORE_STAFF"
                        )
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // define the exact CORS rules
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Whitelist local Vite dev server, production custom domain, and GitHub Pages
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "https://d-fine.lk",
            "https://*.d-fine.lk",
            "https://*.github.io"
        ));
        // allows standard REST methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
