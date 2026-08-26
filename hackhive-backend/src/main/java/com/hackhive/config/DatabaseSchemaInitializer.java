package com.hackhive.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
@Slf4j
@RequiredArgsConstructor
public class DatabaseSchemaInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // MySQL schema fix for Phase 6: External Event Team Creation
            // Ensures teams.event_id accepts NULL for external event teams while retaining foreign key constraints
            jdbcTemplate.execute("ALTER TABLE teams MODIFY COLUMN event_id BIGINT NULL");
            log.info("Schema migration executed successfully: teams.event_id column updated to accept NULL.");
        } catch (Exception e) {
            log.warn("Database schema initialization warning (teams.event_id): {}", e.getMessage());
        }
    }
}
