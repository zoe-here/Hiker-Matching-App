package com.matchme.services;

import com.matchme.dto.ConnectedUserDTO;
import com.matchme.entities.Connection;
import com.matchme.entities.Profile;
import com.matchme.enums.ConnectionStatus;
import com.matchme.exceptions.ConnectionAlreadyExistsException;
import com.matchme.exceptions.InvalidRequestException;
import com.matchme.exceptions.ResourceNotFoundException;
import com.matchme.repositories.ConnectionRepository;
import com.matchme.repositories.ProfileRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import static com.matchme.utils.SecurityUtils.getCurrentUserId;
import java.util.List;


@Service
public class ConnectionService {
    private static final Logger logger = LoggerFactory.getLogger(ConnectionService.class);
    private final ProfileRepository profileRepository;
    private final ConnectionRepository connectionRepository;

    public ConnectionService(ProfileRepository profileRepository, ConnectionRepository connectionRepository) {
        this.profileRepository = profileRepository;
        this.connectionRepository = connectionRepository;
    }

    public List<Long> getConnections() {
        Long userId = getCurrentUserId();
        return connectionRepository.findConnectedUserIds(userId);
    }

    public List<ConnectedUserDTO> getAcceptedConnectionsWithUserDetails() {
        Long currentUserId = getCurrentUserId();
        // Get all connections where user is either requester or recipient and status is ACCEPTED
        List<Connection> acceptedConnections = connectionRepository
                .findAll()
                .stream()
                .filter(connection -> 
                    connection.getStatus() == ConnectionStatus.ACCEPTED &&
                    (connection.getRequester().getId().equals(currentUserId) || 
                     connection.getRecipient().getId().equals(currentUserId)))
                .toList();
        
        return acceptedConnections.stream()
                .map(connection -> {
                    // Determine which profile is the "other" user
                    Profile otherUser = connection.getRequester().getId().equals(currentUserId) 
                            ? connection.getRecipient() 
                            : connection.getRequester();
                    return ConnectedUserDTO.fromConnectionAndUser(connection, otherUser);
                })
                .toList();
    }

    public List<Connection> getIncomingRequests() {
        Long userId = getCurrentUserId();
        // Fetch all connection records where the current user is the recipient and the status is PENDING.
        return connectionRepository.findByRecipient_IdAndStatusOrderByCreatedAtDesc(userId, ConnectionStatus.PENDING);
    }

    public List<Connection> getOutgoingRequests() {
        Long userId = getCurrentUserId();
        return connectionRepository.findByRequester_IdAndStatusOrderByCreatedAtDesc(userId, ConnectionStatus.PENDING);
    }

    @Transactional
    public Connection requestConnection(Long recipientId) {
        Long requesterId = getCurrentUserId();
        ensureDifferentUsers(requesterId, recipientId);
        // Check if a connection already exists to prevent duplicates
        if (connectionRepository.existsByRequesterIdAndRecipientId(requesterId, recipientId)) {
            logger.warn("Duplicate connection request from user {} to user {}", requesterId, recipientId);
            throw new ConnectionAlreadyExistsException("A connection request already exists!");
        }
        Profile requester = profileRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found with ID: " + requesterId));
        Profile recipient = profileRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + recipientId));

        Connection connection = new Connection();
        connection.setRequester(requester);
        connection.setRecipient(recipient);
        connection.setStatus(ConnectionStatus.PENDING);

        logger.info("User {} requested connection with user {}", requesterId, recipientId);
        return connectionRepository.save(connection);
    }

    @Transactional
    public Connection acceptConnection(Long connectionId) {
        Long recipientId = getCurrentUserId();
        Connection connection = getPendingConnectionForRecipient(connectionId, recipientId);
        connection.setStatus(ConnectionStatus.ACCEPTED);
        logger.info("User {} accepted connection with user {}", recipientId, connection.getRequester().getId());
        return connectionRepository.save(connection);
    }

    @Transactional
    public void rejectConnection(Long connectionId) {
        Long recipientId = getCurrentUserId();
        Connection connection = getPendingConnectionForRecipient(connectionId, recipientId);
        connection.setStatus(ConnectionStatus.REJECTED);
        connectionRepository.save(connection);
        logger.info("User {} rejected connection request from user {}", recipientId, connection.getRequester().getId());
    }

    @Transactional
    public void disconnect(Long targetUserId) {
        Long userId = getCurrentUserId();
        ensureDifferentUsers(userId, targetUserId);
        Connection connection = connectionRepository.findAcceptedConnectionBetweenUsers(userId, targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No active connection between user: " + userId + " and user: " + targetUserId));
        connection.setStatus(ConnectionStatus.DISCONNECTED);
        connectionRepository.save(connection);
        logger.info("User {} disconnected with user {}", userId, targetUserId);
    }

    // Helper function to get pending connection and validate connection status
    private Connection getPendingConnectionForRecipient(Long connectionId, Long recipientId) {
        // Find the connection request
        Connection connection = connectionRepository.findByIdAndRecipient_Id(connectionId, recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection not found with ID: " + connectionId));
        ensureDifferentUsers(connection.getRequester().getId(), recipientId);
        // Validate the current status, only act on a PENDING request
        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new InvalidRequestException("This request has already been processed!");
        }
        return connection;
    }

    // Helper function to ensure they're different users
    private void ensureDifferentUsers(Long user1, Long user2) {
        if (user1.equals(user2)) {
            throw new InvalidRequestException("Cannot operate on yourself!");
        }
    }


}
