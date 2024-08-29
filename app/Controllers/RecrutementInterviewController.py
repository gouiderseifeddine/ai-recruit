import datetime
from flask import jsonify, request
from bson import ObjectId
from app import app, mongo, api
from app.Repository.UserRepo import UserRepository

from app.Models.RecrutementInterviewModel import RecrutementInterviewModel
from app.Controllers.auth import send_accept_email2

class RecrutementInterviewController:
    def __init__(self, db):
        self.model = RecrutementInterviewModel(db.db)

    def create_interview(self):
        data = request.get_json()
        datetime = data.get('interviewDate')
        location = data.get('interviewLocation')

        send_accept_email2("seifeddine.gouider@esprit.tn","Interview Invitation","saif",date=datetime,location=location)

        interview_id = self.model.create_interview(data)
        return {'interview_id': str(interview_id)}

    def get_all_interviews(self):
        interviews = self.model.collection.find()
        serialized_interviews = []
        for interview in interviews:
            interview['_id'] = str(interview['_id'])
            for key, value in interview.items():
                if isinstance(value, datetime.datetime):
                    interview[key] = value.isoformat()
            serialized_interviews.append(interview)
        return serialized_interviews

    def get_interview_by_id(self, interview_id):
        interview = self.model.get_interview_by_id(interview_id)
        if interview:
            interview['_id'] = str(interview['_id'])
            for key, value in interview.items():
                if isinstance(value, datetime.datetime):
                    interview[key] = value.isoformat()
            return interview
        else:
            return {'error': 'Interview not found'}

    def get_interviews_by_recruiter(self, recruiter_id):
        interviews = self.model.get_interviews_by_recruiter(recruiter_id)
        for interview in interviews:
            interview['_id'] = str(interview['_id'])
        return interviews

    def update_interview(self, interview_id):
        data = request.get_json()
        result = self.model.update_interview(ObjectId(interview_id), data)
        return {'modified_count': result.modified_count}

    def delete_interview(self, interview_id):
        result = self.model.delete_interview(ObjectId(interview_id))
        return {'deleted_count': result.deleted_count}
