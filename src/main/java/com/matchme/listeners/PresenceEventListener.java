package com.matchme.listeners;

import com.matchme.dto.PresenceEventDTO;
import com.matchme.repositories.ConnectionRepository;
import com.matchme.services.PresenceService;
import com.matchme.utils.PresenceUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
public class PresenceEventListener {
    private static final Logger logger = LoggerFactory.getLogger(PresenceEventListener.class);
    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PresenceUtil presenceUtil;
    private final ConnectionRepository connectionRepository;

    public PresenceEventListener(PresenceService presenceService, SimpMessagingTemplate messagingTemplate, PresenceUtil presenceUtil, ConnectionRepository connectionRepository) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
        this.presenceUtil = presenceUtil;
        this.connectionRepository = connectionRepository;
    }

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        Long userId = presenceUtil.extractUserId(accessor);
        logger.info("Session {} connected for user {}.", sessionId, userId);
        // Check if the user was already online
        boolean wasAlreadyOnline = presenceService.isUserOnline(userId);
        presenceService.userConnected(userId, sessionId);

        // Avoid sending redundant ONLINE events for users who are already online on another device
        if (!wasAlreadyOnline) {
            logger.info("User {} is now online. Broadcasting presence update.", userId);
            notifyConnections(userId, new PresenceEventDTO("USER_ONLINE", userId));
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        Long userId = presenceUtil.extractUserId(accessor);

        logger.info("Session {} disconnected for user {}.", sessionId, userId);
        presenceService.userDisconnected(userId, sessionId);
        // Only broadcast USER_OFFLINE if this was the user's last active session
        if (!presenceService.isUserOnline(userId)) {
            logger.info("User {} is now offline. Broadcasting presence update.", userId);
            notifyConnections(userId, new PresenceEventDTO("USER_OFFLINE", userId));
        }
    }

    // Helper method to restrict presence broadcasts to connected users only
    private void notifyConnections(Long userId, PresenceEventDTO event) {
        List<Long> connectedUserIds = connectionRepository.findConnectedUserIds(userId);
        for (Long connectedUserId : connectedUserIds) {
            // .toString() ensure the routing key matches Spring's internal expectations
            messagingTemplate.convertAndSendToUser(connectedUserId.toString(), "/queue/presence", event);
        }
    }
}
