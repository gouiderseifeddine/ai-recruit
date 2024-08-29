from bson import ObjectId
from datetime import datetime

class JobApplicationModel:
    def __init__(self, db):
        self.collection = db['JobApplications']

    def create_application(self, data):
        data['created_at'] = datetime.utcnow()
        return self.collection.insert_one(data).inserted_id

    def get_all_applications(self):
        return list(self.collection.find())

    def get_application_by_id(self, application_id):
        application = self.collection.find_one({'_id': ObjectId(application_id)})
        if application:
            application['_id'] = str(application['_id'])
        return application

    def get_applications_by_candidate(self, candidate_id):
        return list(self.collection.find({'idCandidat': candidate_id}))

    def update_application(self, application_id, data):
        application = self.collection.update_one({'_id': ObjectId(application_id)}, {'$set': {k: v for k, v in data.items() if k != '_id'}})
        return application

    def delete_application(self, application_id):
        application = self.collection.delete_one({'_id': ObjectId(application_id)})
        return application
    
    def update_application2(self, application_id, update_data):
        return self.collection.update_one(
            {'_id': ObjectId(application_id)},
            update_data
        )


