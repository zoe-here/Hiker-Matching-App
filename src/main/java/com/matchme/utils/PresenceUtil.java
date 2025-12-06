package com.matchme.utils;

import com.matchme.services.CustomUserDetails;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class PresenceUtil {
    public Long extractUserId(StompHeaderAccessor accessor) {
        Authentication auth = (Authentication) accessor.getUser();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails customUser) {
            return customUser.getId();
        } else {
            throw new AccessDeniedException("Access denied");
        }
    }
}
