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
    parts = ["dress", "top", "bottom", "hat", "shoes", "jewelry"]
    for part in parts:
        prompt = "Is this person wearing " + part + "?"
        answer = describe_image(url, prompt)['answer']
        if answer == "yes":
            result += "The person is wearing " + part + ". "
            followups = ["color", "pattern", "style", "material"]
            for followup in followups:
                prompt = "What is the " + part + "'s " + followup + "?"
                answer = describe_image(url, prompt)['answer']
                result += "The " + part + " is " + answer + ". "
    
    return result
