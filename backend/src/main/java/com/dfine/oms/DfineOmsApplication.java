package com.dfine.oms;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(scanBasePackages = {"com.dfine.oms", "com.dfine.dfineoms"})
public class DfineOmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(DfineOmsApplication.class, args);
    }

    // Global CORS Configuration to explicitly trust the Vite React frontend
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("http://localhost:5173", "https://d-fine.lk", "https://*.d-fine.lk", "https://*.github.io")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            }
        };
    }
}
