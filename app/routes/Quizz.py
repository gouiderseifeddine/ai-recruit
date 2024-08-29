from bson import ObjectId
from flask import Blueprint, jsonify, request
import openai
import random
import time
from flask_cors import CORS
import json


from app import app, mongo
quiz_routes= Blueprint('Quizz', __name__)



@quiz_routes.route('/quiz', methods=['GET'])
def list_questions():
    questions = [
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x++);\n    }\n}",
            "options": [
                "5",
                "6",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 0
        },
        {
            "question": "What is the syntax to declare an array in Java?",
            "options": [
                "int[] arr;",
                "int arr[];",
                "int arr{};",
                "int arr();"
            ],
            "correct": 0
        },
        {
            "question": "Which method is automatically called when an object is created in Java?",
            "options": [
                "start()",
                "run()",
                "begin()",
                "construct()"
            ],
            "correct": 3
        },
        {
            "question": "What is the base class for all classes in Java?",
            "options": [
                "System",
                "Object",
                "Class",
                "Base"
            ],
            "correct": 1
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 20;\n        System.out.println(x > y ? x : y);\n    }\n}",
            "options": [
                "10",
                "20",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 1
        },
        {
            "question": "Which interface is implemented by all Java collection classes?",
            "options": [
                "List",
                "Set",
                "Map",
                "Collection"
            ],
            "correct": 3
        },
        {
            "question": "Which keyword is used to inherit a class in Java?",
            "options": [
                "extends",
                "implements",
                "inherit",
                "extends/implements"
            ],
            "correct": 0
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        String str = null;\n        System.out.println(str.length());\n    }\n}",
            "options": [
                "null",
                "0",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 3
        },
        {
            "question": "What is the result of 10 + 20 / 5 in Java?",
            "options": [
                "8",
                "10",
                "14",
                "12"
            ],
            "correct": 2
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x << 2);\n    }\n}",
            "options": [
                "20",
                "10",
                "5",
                "Compiler Error"
            ],
            "correct": 0
        }
    ]

    quiz_data = {
       "theme": "java",
       "questions": questions
    }

    # result = mongo.db.quizs.insert_one(quiz_data)
    # inserted_id = str(result.inserted_id)
    json_data = json.loads(json.dumps(questions, default=str))

    return jsonify(json_data), 200


@app.route('/delete_quiz/<id>', methods=['DELETE'])
def delete_quiz(id):
    quiz_id = ObjectId(id)
    # Supprimer le quiz de la collection
    result = mongo.db.quizs.delete_one({'_id': quiz_id})

    if result.deleted_count == 1:
        return jsonify({'message': f'Quiz avec l\'ID {id} supprimé avec succès'}), 200
    else:
        return jsonify({'message': f'Aucun quiz trouvé avec l\'ID {id}'}), 404

