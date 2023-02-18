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
        prompt=f"Here is a description of someone's fit:\n {desc}\n Write a valid feedback of this person's style, highlight the positive, and suggest improvements they can make. Be specific using only the given description, and answer in under 5 lines.",
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

    parts = fullbody['is'] + top['is'] + bottom['is'] + ['shoes', 'jewelry', 'hat', 'tie', 'jacket']

    def check_necessary(part):
        if fullbody['complete'] and (part in fullbody['is'] or part in top['is'] or part in bottom['is']):
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
        print(prompt, answer)
        if answer == "yes":
            set_complete(part)
            result += "They're wearing " + part + " which is"
            followups = ["color", "pattern", "type", "material"]
            adjectives = []
            for followup in followups:
                prompt = "What is the " + part + "'s " + followup + "?"
                answer = describe_image(url, prompt)['answer']
                if answer not in adjectives:
                    adjectives.append(answer)
            result += " " + ", ".join(adjectives) + ". "

    # Description clean-up
    desc_clean = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"{result}\n Without adding additional information, rephrase this to be a comprehensive description of a person's outfit. Do not miss keywords like 'formal', colors like 'white', or descriptions like 'suit'. Write 5 lines.",
        max_tokens=256,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return {
        'result': result,
        'desc': desc_clean.choices[0].text
    }
