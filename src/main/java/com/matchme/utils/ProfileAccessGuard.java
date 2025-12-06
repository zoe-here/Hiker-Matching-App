package com.matchme.utils;

import com.matchme.services.RelationshipService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class ProfileAccessGuard {
    private final RelationshipService relationshipService;
    public ProfileAccessGuard(RelationshipService relationshipService) {
        this.relationshipService = relationshipService;
    }

    public void checkAccess(Long viewerId, Long targetId) {
        if (!relationshipService.canAccessProfile(viewerId, targetId)) {
            throw new AccessDeniedException("Access denied");
        }
    }
}
