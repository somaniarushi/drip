from flask import Flask, request
from flask_cors import CORS

import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")

api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'

@api.route('/hello')
def hello():
    response_body = {
        "description": "Hello World",
    }

    return response_body

@api.route('/roast')
def roast():
    image = request.args.get('desc')
    # Make a call to openAI API
    res = openai.Completion.create(
        model="text-davinci-003",
        prompt="Write a roast of a dress in the style of Miranda Priestly from The Devil Wears Prada.",
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    # print(res)
    return {
        "description": res.choices[0].text
    }

