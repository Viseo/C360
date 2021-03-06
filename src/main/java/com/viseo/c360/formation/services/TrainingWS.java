package com.viseo.c360.formation.services;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.inject.Inject;
import javax.persistence.PersistenceException;

import com.viseo.c360.formation.converters.Feedback.DescriptionToFeedback;
import com.viseo.c360.formation.converters.Feedback.FeedbackToDescription;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToDescription;
import com.viseo.c360.formation.converters.collaborator.CollaboratorToIdentity;
import com.viseo.c360.formation.converters.collaborator.DescriptionToCollaborator;
import com.viseo.c360.formation.converters.topic.DescriptionToTopic;
import com.viseo.c360.formation.converters.topic.TopicToDescription;
import com.viseo.c360.formation.converters.training.DescriptionToTraining;
import com.viseo.c360.formation.converters.training.TrainingToDescription;
import com.viseo.c360.formation.converters.trainingsession.TrainingSessionToDescription;

import com.viseo.c360.formation.converters.wish.DescriptionToWish;
import com.viseo.c360.formation.converters.wish.WishToDescription;
import com.viseo.c360.formation.dao.CollaboratorDAO;
import com.viseo.c360.formation.dao.TrainingDAO;
import com.viseo.c360.formation.domain.collaborator.Collaborator;
import com.viseo.c360.formation.domain.collaborator.Wish;
import com.viseo.c360.formation.domain.training.*;
import com.viseo.c360.formation.dto.collaborator.CollaboratorIdentity;
import com.viseo.c360.formation.dto.training.*;
import com.viseo.c360.formation.converters.trainingsession.DescriptionToTrainingSession;

import com.viseo.c360.formation.exceptions.C360Exception;
import com.viseo.c360.formation.exceptions.dao.UniqueFieldException;
import com.viseo.c360.formation.exceptions.dao.util.ExceptionUtil;
import com.viseo.c360.formation.exceptions.dao.util.UniqueFieldErrors;
import org.springframework.core.convert.ConversionException;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.viseo.c360.formation.exceptions.dao.PersistentObjectNotFoundException;


@RestController
public class TrainingWS {
    @Inject
    CollaboratorDAO collaboratorDAO;

    @Inject
    TrainingDAO trainingDAO;

    @Inject
    ExceptionUtil exceptionUtil;

