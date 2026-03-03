package com.autoflex.configuration;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.eclipse.microprofile.config.inject.ConfigProperty;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @ConfigProperty(name = "cors.allowed.origins", defaultValue = "http://localhost:5173")
    String allowedOrigins;

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {
        String requestOrigin = requestContext.getHeaderString("Origin");
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();

        if (requestOrigin != null && (origins.contains("*") || origins.contains(requestOrigin))) {
            responseContext.getHeaders().putSingle("Access-Control-Allow-Origin", requestOrigin);
            responseContext.getHeaders().putSingle("Access-Control-Allow-Credentials", "true");
            responseContext.getHeaders().putSingle("Vary", "Origin");
        }

        responseContext.getHeaders().putSingle("Access-Control-Allow-Headers",
                "origin, content-type, accept, authorization, x-requested-with");
        responseContext.getHeaders().putSingle("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
    }
}