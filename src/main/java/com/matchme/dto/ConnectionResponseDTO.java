package com.matchme.dto;

import com.matchme.entities.Connection;
import com.matchme.enums.ConnectionStatus;

import java.time.LocalDateTime;

public record ConnectionResponseDTO(
        Long id,
        Long requesterId,
        Long recipientId,
        ConnectionStatus status,
        LocalDateTime createAt
) {
    public static ConnectionResponseDTO fromEntity(Connection connection) {
        return new ConnectionResponseDTO(
                connection.getId(),
                connection.getRequester().getId(),
                connection.getRecipient().getId(),
                connection.getStatus(),
                connection.getCreatedAt()
        );
    }
}
