from flask import Flask, jsonify, request
from flask_cors import CORS
from VisionTransformer import *

import os
import openai

# TODO: Input key here
openai.api_key = "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"

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
    print("desc is " + desc)
    # Make a call to openAI API
    res = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Here is a description of someone's fit:\n {desc}\n Write a valid criticism of this person's style, and suggest improvements they can make. Be specific using the given description, and answer in under 5 lines.",
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return {
        "critique": res.choices[0].text
    }

@api.route('/desc')
def describe():
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")
    """
    #url = request.args['image']
    #prompt = request.args['prompt']

    url = request.args.get('url')
    print("url is " + url)

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

    print("Result is ", result)
    return {
        'desc': result
    }
