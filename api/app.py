from flask import Flask
from flask_cors import CORS

api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'

@api.route('/hello')
def hello():
    response_body = {
        "description": "Hello World",
    }

    return response_body