package com.matchme.services;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

// Track online presence by storing sessionIds per userId
@Service
public class PresenceService {
    private final Map<Long, Set<String>> userSessions = new ConcurrentHashMap<>();

    public void userConnected(Long userId, String sessionId) {
        // Get the existing set of sessions for the user, or create a new one if it's their first session
        userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArraySet<>()).add(sessionId);
    }

    public void userDisconnected(Long userId, String sessionId) {
        Set<String> sessions = userSessions.get(userId);
        if (sessions != null) {
            sessions.remove(sessionId);
            // If the user has no more active sessions, remove them from the map
            if (sessions.isEmpty()) {
                userSessions.remove(userId);
            }
        }
    }

    public boolean isUserOnline(Long userId) {
        return userSessions.containsKey(userId);
    }
}
