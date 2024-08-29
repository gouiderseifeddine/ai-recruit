# JobModel.py
from bson import ObjectId
from datetime import datetime


class JobModel:
    def __init__(self, db):
        self.collection = db['Jobs']

    def create_job(self, data):
        # Generate a new ObjectId for the _id field
        # data['_id'] = str(ObjectId())
        data['created_at'] = datetime.utcnow()
        return self.collection.insert_one(data).inserted_id

    def get_all_jobs(self):
        return list(self.collection.find())

    def get_job_by_id(self, job_id):
        job = self.collection.find_one({'_id': ObjectId(job_id)})
        if job:
            job['_id'] = str(job['_id'])
        return job

    def update_job(self, job_id, data):
        # Exclude the '_id' field from the update
        job = self.collection.update_one({'_id': job_id}, {'$set': {k: v for k, v in data.items() if k != '_id'}})
        return job

    def delete_job(self, job_id):
        job = self.collection.delete_one({'_id': job_id})

        return job

