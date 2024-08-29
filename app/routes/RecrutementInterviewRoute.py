from flask import Flask
from flask_restx import Api, Resource, fields
from pymongo import MongoClient

from app import api, mongo,app
from app.Controllers.RecrutementInterviewController import RecrutementInterviewController

# Instantiate the controller
interview_controller = RecrutementInterviewController(mongo)

# Define the Swagger model for a Recrutement Interview
interview_model = api.model('RecrutementInterview', {
    'idRecruter': fields.String(required=True, description='Recruiter ID'),
    'idCandidat': fields.String(required=True, description='Candidate ID'),
    'interviewTitle': fields.String(required=True, description='Interview Title'),
    'interviewDate': fields.DateTime(required=True, description='Interview Date and Time'),
    'interviewLocation': fields.String(required=True, description='Interview Location'),
    'created_at': fields.DateTime(description='Date and Time of Interview Creation', required=False, readonly=True),
})

# Define the routes
@api.route('/interviews')
class InterviewsResource(Resource):
    def get(self):
        return interview_controller.get_all_interviews()

    @api.expect(interview_model)
    def post(self):
        return interview_controller.create_interview()


@api.route('/interviews/<string:interview_id>')
class InterviewResource(Resource):
    def get(self, interview_id):
        return interview_controller.get_interview_by_id(interview_id)

    @api.expect(interview_model)
    def put(self, interview_id):
        return interview_controller.update_interview(interview_id)

    def delete(self, interview_id):
        return interview_controller.delete_interview(interview_id)


@api.route('/recruiters/<string:recruiter_id>/interviews')
class RecruiterInterviewsResource(Resource):
    def get(self, recruiter_id):
        return interview_controller.get_interviews_by_recruiter(recruiter_id)





