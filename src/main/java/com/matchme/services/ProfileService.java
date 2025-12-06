package com.matchme.services;
import java.util.HashSet;

import com.matchme.exceptions.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.matchme.entities.Profile;
import com.matchme.repositories.ProfileRepository;
import com.matchme.dto.RegisterDTO;
import com.matchme.dto.UserPreferenceDTO;
import com.matchme.dto.UserBioDataDTO;
import com.matchme.dto.UserNameDTO;
import com.matchme.dto.UserAboutMeDTO;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ProfileService {
    // Define the default URL as a constant for easy maintenance
    private static final String DEFAULT_PROFILE_PICTURE_URL = null;

    // Define a logger
    private static final Logger logger = LoggerFactory.getLogger(ProfileService.class);
    private final ProfileRepository profileRepository;
    private final FileStorageService fileStorageService;

    // Constructor Injection (recommended)
    public ProfileService(ProfileRepository profileRepository, FileStorageService fileStorageService){
        this.profileRepository = profileRepository;
        this.fileStorageService = fileStorageService;
    }

    // Create new Profile entity
    @Transactional
    public Profile createProfile(RegisterDTO registerDto, String hashedPassword) {
        Profile newProfile = new Profile();

        // Map fields from DTO to Entity
        newProfile.setFirstName(registerDto.getFirstName());
        newProfile.setLastName(registerDto.getLastName());
        newProfile.setEmail(registerDto.getEmail());
        newProfile.setPassword(hashedPassword);
        newProfile.setBirthDate(registerDto.getBirthDate());
        newProfile.setGender(registerDto.getGender());
        // Map own hiking attributes
        newProfile.setOwnExperienceLevel(registerDto.getOwnExperienceLevel());
        newProfile.setOwnPace(registerDto.getOwnPace());
        newProfile.setOwnRegion(registerDto.getOwnRegion());
        newProfile.setOwnHikeTypes(new HashSet<>(registerDto.getOwnHikeTypes()));
        newProfile.setOwnLanguages(new HashSet<>(registerDto.getOwnLanguages()));
        // Initialize preference fields as empty or null
        newProfile.setPreferredExperienceLevel(null);
        newProfile.setPreferredPace(null);
        newProfile.setPreferredRegion(null);
        newProfile.setPreferredHikeTypes(new HashSet<>());
        newProfile.setPreferredLanguages(new HashSet<>());
        // Set default values for a new profile
        newProfile.setAboutMe(null);
        newProfile.setProfilePictureUrl(DEFAULT_PROFILE_PICTURE_URL);

        this.updateProfileCompletionStatus(newProfile);
        return profileRepository.save(newProfile);
    }

    // Retrieve a profile by ID, throw ResourceNotFoundException if no profile is found
    public Profile getProfileById(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
    }


    // Update user preferences
    @Transactional
    public Profile updateUserPreferences(Long id, UserPreferenceDTO preferences) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found with ID: " + id));
        profile.setPreferredExperienceLevel(preferences.getPreferredExperienceLevel());
        profile.setPreferredPace(preferences.getPreferredPace());
        profile.setPreferredRegion(preferences.getPreferredRegion());
        profile.setPreferredLanguages(preferences.getPreferredLanguages());
        profile.setPreferredHikeTypes(preferences.getPreferredHikeTypes());
        return profileRepository.save(profile);
    }

    // Update user name only
    @Transactional
    public Profile updateUserName(Long id, UserNameDTO dto) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        this.updateProfileCompletionStatus(profile);
        return profileRepository.save(profile);
    }

    // Update user bio data
    @Transactional
    public Profile updateUserBio(Long id, UserBioDataDTO dto) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        profile.setOwnExperienceLevel(dto.getOwnExperienceLevel());
        profile.setOwnPace(dto.getOwnPace());
        profile.setOwnRegion(dto.getOwnRegion());
        profile.setOwnLanguages(dto.getOwnLanguages());
        profile.setOwnHikeTypes(dto.getOwnHikeTypes());
        this.updateProfileCompletionStatus(profile);
        return profileRepository.save(profile);
    }

    // Update user about me 
    @Transactional
    public Profile updateUserAboutMe(Long id, UserAboutMeDTO dto) {
        Profile profile = profileRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        profile.setBirthDate(dto.getBirthDate());
        profile.setGender(dto.getGender());
        profile.setAboutMe(dto.getAboutMe());
        this.updateProfileCompletionStatus(profile);
        return profileRepository.save(profile);
    }

    // A helper function to check profile completion for recommendation
    private void updateProfileCompletionStatus(Profile profile) {
        boolean isComplete = profile.getFirstName() != null && !profile.getFirstName().isBlank() &&
                             profile.getLastName() != null && !profile.getLastName().isBlank() &&
                             profile.getBirthDate() != null &&
                             profile.getGender() != null &&
                             profile.getOwnExperienceLevel() != null &&
                             profile.getOwnPace() != null &&
                             profile.getOwnRegion() != null &&
                             profile.getOwnHikeTypes() != null && !profile.getOwnHikeTypes().isEmpty() &&
                             profile.getOwnLanguages() != null && !profile.getOwnLanguages().isEmpty();
        profile.setProfileCompleted(isComplete);
        logger.info("Current profile completion status for user ID {} : {}", profile.getId(), isComplete);
    }

    // Update user's profile picture
    @Transactional
    public String updateProfilePicture(Long id, MultipartFile profilePicture) {
        // Save the new picture to the filesystem and get its URL
        String pictureUrl = fileStorageService.storeFile(profilePicture);
        Profile profile = getProfileById(id);
        profile.setProfilePictureUrl(pictureUrl);
        profileRepository.save(profile);
        logger.info("User {} uploaded a new profile picture. URL: {}", id, pictureUrl);
        // Give the frontend instant access to the image path
        return pictureUrl;
    }

    // Delete user's profile picture and revert it back to the default placeholder image
    @Transactional
    public void deleteProfilePicture(Long id) {
        Profile profile = getProfileById(id);
        String pictureUrl = profile.getProfilePictureUrl();

        // Check if the current URL is not null AND not the default picture
        if (pictureUrl != null && !pictureUrl.equals(DEFAULT_PROFILE_PICTURE_URL)) {
            fileStorageService.deleteFile(pictureUrl); // Remove from disk
            logger.info("User {} deleted their profile picture", id);
        }
        // Revert the URL back to the default placeholder
        profile.setProfilePictureUrl(DEFAULT_PROFILE_PICTURE_URL);
        profileRepository.save(profile);
        logger.info("User {} reset profile picture to default", id);
    }
}



