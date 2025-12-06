package com.matchme.controllers;

import com.matchme.dto.ConnectionRequestDTO;
import com.matchme.dto.ConnectionResponseDTO;
import com.matchme.dto.ConnectedUserDTO;
import com.matchme.dto.IncomingRequestDTO;
import com.matchme.dto.SentRequestDTO;
import com.matchme.entities.Connection;
import com.matchme.services.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@RestController
@RequestMapping("/v1/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    public ResponseEntity<List<Long>> getAllConnections() {
        List<Long> connections = connectionService.getConnections();
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/accepted-with-details")
    public ResponseEntity<List<ConnectedUserDTO>> getAcceptedConnectionsWithDetails() {
        List<ConnectedUserDTO> connections = connectionService.getAcceptedConnectionsWithUserDetails();
        return ResponseEntity.ok(connections);
    }

    @GetMapping("/requests")
    public ResponseEntity<List<IncomingRequestDTO>> getAllRequests() {
        List<Connection> requests = connectionService.getIncomingRequests();
        List<IncomingRequestDTO> response = requests.stream()
                .map(IncomingRequestDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<SentRequestDTO>> getAllSentRequests() {
        List<Connection> requests = connectionService.getOutgoingRequests();
        List<SentRequestDTO> response = requests.stream()
                .map(SentRequestDTO::fromEntity)
                .toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ConnectionResponseDTO> requestConnection(@Valid @RequestBody ConnectionRequestDTO request) {
        Connection connection = connectionService.requestConnection(request.getRecipientId());
        ConnectionResponseDTO response = ConnectionResponseDTO.fromEntity(connection);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionResponseDTO> acceptConnection(@PathVariable Long id) {
        Connection connection = connectionService.acceptConnection(id);
        ConnectionResponseDTO response = ConnectionResponseDTO.fromEntity(connection);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Void> rejectConnection(@PathVariable Long id) {
        connectionService.rejectConnection(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{targetUserId}")
    public ResponseEntity<Void> disconnect(@PathVariable Long targetUserId) {
        connectionService.disconnect(targetUserId);
        return ResponseEntity.noContent().build();
    }
}
