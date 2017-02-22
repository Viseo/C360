package com.viseo.c360.formation.domain.training;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;

import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import com.viseo.c360.formation.domain.BaseEntity;
import com.viseo.c360.formation.domain.collaborator.Collaborator;

@Entity
public class TrainingSession extends BaseEntity {

	@NotNull
	@Valid
	@ManyToOne
	Training training;

	@NotNull
	Date beginning;

	@NotNull
	Date ending;
	
	String location;

	@NotNull
	@Valid
	@ManyToMany
	List<Collaborator> collaborators;

	public TrainingSession() {
		super();
		this.collaborators = new ArrayList<>();
	}
	public Training getTraining() {
		return training;
	}
	public Date getBeginning() {
		return beginning;
	}
	public Date getEnding() {
		return ending;
	}
	public String getLocation() {
		return location;
	}
	public void setTraining(Training training) {
		this.training = training;
	}
	public void setBeginning(Date dateDebut) {
		this.beginning = dateDebut;
	}
	public void setEnding(Date dateFin) {
		this.ending = dateFin;
	}
	public void setLocation(String location) {
		this.location = location;
	}

	public List<Collaborator> getCollaborators() {
		return Collections.unmodifiableList(collaborators);
	}
	public void addCollaborator(Collaborator collaborator) {
		this.collaborators.add(collaborator);
	}
	public void removeCollaborator(Collaborator collaborator) {
		this.collaborators.remove(collaborator);
	}
	public void removeCollaborators(){
		this.collaborators.clear();
	}
}
