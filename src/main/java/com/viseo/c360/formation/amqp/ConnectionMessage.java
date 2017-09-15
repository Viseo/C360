package com.viseo.c360.formation.amqp;

import com.viseo.c360.formation.dto.collaborator.CollaboratorDescription;

import javax.inject.Inject;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

/**
 * Created by SJO3662 on 24/08/2017.
 */
public class ConnectionMessage implements Serializable {

    @Inject
    private CollaboratorDescription collaboratorDescription;

    private UUID Sequence;

    private String nameFileResponse;

    private Date messageDate;

    private String token;

    public UUID getSequence() {
        return Sequence;
    }

    public ConnectionMessage setSequence(UUID sequence) {
        this.Sequence = sequence;
        return this;
    }

    public String getToken() {
        return token;
    }

    public ConnectionMessage setToken(String token) {
        this.token = token;
        return this;
    }

    public CollaboratorDescription getCollaboratorDescription() {
        return collaboratorDescription;
    }

    public ConnectionMessage setCollaboratorDescription(CollaboratorDescription collaboratorDescription) {
        this.collaboratorDescription = collaboratorDescription;
        return this;
    }

    public Date getMessageDate() {
        return messageDate;
    }

    public ConnectionMessage setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
        return this;
    }

    public String getNameFileResponse() {
        return nameFileResponse;
    }

    public ConnectionMessage setNameFileResponse(String nameFileResponse) {
        this.nameFileResponse = nameFileResponse;
        return this;
    }
}
