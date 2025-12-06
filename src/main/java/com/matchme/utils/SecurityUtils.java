package com.matchme.utils;

import com.matchme.services.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

// A utility class for security related helper methods
public class SecurityUtils {
    private SecurityUtils() {}

    // Securely fetch the unique ID of the currently authenticated user from the Spring Security context
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // The principal is our CustomUserDetails object
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // Return the ID directly from the in-memory object
        return userDetails.getId();
    }
}
