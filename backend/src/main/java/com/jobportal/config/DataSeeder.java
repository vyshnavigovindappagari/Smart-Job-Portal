package com.jobportal.config;

import com.jobportal.entity.Category;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.repository.CategoryRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCategories();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@jobportal.com")) {
            User admin = User.builder()
                    .fullName("Portal Administrator")
                    .email("admin@jobportal.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .blocked(false)
                    .build();
            userRepository.save(admin);
            System.out.println(">>> Default admin created: admin@jobportal.com / Admin@123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            String[] defaults = {
                    "Information Technology", "Marketing", "Sales", "Finance",
                    "Human Resources", "Design", "Customer Support", "Engineering"
            };
            for (String name : defaults) {
                categoryRepository.save(Category.builder().name(name).build());
            }
            System.out.println(">>> Default job categories seeded");
        }
    }
}
