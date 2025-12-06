package com.matchme.repositories;

import com.matchme.entities.Connection;
import com.matchme.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    boolean existsByRequesterIdAndRecipientId(Long requesterId, Long recipientId);

    // Check for a connection status between two users
    @Query("""
        SELECT EXISTS (
            SELECT 1 FROM Connection c WHERE
            ((c.requester.id = :user1Id AND c.recipient.id = :user2Id) OR
             (c.requester.id = :user2Id AND c.recipient.id = :user1Id)) AND
            c.status = :status
        )
    """)
    boolean existsConnectionBetween(
            @Param("user1Id") Long user1Id,
            @Param("user2Id") Long user2Id,
            @Param("status") ConnectionStatus status);

    // For user to accept/decline a specific request
    // Ensure only the intended recipient can act on the request
    Optional<Connection> findByIdAndRecipient_Id(Long connectionId, Long recipientId);

    // Query for find the "friends list"
    @Query("""
    SELECT 
        CASE 
            WHEN c.requester.id = :userId THEN c.recipient.id 
            ELSE c.requester.id 
        END 
    FROM Connection c 
    WHERE c.status = 'ACCEPTED' 
      AND (c.requester.id = :userId OR c.recipient.id = :userId)
    """)
    List<Long> findConnectedUserIds(@Param("userId") Long userId);

    // Query to find an ACCEPTED connection between two users
    @Query("""
    SELECT c FROM Connection c
    WHERE c.status = 'ACCEPTED'
    AND ((c.requester.id = :userId1 AND c.recipient.id = :userId2) OR (c.requester.id = :userId2 AND c.recipient.id = :userId1))
    """)
    Optional<Connection> findAcceptedConnectionBetweenUsers(@Param("userId1") Long user1, @Param("userId2") Long user2);

    // Find all the received requests, newest connection requests always appear first
    List<Connection> findByRecipient_IdAndStatusOrderByCreatedAtDesc(Long recipientId, ConnectionStatus status);

    // Find all the requests sent by user
    List<Connection> findByRequester_IdAndStatusOrderByCreatedAtDesc(Long requesterId, ConnectionStatus status);

    // Find a connection by its ID only if it has a specific status
    Optional<Connection> findByIdAndStatus(Long id, ConnectionStatus status);
}
