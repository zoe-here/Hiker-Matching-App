package com.matchme.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;


// This is all we need to make the "Authorize" button appear in Swagger
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "matchme API",
                version = "v1"
        ),
        // We are locking all endpoints with the key we named "bearerAuth"
        security = @SecurityRequirement(name = "bearerAuth")
)
// It tells Swagger that we are using an HTTP-based security scheme of the bearer type, which is the standard for JWTs.
// This is what generates the "Authorize" button and the dialog box that asks for a token
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenAPIConfig {
    // This empty class is to hold the global OpenAPI annotations
}
