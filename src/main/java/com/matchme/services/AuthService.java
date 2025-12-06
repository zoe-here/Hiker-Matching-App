package com.matchme.services;

import com.matchme.dto.*;
import com.matchme.entities.Profile;
import com.matchme.exceptions.ResourceNotFoundException;
import com.matchme.exceptions.UserAlreadyExistException;
import com.matchme.repositories.ProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfileService profileService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(ProfileRepository profileRepository, PasswordEncoder passwordEncoder, ProfileService profileService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.profileService = profileService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional // Ensure the entire registration process is a single transaction
    // Register a new user, handle email uniqueness check and password hashing
    // Delegate the profile creation to ProfileService
    public Profile register(RegisterDTO registerDto) {
        // 1. Check if email already exists
        checkIfEmailExists(registerDto.getEmail());
        // 2. Hash the plain-text password
        String hashedPassword = passwordEncoder.encode(registerDto.getPassword());
        /* 3. Delegate the actual creation of the Profile entity to the ProfileService
              Pass the original DTO (for profile data) and the hashed password */
        return profileService.createProfile(registerDto, hashedPassword);
    }

    // Authenticate a user and return a JWT upon successful login
    public LoginResponseDTO login (LoginDTO loginDto) {
        // 1. Authenticate using Spring Security's manager
        Authentication authentication = authenticationManager.authenticate(
                // Will automatically throw an AuthenticationException for login failure
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );
        // 2. Set the successful authentication in the Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        // 3. Extract userDetails from the authentication principal
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // 4. Call JwtService to create a token for this user
        String token = jwtService.generateToken(userDetails);
        // 5. Create and return the LoginResponse DTO
        return new LoginResponseDTO(
                token,
                userDetails.getId(),
                userDetails.getFirstName()
        );
    }

    @Transactional
    public void updateUserEmail(Long currentUserId, UpdateEmailDTO emailDTO) {
        // Call the helper function to verify current user
        Profile profile = verifyUser(currentUserId, emailDTO.getPassword());
        // Check if the new email is available
        checkIfEmailExists(emailDTO.getNewEmail());
        profile.setEmail(emailDTO.getNewEmail());
        profileRepository.save(profile);
    }

    @Transactional
    public void updateUserPassword(Long currentUserId, UpdatePasswordDTO passwordDTO) {
        Profile profile = verifyUser(currentUserId, passwordDTO.getCurrentPassword());
        profile.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        profileRepository.save(profile);
    }

    // Helper function to get user profile and verify the password
    private Profile verifyUser(Long userId, String password) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        if (!passwordEncoder.matches(password, profile.getPassword())) {
            throw new BadCredentialsException("Wrong password");
        }
        return profile;
    }

    // Helper function to check if email already exists
    private void checkIfEmailExists(String email) {
        profileRepository.findByEmail(email).ifPresent(profile -> {
            throw new UserAlreadyExistException("An account with the email '" + email + "' already exists");
        });
    }


}
