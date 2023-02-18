from flask import Flask, jsonify, request
from flask_cors import CORS
from VisionTransformer import *

import os
import openai

# TODO: Input key here
openai.api_key = ""

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
    desc = request.args.get('desc')
    # Make a call to openAI API
    res = openai.Completion.create(
        model="text-davinci-003",
        prompt="Here is a description of someone's fit:\n {desc}\n Write a roast of a dress in the style of Miranda Priestly from The Devil Wears Prada. Be specific in the critique, but do not lose the tone of the character.",
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return {
        "critique": res.choices[0].text
    }

@api.route('/describe')
def describe():
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")
    """
    url = request.args['image']
    prompt = request.args['prompt']

    return describe_image(url, prompt)
