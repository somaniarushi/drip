from flask import Flask, request
from flask_cors import CORS
from VisionTransformer import *
from multiprocessing import Pool

import os
import json
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
        prompt=f"Here is a description of someone's fit:\n {desc}\n Write a valid feedback of this person's style, highlight the positive, and suggest improvements they can make. DO NOT make additions to their outfit. Be specific using ONLY the given description. Answer in 5 lines.",
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return {
        "critique": res.choices[0].text
    }

@api.route('/rating')
def rate():
    desc = request.args.get('desc')
    feedback = request.args.get('roast')
    found_json = False
    while not found_json:
        res = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"Description: {desc}\n\n Feedback: {feedback}\n\n Given this feedback, rate the outfit on a scale of 1-10 in the following criteria: originality, cohesiveness, flair, execution. Be moderate in the scoring. Output a json.",
            max_tokens=100,
            top_p=1,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        json_data = res.choices[0].text
        try:
            json.loads(json_data)
            found_json = True
        except:
            pass
    return {
        "rating": json_data
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

    parts = fullbody['is'] + top['is'] + bottom['is'] + ['shoes', 'jewelry', 'hat', 'tie', 'jacket', 'belt', 'scarf']

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

    def describe_part(part):
        part_result = ""
        if not check_necessary(part):
            return ""
        prompt = "Is this person wearing " + part + "?"
        answer = describe_image(url, prompt)['answer']
        print(prompt, answer)
        if answer == "yes":
            set_complete(part)
            part_result += "They're wearing " + part + " which is"
            followups = ["color", "pattern", "type", "material"]
            adjectives = []
            for followup in followups:
                prompt = "What is the " + part + "'s " + followup + "?"
                answer = describe_image(url, prompt)['answer']
                if answer not in adjectives:
                    adjectives.append(answer)
            part_result += " " + ", ".join(adjectives) + ". "
        return part_result

    for part in parts:
        part_description = describe_part(part)
        result += part_description

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