def generer_quiz(theme):
    # Common Java questions
    java_questions  = [
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x++);\n    }\n}",
            "options": [
                "5",
                "6",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 0
        },
        {
            "question": "What is the syntax to declare an array in Java?",
            "options": [
                "int[] arr;",
                "int arr[];",
                "int arr{};",
                "int arr();"
            ],
            "correct": 0
        },
        {
            "question": "Which method is automatically called when an object is created in Java?",
            "options": [
                "start()",
                "run()",
                "begin()",
                "construct()"
            ],
            "correct": 3
        },
        {
            "question": "What is the base class for all classes in Java?",
            "options": [
                "System",
                "Object",
                "Class",
                "Base"
            ],
            "correct": 1
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 10;\n        int y = 20;\n        System.out.println(x > y ? x : y);\n    }\n}",
            "options": [
                "10",
                "20",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 1
        },
        {
            "question": "Which interface is implemented by all Java collection classes?",
            "options": [
                "List",
                "Set",
                "Map",
                "Collection"
            ],
            "correct": 3
        },
        {
            "question": "Which keyword is used to inherit a class in Java?",
            "options": [
                "extends",
                "implements",
                "inherit",
                "extends/implements"
            ],
            "correct": 0
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        String str = null;\n        System.out.println(str.length());\n    }\n}",
            "options": [
                "null",
                "0",
                "Compiler Error",
                "Runtime Error"
            ],
            "correct": 3
        },
        {
            "question": "What is the result of 10 + 20 / 5 in Java?",
            "options": [
                "8",
                "10",
                "14",
                "12"
            ],
            "correct": 2
        },
        {
            "question": "What is the output of this Java code?\n\npublic class Main {\n    public static void main(String[] args) {\n        int x = 5;\n        System.out.println(x << 2);\n    }\n}",
            "options": [
                "20",
                "10",
                "5",
                "Compiler Error"
            ],
            "correct": 0
        }
    ]
    
    # Flutter-specific questions
    flutter_questions = [
    {
        "question": "What is Flutter?",
        "options": [
            "A framework for building cross-platform applications",
            "A programming language",
            "A database management system",
            "A CSS framework"
        ],
        "correct": 0
    },
    {
        "question": "What is a `Widget` in Flutter?",
        "options": [
            "A basic building block of a Flutter app",
            "A tool for managing state",
            "A method for handling user input",
            "A library for network requests"
        ],
        "correct": 0
    },
    {
        "question": "What is the purpose of the `pubspec.yaml` file in a Flutter project?",
        "options": [
            "To define project dependencies and configurations",
            "To manage database connections",
            "To handle user authentication",
            "To create routing"
        ],
        "correct": 0
    },
    {
        "question": "Which widget in Flutter is used to create a scrollable list?",
        "options": [
            "Column",
            "ListView",
            "GridView",
            "Stack"
        ],
        "correct": 1
    },
    {
        "question": "What is the role of the `BuildContext` in Flutter?",
        "options": [
            "To provide information about the location of a widget in the widget tree",
            "To manage state",
            "To handle user input",
            "To create routes"
        ],
        "correct": 0
    },
    {
        "question": "What does the `setState` method do in Flutter?",
        "options": [
            "Updates the state of a widget and triggers a rebuild",
            "Manages routing",
            "Handles user input",
            "Defines styles for widgets"
        ],
        "correct": 0
    },
    {
        "question": "How do you navigate between screens in Flutter?",
        "options": [
            "Using the Navigator class",
            "Using the Router class",
            "Using StatefulWidget",
            "Using StatelessWidget"
        ],
        "correct": 0
    },
    {
        "question": "What is a `Future` in Flutter?",
        "options": [
            "A way to handle asynchronous operations",
            "A method for managing state",
            "A widget for displaying data",
            "A method for routing"
        ],
        "correct": 0
    },
    {
        "question": "Which widget is used to create a text input field in Flutter?",
        "options": [
            "TextField",
            "TextInput",
            "InputField",
            "FormField"
        ],
        "correct": 0
    },
    {
        "question": "What is the `MaterialApp` widget used for in Flutter?",
        "options": [
            "To define the basic structure and theme of the app",
            "To handle navigation",
            "To manage state",
            "To create custom widgets"
        ],
        "correct": 0
    }
]

    
    # React-specific questions
    react_questions = [
    {
        "question": "What is React?",
        "options": [
            "A library for building user interfaces",
            "A programming language",
            "A database management system",
            "A tool for managing state"
        ],
        "correct": 0
    },
    {
        "question": "What is JSX in React?",
        "options": [
            "A JavaScript extension for creating elements",
            "A CSS framework",
            "A database query language",
            "A tool for testing React components"
        ],
        "correct": 0
    },
    {
        "question": "What does the `useState` hook do in React?",
        "options": [
            "Manages state in functional components",
            "Handles side effects",
            "Provides context for components",
            "Manages routing"
        ],
        "correct": 0
    },
    {
        "question": "Which method is used to update the state in a React class component?",
        "options": [
            "updateState()",
            "setState()",
            "modifyState()",
            "changeState()"
        ],
        "correct": 1
    },
    {
        "question": "What is the purpose of the `useEffect` hook in React?",
        "options": [
            "To manage side effects in functional components",
            "To create new components",
            "To handle user input",
            "To manage component lifecycle in class components"
        ],
        "correct": 0
    },
    {
        "question": "How do you pass data from a parent component to a child component in React?",
        "options": [
            "Using props",
            "Using state",
            "Using context",
            "Using local storage"
        ],
        "correct": 0
    },
    {
        "question": "What is a 'key' prop in React?",
        "options": [
            "A unique identifier for elements in a list",
            "A method for state management",
            "A way to handle user events",
            "A CSS property"
        ],
        "correct": 0
    },
    {
        "question": "Which React hook is used to manage form inputs?",
        "options": [
            "useReducer",
            "useState",
            "useContext",
            "useCallback"
        ],
        "correct": 1
    },
    {
        "question": "What is the purpose of `React.memo`?",
        "options": [
            "To optimize performance by memoizing functional components",
            "To handle state changes",
            "To manage side effects",
            "To create new hooks"
        ],
        "correct": 0
    },
    {
        "question": "What is the `context` API used for in React?",
        "options": [
            "To manage global state",
            "To handle form validation",
            "To create routing",
            "To manage side effects"
        ],
        "correct": 0
    }
]


    # Determine the questions based on the theme
    if theme == 'flutter':
        questions = flutter_questions
    elif theme == 'react':
        questions = react_questions
    else:
        questions = java_questions  # Default to Java questions if theme is not specified

    quiz_data = {
       "theme": theme,
       "questions": questions
    }

    return quiz_data


