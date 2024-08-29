class Config:
    SECRET_KEY = 'your_secret_key'
    MONGO_URI = "mongodb+srv://gouidersaif:Rz4aY7LqV70sE0Jx@cluster0.hn4olip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true"


    FLASK_JWT_SECRET_KEY = '7e4d21e87dd2238e8cf031df'
    UPLOAD_FOLDER = '/Users/noucha/Documents/PFE/Back-airecrut-main/Uploads'

    # Flask-Mail configuration
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'wissalnjah1999@gmail.com'  # Your Gmail email address
    MAIL_PASSWORD = 'xqgf asgn milw qdqv'  # Your Gmail password
    MAIL_DEFAULT_SENDER = 'wissalnjah1999@gmail.com'  # Default sender

    CLIENT_ID = '747459692723-tnafnuk2sca6etip3trnm44pluvb0hh0.apps.googleusercontent.com'
    CLIENT_SECRET = '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'
    REDIRECT_URI = 'https://localhost:3000/login'
