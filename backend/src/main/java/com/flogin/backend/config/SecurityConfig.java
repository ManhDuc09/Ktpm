package com.flogin.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With"));
        config.setExposedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public org.springframework.web.filter.CorsFilter corsFilter() {
        return new org.springframework.web.filter.CorsFilter(corsConfigurationSource());
    }



    // -------------------------------
    // SECURITY FILTER CHAIN CHUẨN
    // -------------------------------
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // BẬT CORS: Sử dụng cấu hình từ corsConfigurationSource()
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // TẮT CSRF vì bạn đang làm API
            .csrf(csrf -> csrf.disable())

            // HEADER BẢO MẬT
            .headers(headers -> headers
                .cacheControl(cache -> {})      // Cache-Control
                .contentTypeOptions(cto -> {})  // X-Content-Type-Options: nosniff
            )

            // CHO PHÉP TẤT CẢ OPTIONS (preflight)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }
    
}