@app.route('/generer_quiz/<theme>', methods=['GET'])
def generer_quiz_route(theme):
    quiz = generer_quiz(theme)
    return jsonify(quiz), 200


@app.route('/add_quiz', methods=['POST'])
def addQuiz():

    json_data = request.json
    theme = json_data.get("theme")
    questions = json_data.get("questions")
    idRecruter = json_data.get("idRecruter")


    quiz_data = {
        "idRecruter": idRecruter,
        "theme": theme,
        "questions": questions
    }
    result = mongo.db.quizs.insert_one(quiz_data)
    inserted_id = str(result.inserted_id)

    return jsonify({"message": "Quiz inserted successfully.", "inserted_id": inserted_id}), 200



@app.route('/affecter', methods=['POST'])
def affecter_quiz_candidat():

    json_data = request.json
    idRecruter = json_data.get("idRecruter")
    idcandidat = json_data.get("idcandidat")
    idquiz = json_data.get("idquiz")
    date = json_data.get("date")
    quiz_data = {

        "idRecruter": idRecruter,
        "idCandidat": idcandidat,
        "idQuiz": idquiz,
        "date": date,
        "score": 0,
        "status": "start"
    }
    result = mongo.db.testquiz.insert_one(quiz_data)
    inserted_id = str(result.inserted_id)

    return jsonify({"message": "Quiz inserted successfully.", "inserted_id": inserted_id}), 200