    //Feedback
    @RequestMapping(value = "${endpoint.feedback}", method = RequestMethod.POST)
    @ResponseBody
    public FeedbackDescription addFeedback(@RequestBody FeedbackDescription myFeedbackDescription,@PathVariable Long collab_id) {
        try{
            Collaborator collaborator = collaboratorDAO.getCollaborator(collab_id);
            myFeedbackDescription.setCollaborator(new CollaboratorToDescription().convert(collaborator));
            myFeedbackDescription.setDate(new Date());
            myFeedbackDescription.setLikers(new ArrayList<>());
            Feedback feedback = trainingDAO.addFeedback(new DescriptionToFeedback().convert(myFeedbackDescription));
            return new FeedbackToDescription().convert(feedback);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.feedbacks}", method = RequestMethod.GET)
    @ResponseBody
    public List<FeedbackDescription> getAllFeedbacks() {
        return new FeedbackToDescription().convert(trainingDAO.getAllFeedbacks());
    }

    @RequestMapping(value = "${endpoint.trainingscore}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingScore> getTrainingsScore() {
        return trainingDAO.getTrainingsScore();
    }

    @RequestMapping(value = "${endpoint.trainingstogivefeedbacks}", method = RequestMethod.GET)
    @ResponseBody
    public List<Training> getTrainingsToGiveFeedbacks(@PathVariable Long collab_id) {
        Collaborator collaborator = collaboratorDAO.getCollaborator(collab_id);
        List<Training> training = trainingDAO.getTrainingsToGiveFeedbacks(collaborator);
        return training;
    }

    @RequestMapping(value = "${endpoint.feedbackcomment}", method = RequestMethod.GET)
    @ResponseBody
    public List<Feedback> getFeedbackByTraining(@PathVariable Long training_id) {
        Training training = trainingDAO.getTraining(training_id);
        List<Feedback> comment = trainingDAO.getFeedbackByTraining(training);
        return comment;
    }

    @RequestMapping(value = "${endpoint.deletefeedbackcomment}", method = RequestMethod.PUT)
    @ResponseBody
    public Feedback delateFeedbackComment(@RequestBody Feedback myFeedback) {
        Feedback feedback = trainingDAO.delateFeedbackComment(myFeedback);
        return feedback;
    }

    @RequestMapping(value = "${endpoint.addfeedbacklikes}", method = RequestMethod.PUT)
    @ResponseBody
    public Feedback addFeedbackLikes(@RequestBody Feedback myFeedback, @PathVariable Long collaborator_id) {
        Collaborator collaborator = collaboratorDAO.getCollaborator(collaborator_id);
        Feedback feedback = trainingDAO.addFeedbackLikes(myFeedback,collaborator);
        return feedback;
    }

    @RequestMapping(value = "${endpoint.removefeedbacklikes}", method = RequestMethod.PUT)
    @ResponseBody
    public Feedback removeFeedbackLikes(@RequestBody Feedback myFeedback, @PathVariable Long collaborator_id) {
        Collaborator collaborator = collaboratorDAO.getCollaborator(collaborator_id);
        Feedback feedback = trainingDAO.removeFeedbackLikes(myFeedback,collaborator);
        return feedback;
    }

    /***
     * Training
     ***/
    @RequestMapping(value = "${endpoint.trainings}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingDescription addTraining(@RequestBody TrainingDescription myTrainingDescription) {
        try {
            long topicId = myTrainingDescription.getTopicDescription().getId();
            Topic topic = trainingDAO.getTopic(topicId);
            if (topic == null) throw new PersistentObjectNotFoundException(topicId, Topic.class);
            Training training = trainingDAO.addTraining(new DescriptionToTraining().convert(myTrainingDescription, topic));
            return new TrainingToDescription().convert(training);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if(uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.trainings}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingDescription> getAllTrainingsDescriptions() {
        return new TrainingToDescription().convert(trainingDAO.getAllTrainings());
    }

    //update training topic
    @RequestMapping(value = "${endpoint.trainingtopic}", method = RequestMethod.PUT)
    @ResponseBody
    public TrainingDescription updateTrainingTopic(@PathVariable String trainingTopic, @PathVariable String formationId) {
        try {
            Training training= trainingDAO.getTraining(Long.parseLong(formationId));
            if(training == null) throw new PersistentObjectNotFoundException(15,Training.class);
            training = trainingDAO.updateTrainingTopic(training, trainingTopic);
            return new TrainingToDescription().convert(training);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    /***
     * Topic
     ***/
    @RequestMapping(value = "${endpoint.topics}", method = RequestMethod.POST)
    @ResponseBody
    public TopicDescription addTopic(@RequestBody TopicDescription topicDescription) {
        try {
            Topic topic = trainingDAO.addTopic(new DescriptionToTopic().convert(topicDescription));
            return new TopicToDescription().convert(topic);
        } catch (PersistenceException pe) {
            UniqueFieldErrors uniqueFieldErrors = exceptionUtil.getUniqueFieldError(pe);
            if (uniqueFieldErrors == null) throw new C360Exception(pe);
            else throw new UniqueFieldException(uniqueFieldErrors.getField());
        }
    }

    @RequestMapping(value = "${endpoint.removetopic}", method = RequestMethod.POST)
    @ResponseBody
    public TopicDescription removeTopic(@RequestBody TopicDescription topicDescription) {
        try {
            Topic topic = trainingDAO.getTopic(topicDescription.getId());
            if (topic == null)
                throw new PersistentObjectNotFoundException(topicDescription.getId(), Topic.class);
            topic = trainingDAO.removeTopic(topic);
            return new TopicToDescription().convert(topic);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.removetraining}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingDescription removeTopic(@RequestBody TrainingDescription trainingDescription) {
        try {
            Training training = trainingDAO.getTraining(trainingDescription.getId());
            if (training == null)
                throw new PersistentObjectNotFoundException(trainingDescription.getId(), Training.class);
            training = trainingDAO.removeTraining(training);
            return new TrainingToDescription().convert(training);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }
    @RequestMapping(value = "${endpoint.topics}", method = RequestMethod.GET)
    @ResponseBody
    public List<TopicDescription> getAllTopics() {
        try {
            return new TopicToDescription().convert(trainingDAO.getAllTopics());
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }

    /***
     * TrainingSession
     ***/
    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingSessionDescription addTrainingSession(@RequestBody TrainingSessionDescription trainingSessionDescription) {
        try {
            Training training = trainingDAO.getTraining(trainingSessionDescription.getTrainingDescription().getId());
            if (training == null)
                throw new PersistentObjectNotFoundException(trainingSessionDescription.getTrainingDescription().getId(), Training.class);
            TrainingSession trainingSession = new DescriptionToTrainingSession().convert(trainingSessionDescription, training);
            trainingSession = trainingDAO.addSessionTraining(trainingSession);
            return new TrainingSessionToDescription().convert(trainingSession);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //remove Training Session
    @RequestMapping(value = "${endpoint.sessiontoremove}", method = RequestMethod.POST)
    @ResponseBody
    public TrainingSessionDescription removeTrainingSession(@RequestBody TrainingSessionDescription trainingSessionDescription) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(trainingSessionDescription.getId());
            if (trainingSession == null)
                throw new PersistentObjectNotFoundException(trainingSessionDescription.getTrainingDescription().getId(), Training.class);
            trainingSession = trainingDAO.removeTrainingSession(trainingSession);
            return new TrainingSessionToDescription().convert(trainingSession);
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    //Update Training Session
    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.PUT)
    @ResponseBody
    public TrainingSessionDescription updateTrainingSession(@RequestBody TrainingSessionDescription trainingSessionDescription) {
        try {
            TrainingSession trainingSession = trainingDAO.getSessionTraining(trainingSessionDescription.getId());
            TrainingSession newTrainingSession = new DescriptionToTrainingSession().convert(trainingSessionDescription, trainingSession.getTraining());
            if (trainingSession == null)
                throw new PersistentObjectNotFoundException(trainingSession.getId(), TrainingSession.class);
            return new TrainingSessionToDescription().convert(trainingDAO.updateTrainingSession(trainingSession, newTrainingSession));
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }

    @RequestMapping(value = "${endpoint.addcollaboratortotrainingsession}", method = RequestMethod.PUT)
    @ResponseBody
    public TrainingSessionDescription addCollaboratorToTrainingSession(@PathVariable Long id_session,
                                                                       @PathVariable List<Long> id_collaborators) {
        List<Collaborator> collaborators=new ArrayList<>();
        try {
            for(int i=0;i<id_collaborators.size();i++){
                collaborators.add(collaboratorDAO.getCollaborator(id_collaborators.get(i)));
            }
            TrainingSession trainingSession = trainingDAO.getSessionTraining(id_session);
//            trainingDAO.getRequestedSessionByTraining(trainingSession.getTraining().getId(),)
            return new TrainingSessionToDescription().convert(trainingDAO.addCollaboratorToTrainingSession(trainingSession, collaborators));
        } catch (PersistentObjectNotFoundException e) {
            throw new C360Exception(e);
        }
    }


    @RequestMapping(value = "${endpoint.getcollaboratortotrainingsession}", method = RequestMethod.GET)
    @ResponseBody
    public List<CollaboratorIdentity> getCollaboratorsBySession(@PathVariable Long id_session) {
        try {
            return new CollaboratorToIdentity().convert(trainingDAO.getCollaboratorsBySession(id_session));
        } catch (ConversionException e) {
            e.printStackTrace();
            throw new C360Exception(e);
        }
    }



    @RequestMapping(value = "${endpoint.sessions}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getTrainingSessionsDescriptions() {
        return new TrainingSessionToDescription().convert(trainingDAO.getAllTrainingSessions());
    }

    @RequestMapping(value = "${endpoint.sessionsbyid}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getTrainingSessionsByTraining(@PathVariable String id) {
        return new TrainingSessionToDescription().convert(trainingDAO.getSessionByTraining(Long.parseLong(id)));
    }

    @RequestMapping(value = "${endpoint.alreadyrequestedsession}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getRequestedSessionByTraining(@PathVariable String trainingId, @PathVariable String collabId) {
        return new TrainingSessionToDescription().convert(trainingDAO.getRequestedSessionByTraining(Long.parseLong(trainingId),Long.parseLong(collabId)));
    }

    @RequestMapping(value = "${endpoint.getRequestedSessions}", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, CollaboratorRequestTraining> getRequestedTrainings(@PathVariable String collaborator_id) throws PersistentObjectNotFoundException {
        List<Training> trainings = new ArrayList <> (trainingDAO.getTrainings(Long.parseLong(collaborator_id)));
        Map<String, CollaboratorRequestTraining> requestTrainingsMap = new HashMap<>();
        for (Training training: trainings){
            requestTrainingsMap.put(training.getTrainingTitle(), trainingDAO.getTrainingSession(Long.parseLong(collaborator_id), training.getId()));
        }
        return requestTrainingsMap;
    }
    @RequestMapping(value = "${endpoint.trainingsbysessions}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingDescription> getTrainingBySession() {
        return new TrainingToDescription().convert(trainingDAO.getTrainingBySession());
    }

    @RequestMapping(value = "${endpoint.sessioncollabs}", method = RequestMethod.GET)
    @ResponseBody
    public List<TrainingSessionDescription> getSessionCollaborators() {
        return new TrainingSessionToDescription().convert(trainingDAO.getSessionCollaborators());
    }
}