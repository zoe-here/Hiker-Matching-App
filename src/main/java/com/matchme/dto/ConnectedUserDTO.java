package com.matchme.dto;

import com.matchme.entities.Connection;
import com.matchme.entities.Profile;

import java.time.LocalDateTime;

public record ConnectedUserDTO(
        Long connectionId,       // Connection ID for chat functionality
        Long userId,            // Other user's ID  
        String firstName,       // User details for display
        String lastName,
        String profilePictureUrl,
        LocalDateTime connectedAt
) {
    public static ConnectedUserDTO fromConnectionAndUser(Connection connection, Profile otherUser) {
        return new ConnectedUserDTO(
                connection.getId(),                    // connectionId
                otherUser.getId(),                    // userId
                otherUser.getFirstName(),             // firstName
                otherUser.getLastName(),              // lastName
                otherUser.getProfilePictureUrl(),     // profilePictureUrl
                connection.getCreatedAt()             // connectedAt
        );
    }
}
