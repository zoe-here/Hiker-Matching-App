package com.matchme.controllers;

import com.matchme.dto.*;
import com.matchme.services.AuthService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.matchme.dto.MyAboutMeResponseDTO;
import com.matchme.dto.UserBioDataDTO;
import com.matchme.dto.UserNameDTO;
import com.matchme.dto.UserNameResponseDTO;
import com.matchme.dto.UserPreferenceDTO;
import com.matchme.entities.Profile;
import com.matchme.services.ProfileService;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static com.matchme.utils.SecurityUtils.getCurrentUserId;

@RestController
@RequestMapping("/v1/api/me")
public class MeController {
    
    private final ProfileService profileService;
    private final AuthService authService;


    public MeController(ProfileService profileService, AuthService authService) {
        this.profileService = profileService;
        this.authService = authService;
    }

    //which is a shortcut to /users/{id} for the authenticated user.
    @GetMapping("/")
    public NamePictureResponseDTO getCurrentUserNamePicture() {
        Long userId = getCurrentUserId();
        Profile profile = profileService.getProfileById(userId);
        return NamePictureResponseDTO.fromProfile(profile);
    }

    //AboutMe section of the authenticated user
    @GetMapping("/profile")
    public MyAboutMeResponseDTO getCurrentUserAboutMe() {
        Long userId = getCurrentUserId();
        Profile profile = profileService.getProfileById(userId);
        return MyAboutMeResponseDTO.fromProfile(profile);
    }
    //BioData section of the authenticated user
    @GetMapping("/bio")
    public BioDataResponseDTO getCurrentUserBio() {
        Long userId = getCurrentUserId();
        Profile profile = profileService.getProfileById(userId);
        return BioDataResponseDTO.fromProfile(profile);
    }

    // Preferences section of the authenticated user
    @GetMapping("/preferences")
    public PreferenceResponseDTO getCurrentUserPreferences() {
        Long userId = getCurrentUserId();
        Profile profile = profileService.getProfileById(userId);
        return PreferenceResponseDTO.fromProfile(profile);
    }

    @PutMapping("/preferences")
    public PreferenceResponseDTO updateCurrentUserPreferences(@RequestBody UserPreferenceDTO preferences) {
        Long userId = getCurrentUserId();
        Profile profile = profileService.updateUserPreferences(userId, preferences);
        return PreferenceResponseDTO.fromProfile(profile);
    }

    @PutMapping("/name")
    public UserNameResponseDTO updateCurrentUserName(@Valid @RequestBody UserNameDTO userNameDTO) {
        Long userId = getCurrentUserId();
        Profile profile = profileService.updateUserName(userId, userNameDTO);
        return UserNameResponseDTO.fromProfile(profile);
    }

    @PutMapping("/bio")
    public BioDataResponseDTO updateCurrentUserBio(@Valid @RequestBody UserBioDataDTO userBioDataDTO) {
        Long userId = getCurrentUserId();
        Profile profile = profileService.updateUserBio(userId, userBioDataDTO);
        return BioDataResponseDTO.fromProfile(profile);
    }

    @PutMapping("/profile")
    public UserAboutMeResponseDTO updateCurrentUserAboutMe(@Valid @RequestBody UserAboutMeDTO userAboutMeDTO) {
        Long userId = getCurrentUserId();
        Profile profile = profileService.updateUserAboutMe(userId, userAboutMeDTO);
        return UserAboutMeResponseDTO.fromProfile(profile);
    }

    @PutMapping("/email")
    public ResponseEntity<Void> updateMyEmail(@Valid @RequestBody UpdateEmailDTO updateEmailDTO) {
        Long userId = getCurrentUserId();
        authService.updateUserEmail(userId, updateEmailDTO);
        // Return 204 No Content to signal success without a body
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updateMyPassword(@Valid @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        Long userId = getCurrentUserId();
        authService.updateUserPassword(userId, updatePasswordDTO);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    // <?> signifies the response body can be of any type
    public ResponseEntity<?> uploadProfilePicture(@Parameter(description = "Image file", required = true)
                                                      @RequestPart("file") MultipartFile file) {
        // Check if the uploaded file is empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }
        Long userId = getCurrentUserId();
        String pictureUrl = profileService.updateProfilePicture(userId, file);
        return ResponseEntity.ok(Map.of("url", pictureUrl));
    }

    @DeleteMapping("/profile-picture")
    public ResponseEntity<?> deleteProfilePicture() {
        Long userId = getCurrentUserId();
        profileService.deleteProfilePicture(userId);
        return ResponseEntity.ok().body("Profile picture deleted");
    }

}