package org.deneedo.geomap.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${client.IP}") private String clientIP;
    @Value("${client.PORT}") private String clientPORT;
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**") // Allow CORS for all endpoints
            .allowedOrigins("http://" + this.clientIP + ":" + this.clientPORT) // Specify allowed origins
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Specify allowed methods
            .allowedHeaders("*") // Allow all headers
            .allowCredentials(true); // Allow credentials
    }
}
