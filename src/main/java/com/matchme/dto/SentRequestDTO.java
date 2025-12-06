package com.matchme.dto;

import com.matchme.entities.Connection;
import com.matchme.entities.Profile;

public record SentRequestDTO(
        Long connectionId,
        Long recipientId,
        String recipientFirstName,
        String recipientLastName,
        String recipientProfilePictureUrl
) {
    public static SentRequestDTO fromEntity(Connection connection) {
        Profile recipient = connection.getRecipient();
        return new SentRequestDTO(
                connection.getId(),
                recipient.getId(),
                recipient.getFirstName(),
                recipient.getLastName(),
                recipient.getProfilePictureUrl()
        );
    }
}
