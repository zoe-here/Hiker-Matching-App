package com.matchme.controllers;


import com.matchme.dto.*;
import com.matchme.services.CustomUserDetails;
import com.matchme.utils.ProfileAccessGuard;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


import com.matchme.services.ProfileService;
import com.matchme.entities.Profile;


@RestController
@RequestMapping("v1/api/users")
public class UserController {

    private final ProfileService profileService;
    private final ProfileAccessGuard profileAccessGuard;

    public UserController(ProfileService profileService, ProfileAccessGuard profileAccessGuard) {
        this.profileService = profileService;
        this.profileAccessGuard = profileAccessGuard;
    }
    //get About Me section of a user
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}/profile")
    public UserAboutMeResponseDTO getUserAboutMe(@PathVariable Long id,
                                                 @AuthenticationPrincipal CustomUserDetails user) {
        profileAccessGuard.checkAccess(user.getId(), id);
        Profile profile = profileService.getProfileById(id);
        return UserAboutMeResponseDTO.fromProfile(profile);
    }

    //get Name and Picture section of a user
    @GetMapping("/{id}")
    public NamePictureResponseDTO getUserNamePicture(@PathVariable Long id,
                                                     @AuthenticationPrincipal CustomUserDetails user) {
        profileAccessGuard.checkAccess(user.getId(), id);
        Profile profile = profileService.getProfileById(id);
        return NamePictureResponseDTO.fromProfile(profile);
    }
    //get Bio Data section of a user
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}/bio")
    public BioDataResponseDTO getUserBioData(@PathVariable Long id,
                                             @AuthenticationPrincipal CustomUserDetails user) {
        profileAccessGuard.checkAccess(user.getId(), id);
        Profile profile = profileService.getProfileById(id);
               return BioDataResponseDTO.fromProfile(profile);
    }

    //get User Preferences section of a user
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{id}/preferences")
    public PreferenceResponseDTO getUserPreferences(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails user) {
        profileAccessGuard.checkAccess(user.getId(), id);
        Profile profile = profileService.getProfileById(id);
        return PreferenceResponseDTO.fromProfile(profile);
    }




}
