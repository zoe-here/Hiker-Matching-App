package com.matchme.dto;

import jakarta.validation.constraints.NotNull;

public class ConnectionRequestDTO {
    @NotNull(message = "Recipient ID cannot be null")
    private Long recipientId;

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }
}
