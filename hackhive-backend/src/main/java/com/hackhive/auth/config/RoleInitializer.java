package com.hackhive.auth.config;

import com.hackhive.auth.entity.Role;
import com.hackhive.auth.repository.RoleRepository;
import com.hackhive.common.enums.RoleType;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        createRoleIfNotExists(RoleType.STUDENT);
        createRoleIfNotExists(RoleType.ORGANIZER);
        createRoleIfNotExists(RoleType.ADMIN);

    }

    private void createRoleIfNotExists(RoleType roleType) {

        if (!roleRepository.existsByName(roleType)) {

            Role role = Role.builder()
                    .name(roleType)
                    .build();

            roleRepository.save(role);
        }
    }
}