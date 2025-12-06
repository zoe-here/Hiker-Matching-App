package com.matchme.entities;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
     indexes = {
        // Fast lookup from connection to chat
        @Index(name = "idx_chat_connection", columnList = "connection_id"),
        // Fast sort for chat list
        @Index(name = "idx_chat_last_message", columnList = "last_message_at")
     }
)
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long connectionId;

    // Note: In our service layer, this will store the smaller of the two user IDs
    @Column(nullable = false)
    private Long user1Id;

    @Column(nullable = false)
    private Long user2Id;

    // Track when user last viewed the chat to determine unread status
    private LocalDateTime user1LastReadAt;
    private LocalDateTime user2LastReadAt;

    // Timestamp of the most recent message, used for sorting the chat list
    private LocalDateTime lastMessageAt;


    public Long getId() { return id; }

    public Long getConnectionId() { return connectionId; }
    public void setConnectionId(Long connectionId) { this.connectionId = connectionId; }

    public Long getUser1Id() { return user1Id; }
    public void setUser1Id(Long user1Id) { this.user1Id = user1Id; }

    public Long getUser2Id() { return user2Id; }
    public void setUser2Id(Long user2Id) { this.user2Id = user2Id; }

    public LocalDateTime getUser1LastReadAt() { return user1LastReadAt; }
    public void setUser1LastReadAt(LocalDateTime user1LastReadAt) {
        this.user1LastReadAt = user1LastReadAt;
    }

    public LocalDateTime getUser2LastReadAt() { return user2LastReadAt; }
    public void setUser2LastReadAt(LocalDateTime user2LastReadAt) {
        this.user2LastReadAt = user2LastReadAt;
    }

    public LocalDateTime getLastMessageAt() {
        return lastMessageAt;
    }
    public void setLastMessageAt(LocalDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }
}
