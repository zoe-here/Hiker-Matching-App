package com.matchme.dto;

import com.matchme.entities.Connection;
import com.matchme.entities.Profile;

public record IncomingRequestDTO(
        Long connectionId,
        Long requesterId,
        String requesterFirstName,
        String requesterLastName,
        String requesterProfilePictureUrl
) {
    public static IncomingRequestDTO fromEntity(Connection connection) {
        Profile requester = connection.getRequester();
        return new IncomingRequestDTO(
                connection.getId(),
                requester.getId(),
                requester.getFirstName(),
                requester.getLastName(),
                requester.getProfilePictureUrl()
        );
    }
}
