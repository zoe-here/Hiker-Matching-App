package com.matchme.entities;

import com.matchme.enums.ConnectionStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"requester_id", "recipient_id"})
)
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private Profile requester;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Profile recipient;

    @Enumerated(EnumType.STRING)
    private ConnectionStatus status;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public Connection() {}

    public Connection(Profile requester, Profile recipient, ConnectionStatus status) {
        this.requester = requester;
        this.recipient = recipient;
        this.status = status;
    }

    public Long getId() { return id; }

    public Profile getRequester() { return requester; }
    public void setRequester(Profile requester) { this.requester = requester;}

    public Profile getRecipient() { return recipient; }
    public void setRecipient(Profile recipient) { this.recipient = recipient;}

    public ConnectionStatus getStatus() { return status; }
    public void setStatus(ConnectionStatus status) { this.status = status;}

    public LocalDateTime getCreatedAt() { return createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
