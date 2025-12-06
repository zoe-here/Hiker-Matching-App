package com.matchme.config;

import com.matchme.services.DataSeeder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class SeedDataConfig {
    // This CommandLineRunner bean will be created and run automatically on startup,
    // but ONLY when the "seed-data" profile is active
    @Bean
    @Profile("seed-data") // activate with --spring.profiles.active=seed-data
    public CommandLineRunner seedDataRunner(DataSeeder dataSeeder,
                                            // Default value is 100
                                            @Value("${seed.count:100}") int count) {
        return args -> {
            dataSeeder.seedProfiles(count);
        };
    }
}
