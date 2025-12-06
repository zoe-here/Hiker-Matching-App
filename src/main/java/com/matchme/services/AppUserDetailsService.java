package com.matchme.services;

import com.matchme.entities.Profile;
import com.matchme.repositories.ProfileRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// This service acts as the bridge between Spring Security and our application's user data
@Service
public class AppUserDetailsService implements UserDetailsService {

    private final ProfileRepository profileRepository;

    public AppUserDetailsService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    // This method is called by Spring Security's AuthenticationManager to load user details
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Profile userProfile = profileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        // Return a new custom UserDetails object, which will be
        // placed in the security context after a successful login
        return new CustomUserDetails(userProfile);
    }
}
