import random
from datetime import datetime
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from app.Models.jobApplication import JobApplicationModel
from app.Repository.UserRepo import UserRepository
from app.Models.JobModel import JobModel 
from app.routes.JobRoute import job_controller
from app.Controllers.auth import send_accept_email, send_refusal_email1

from app import app, mongo, api

class JobApplicationController:
    def __init__(self, db):
        self.model = JobApplicationModel(db.db)
        self.user_model = UserRepository()
        self.job_model = JobModel(db.db)

    def create_application(self):
        data = request.get_json()
        idCandidat = data.get('idCandidat')
        idJob = data.get('idJob')
        applicationStatus = data.get('applicationStatus')


        job = job_controller.get_job_by_id(idJob)
        identity = get_jwt_identity()
        print("User email from JWT:", identity)

        # Fetch the user object by email to get the user ID
        user = UserRepository.find_by_email(mongo, identity)
        if not user:
            print(f"No user found with the email: {identity}")
            return jsonify({"error": "User not found"}), 406
        user['_id'] = str(user['_id'])



        cvScore = random.uniform(60, 90)
        coverLetterScore = random.uniform(60, 90)
        candidate_skills = set(user.get('skills', []))
        job_skills = set(job.get('requirements', []))
    
        if job_skills:
            matching_skills = candidate_skills.intersection(job_skills)
            skillsScore = (len(matching_skills) / len(job_skills)) * 100
        else:
            skillsScore = 0.0
        totalScore = (cvScore + skillsScore + coverLetterScore) / 3
       
        
        application_data = {
            'idCandidat': idCandidat,
            'idJob': idJob,
            'cvScore': round(cvScore, 2),
            'skillsScore': round(skillsScore, 2),
            'coverLetterScore': round(coverLetterScore, 2),
            'totalScore': round(totalScore, 2),
            'applicationStatus': applicationStatus
        }
        jobApplication_id = self.model.create_application(application_data)
        return {'jobApplication_id': str(jobApplication_id)}

    def get_all_applications(self):
        applications = self.model.collection.find()
        serialized_applications = []
        for application in applications:
            application['_id'] = str(application['_id'])
            if 'created_at' in application and isinstance(application['created_at'], datetime):
                application['created_at'] = application['created_at'].isoformat()
            serialized_applications.append(application)
        return serialized_applications

    def get_application_by_id(self, application_id):
        application = self.model.get_application_by_id(application_id)
        if application:
            application['_id'] = str(application['_id'])
            return application
        else:
            return {'error': 'Application not found'}

    def get_applications_by_candidate(self, candidate_id):
        applications = self.model.get_applications_by_candidate(candidate_id)
        for application in applications:
            application['_id'] = str(application['_id'])
            if 'created_at' in application and isinstance(application['created_at'], datetime):
                application['created_at'] = application['created_at'].isoformat()
        return applications

    def update_application(self, application_id):
        data = request.get_json()
        result = self.model.update_application(ObjectId(application_id), data)
                

        return {'modified_count': result.modified_count}

    def delete_application(self, application_id):
        result = self.model.delete_application(ObjectId(application_id))
        return {'deleted_count': result.deleted_count}
    



    def reject_application(self, application_id):
    # Fetch the application from the database
        application = self.model.get_application_by_id(application_id)
        if not application:
            return jsonify({'message': 'Application not found.'}), 405
        application['_id'] = str(application['_id'])    
        if 'created_at' in application and isinstance(application['created_at'], datetime):
            application['created_at'] = application['created_at'].isoformat()


        send_refusal_email1("seifeddine.gouider@esprit.tn","refusal","saif")

        result = self.model.update_application2(
                ObjectId(application_id), 
                {'$set': {'applicationStatus': 'refused'}}
            ) 
        return jsonify({'message': 'Application refused and email sent.',"application":result}), 200


    def accept_application(self, application_id):
    # Fetch the application from the database
        application = self.model.get_application_by_id(application_id)
        if not application:
            return jsonify({'message': 'Application not found.'}), 405
        application['_id'] = str(application['_id'])    
        if 'created_at' in application and isinstance(application['created_at'], datetime):
            application['created_at'] = application['created_at'].isoformat()

        # Check if the application meets the acceptance criteria (e.g., score threshold)
        if application.get('totalScore') >= 15:
            send_accept_email("seifeddine.gouider@esprit.tn","Application Accepted","le moi")
            # Update the application status to 'accepted' using $set operator
            result = self.model.update_application2(
                ObjectId(application_id), 
                {'$set': {'applicationStatus': 'accepted'}}
            )        
            if result.modified_count == 1:
                send_accept_email("seifeddine.gouider@esprit.tn","Application Accepted","le moi")
                return jsonify({'message': 'Application accepted and email sent.'}), 200
            else:
                return jsonify({'message': 'No update made, application might have been already accepted.'}), 200
        else:
            return jsonify({'message': 'Application does not meet the acceptance criteria.'}), 400


    def send_acceptance_email(email, name):
        subject = "Application Accepted"
        message = f"Dear {name},\n\nWe are pleased to inform you that your application has been accepted.\n\nBest regards,\nThe Team"
        with app.app_context():
            send_accept_email(email, subject, name)


    def send_refusal_email(email, name):
        subject = "Application Not Accepted"
        message = f"Dear {name},\n\nWe regret to inform you that your application has not been accepted at this time.\n\nBest regards,\nThe Team"
        with app.app_context():
            send_refusal_email1(email, subject, name)