@app.route('/onequiz/<quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    try:
        # Convert the quiz_id string to ObjectId
        quiz_object_id = ObjectId(quiz_id)
        quiz = mongo.db.quizs.find_one({'_id': quiz_object_id})
        if quiz:
            # Convert ObjectId to string
            quiz['_id'] = str(quiz['_id'])
            return jsonify(quiz), 200
        else:
            return jsonify({'message': 'Quiz not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/onecandidat/<candidat_id>', methods=['GET'])
def get_candidat(candidat_id):
    try:
        # Convert the quiz_id string to ObjectId
        candidat_object_id = ObjectId(candidat_id)
        candidat = mongo.db.users.find_one({'_id': candidat_object_id})
        if candidat:
            # Convert ObjectId to string
            candidat['_id'] = str(candidat['_id'])
            return jsonify(candidat), 200
        else:
            return jsonify({'message': 'candidat not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/all_candidat', methods=['GET'])
def allcandidat():
    try:
        # Query all users with role "candidat"
        candidats_cursor = mongo.db.users.find({"role": "Candidat"})

        # Initialize an empty list to hold the processed documents
        candidats_list = []

        # Iterate through the cursor to access each document
        for candidat in candidats_cursor:
            # Convert '_id' field to string
            candidat['_id'] = str(candidat['_id'])
            # Append the processed document to the list
            candidats_list.append(candidat)

        # Return the list of candidates as JSON with a 200 status code
        return jsonify(candidats_list), 200

    except Exception as e:
        # Return an error message in JSON with a 500 status code in case of an exception
        return jsonify({'error': str(e)}), 500


@app.route('/allQuizByRecruter/<idRecruter>', methods=['GET'])
def allQuizByRecruter(idRecruter):
    result = mongo.db.quizs.find({"idRecruter":idRecruter})
    list_quiz = list(result)
    # Convert to JSON serializable format
    json_data = json.loads(json.dumps(list_quiz, default=str))

    return jsonify(json_data), 200


@app.route('/testQuizByRecruter/<idRecruter>', methods=['GET'])
def allTestQuizByRecruter(idRecruter):
    result = mongo.db.testquiz.find({"idRecruter":idRecruter})
    list_test_quiz = list(result)
    # Convert to JSON serializable format
    json_data = json.loads(json.dumps(list_test_quiz, default=str))

    return jsonify(json_data), 200


@app.route('/testQuizByCandidat/<idCandidat>', methods=['GET'])
def allTestQuizByCandidat(idCandidat):
    result = mongo.db.testquiz.find({"idCandidat":idCandidat})
    list_test_quiz = list(result)
    # Convert to JSON serializable format
    json_data = json.loads(json.dumps(list_test_quiz, default=str))

    return jsonify(json_data), 200




@app.route('/update_test_quiz/<string:test_quiz_id>', methods=['PUT'])
def update_test_quiz(test_quiz_id):
    try:
            # Récupérer les données du test quiz à partir de la requête
        data = request.json
        new_score = data.get('score')
        new_status = data.get('status')

            # Vérifier si le test quiz existe dans la base de données
        test_quiz = mongo.db.testquiz.find_one({'_id': ObjectId(test_quiz_id)})
        if not test_quiz:
            return jsonify({'error': 'Test quiz not found'}), 404

            # Mettre à jour le score et le statut du test quiz
        mongo.db.testquiz.update_one(
            {'_id': ObjectId(test_quiz_id)},
            {'$set': {'score': new_score, 'status': new_status}}
        )

        return jsonify({'message': 'Test quiz updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_test_quiz/<id>', methods=['DELETE'])
def delete_test_quiz(id):
    try:
        # Ensure the ID is a valid ObjectId
        try:
            test_quiz_id = ObjectId(id)
        except Exception:
            return jsonify({'message': 'Invalid quiz ID format'}), 400

        # Attempt to delete the test quiz
        result = mongo.db.testquiz.delete_one({'_id': test_quiz_id})

        if result.deleted_count == 1:
            return jsonify({'message': 'Test quiz deleted successfully'}), 200
        else:
            return jsonify({'message': 'No test quiz found with the specified ID'}), 404

    except Exception as e:
        # Log the error and provide a detailed message
        print(f"Error deleting test quiz: {e}")
        return jsonify({'error': 'An error occurred while deleting the test quiz'}), 500


@app.route('/update_quiz/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    try:
        # Parse the request JSON data
        data = request.json
        questions = data.get('questions')
        # Check if the quiz exists in the database
        quiz = mongo.db.quizs.find_one({'_id': ObjectId(quiz_id)})
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404

        # Update the quiz in the database
        update_result = mongo.db.quizs.update_one(
            {'_id': ObjectId(quiz_id)},
            {'$set': {'questions': questions}}
        )

        # Return success message
        if update_result.modified_count == 1:
            return jsonify({'message': 'Quiz updated successfully'}), 200
        else:
            return jsonify({'message': 'No changes made to the quiz'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    app.register_blueprint(quiz_routes, url_prefix='/quiz')