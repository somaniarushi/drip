from flask import Flask, jsonify, request
from flask_cors import CORS
from VisionTransformer import *

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

@api.route('/describe')
def describe():
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")
    """
    #url = request.args['image']
    #prompt = request.args['prompt']

    url = "http://cdn.shopify.com/s/files/1/1109/3312/collections/get-ready-to-shine-in-stunning-formal-dresses-the-dress-outlet.jpg?v=1673756130"
    
    result = ""

    prompt = "Is this person wearing a casual or formal outfit?"
    answer = describe_image(url, prompt)['answer']
    result += "This person is wearing a " + answer + " outfit. "

    fullbody = {
        'is': ["dress"],
        'complete': False,
    }
    top = {
        'is': ["shirt"],
        'complete': False,
    }
    bottom = {
        'is': ["pants", "skirt", "shorts"],
        'complete': False,
    }

    parts = fullbody['is'] + top['is'] + bottom['is']

    def check_necessary(part):
        if fullbody['complete'] and part in fullbody['is'] or part in top['is'] or part in bottom['is']:
            return False
        if top['complete'] and part in top['is']:
            return False
        if bottom['complete'] and part in bottom['is']:
            return False
        return True

    def set_complete(part):
        if part in fullbody['is']:
            fullbody['complete'] = True
        if part in top['is']:
            top['complete'] = True
        if part in bottom['is']:
            bottom['complete'] = True

    for part in parts:
        if not check_necessary(part):
            continue
        prompt = "Is this person wearing " + part + "?"
        answer = describe_image(url, prompt)['answer']
        if answer == "yes":
            set_complete(part)
            result += "They're wearing " + part + " which is"
            followups = ["color", "pattern", "style", "material"]
            adjectives = []
            for followup in followups:
                prompt = "What is the " + part + "'s " + followup + "?"
                answer = describe_image(url, prompt)['answer']
                if answer not in adjectives:
                    adjectives.append(answer)
            result += " " + ", ".join(adjectives) + ". "
            print(result)
    
    return result
