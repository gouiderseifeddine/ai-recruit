from bson import ObjectId
from datetime import datetime

class RecrutementInterviewModel:
    def __init__(self, db):
        self.collection = db['RecrutementInterviews']

    def create_interview(self, data):
        data['created_at'] = datetime.utcnow()
        return self.collection.insert_one(data).inserted_id

    def get_all_interviews(self):
        return list(self.collection.find())

    def get_interview_by_id(self, interview_id):
        interview = self.collection.find_one({'_id': ObjectId(interview_id)})
        if interview:
            interview['_id'] = str(interview['_id'])
        return interview

    def get_interviews_by_recruiter(self, recruiter_id):
        return list(self.collection.find({'idRecruter': recruiter_id}))

    def update_interview(self, interview_id, data):
        interview = self.collection.update_one({'_id': interview_id}, {'$set': {k: v for k, v in data.items() if k != '_id'}})
        return interview

    def delete_interview(self, interview_id):
        interview = self.collection.delete_one({'_id': interview_id})
        return interview
