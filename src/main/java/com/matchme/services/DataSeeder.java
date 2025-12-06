package com.matchme.services;

import com.github.javafaker.Faker;
import com.matchme.entities.Profile;
import com.matchme.enums.*;
import com.matchme.repositories.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.util.*;

@Service
public class DataSeeder {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    // Using a fixed seed ensures the output remains the same, make testing and reviews reproducible
    private final Random random = new Random(42);
    private final Faker faker = new Faker(random);

    private final PasswordEncoder passwordEncoder;
    private final ProfileRepository profileRepository;

    // Cache to avoid repeatedly calling values() on the enums
    private static final Gender[] GENDERS = Gender.values();
    private static final ExperienceLevel[] EXP_LEVELS = ExperienceLevel.values();
    private static final Pace[] PACES = Pace.values();
    private static final Region[] REGIONS = Region.values();
    private static final Language[] LANGUAGES = Language.values();
    private static final HikeType[] HIKE_TYPES = HikeType.values();

    public DataSeeder(ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public void seedProfiles(int count) {
        log.info("Seeding {} profiles...", count);

        final int batchSize = 50;
        int savedCount = 0;

        for (int i = 0; i < count; i++) {
            String email = "seed.user." + i + "@email.test";
            // Check if profile already exists, allow to re-run without error
            if (profileRepository.existsByEmail(email)) continue;

            String rawPassword = "Password123!";
            Profile profile = new Profile();
            // Basic info
            profile.setFirstName(faker.name().firstName());
            profile.setLastName(faker.name().lastName());
            profile.setEmail(email);
            profile.setPassword(passwordEncoder.encode(rawPassword));
            profile.setBirthDate(faker.date().birthday(18, 60).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
            profile.setAboutMe(faker.lorem().paragraph(2));
            profile.setGender(pickOne(GENDERS));
            profile.setProfilePictureUrl(null);
            // Own Hiking Data
            profile.setOwnExperienceLevel(pickOne(EXP_LEVELS));
            profile.setOwnPace(pickOne(PACES));
            profile.setOwnRegion(pickOne(REGIONS));
            profile.setOwnLanguages(pickEnumSet(LANGUAGES, 1, 3));
            profile.setOwnHikeTypes(pickEnumSet(HIKE_TYPES, 2, 5));
            // Preferred Hiking Partner Data
            profile.setPreferredExperienceLevel(pickOne(EXP_LEVELS));
            profile.setPreferredPace(pickOne(PACES));
            profile.setPreferredRegion(pickOne(REGIONS));
            profile.setPreferredLanguages(pickEnumSet(LANGUAGES, 1, 3));
            profile.setPreferredHikeTypes(pickEnumSet(HIKE_TYPES,2, 5));

            profile.setProfileCompleted(true);
            try {
                profileRepository.save(profile);
                savedCount++;
            } catch (DataIntegrityViolationException e) {
                log.error("Failed to save seeded profile email = {}", email, e);
            }

            if (savedCount % batchSize == 0) {
                // Reduce memory pressure and push inserts in batches
                profileRepository.flush();
            }
        }
        profileRepository.flush();
        log.info("Data seeding completed with {} profiles", savedCount);
    }

    // Helper method to get a random value from any enum array
    private <T extends Enum<T>> T pickOne(T[] values) {
        return values[random.nextInt(values.length)];
    }

    // Helper method to get a random enum set
    private <T extends Enum<T>> Set<T> pickEnumSet(T[] values, int min, int max) {
        int size = min + random.nextInt(Math.max(1, max - min + 1));
        List<T> pool = new ArrayList<>(List.of(values));
        Collections.shuffle(pool, random);

        EnumSet<T> set = EnumSet.noneOf(values[0].getDeclaringClass());
        for (int i = 0; i < Math.min(size, pool.size()); i++) {
            set.add(pool.get(i));
        }
        return set;
    }
}
