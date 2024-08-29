from flask import Flask
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Api, Resource, fields
from app import api, mongo
from app.Controllers.jobApplicationController import JobApplicationController

# Instantiate the controller
application_controller = JobApplicationController(mongo)

# Define the Swagger model for a Job Application
application_model = api.model('JobApplication', {
    'idCandidat': fields.String(required=True, description='Candidate ID'),
    'idJob': fields.String(required=True, description='Job ID'),
    'cvScore': fields.Float(required=True, description='CV Score'),
    'skillsScore': fields.Float(required=True, description='Skills Score'),
    'coverLetterScore': fields.Float(required=True, description='Cover Letter Score'),
    'totalScore': fields.Float(required=True, description='Total Score'),
    'applicationStatus':fields.String(required=True, description='Current Status'),
    'created_at': fields.DateTime(description='Date and Time of Application Creation', required=False, readonly=True),
})

# Define the routes
@api.route('/applications')
class ApplicationsResource(Resource):
    def get(self):
        return application_controller.get_all_applications()

    @api.expect(application_model)
    @jwt_required()
    def post(self):
        return application_controller.create_application()


@api.route('/applications/<string:application_id>')
class ApplicationResource(Resource):
    def get(self, application_id):
        return application_controller.get_application_by_id(application_id)

    @api.expect(application_model)
    def put(self, application_id):
        return application_controller.update_application(application_id)

    def delete(self, application_id):
        return application_controller.delete_application(application_id)


@api.route('/candidates/<string:candidate_id>/applications')
class CandidateApplicationsResource(Resource):
    def get(self, candidate_id):
        return application_controller.get_applications_by_candidate(candidate_id)
    

@api.route('/acceptApplication/<string:application_id>')
class AcceptapplicationsRessource(Resource):
    def put(self,application_id):
        return application_controller.accept_application(application_id)

@api.route('/refuseApplication/<string:application_id>')
class RefuseapplicationsRessource(Resource):
    def put(self,application_id):
        return application_controller.reject_application(application_id)
    

