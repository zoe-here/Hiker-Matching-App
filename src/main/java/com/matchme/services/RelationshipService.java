package com.matchme.services;

import com.matchme.enums.ConnectionStatus;
import com.matchme.repositories.ConnectionRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RelationshipService {

    private final ConnectionRepository connectionRepository;
    private final Map<Long, List<Long>> recommendedUsersCache = new ConcurrentHashMap<>();

    public RelationshipService(ConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }

    public boolean canAccessProfile(Long viewerId, Long targetId) {
        return isConnected(viewerId, targetId) ||
               hasPendingRequest(viewerId, targetId) ||
               isRecommended(viewerId, targetId);
    }
    public boolean isConnected(Long viewerId, Long targetId) {
        return connectionRepository.existsConnectionBetween(viewerId, targetId, ConnectionStatus.ACCEPTED);
    }

    public boolean hasPendingRequest(Long viewerId, Long targetId) {
        return connectionRepository.existsConnectionBetween(viewerId, targetId, ConnectionStatus.PENDING);
    }

    public boolean isRecommended(Long viewerId, Long targetId) {
        return recommendedUsersCache
                .getOrDefault(viewerId, Collections.emptyList())
                .contains(targetId);
    }

    public void setRecommendedUsersCache(Long viewerId, List<Long> recommendedIds) {
        // Overwrite the list each time the user fetches new recommendations
        recommendedUsersCache.put(viewerId, recommendedIds);
    }
}
