from flask import Flask, request
from flask_cors import CORS
from VisionTransformer import *

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
    roast_level = request.args.get('roastLevel')
    print("desc is " + desc)
    print("roast level is " + roast_level)

    prompts = {
        "light": "Write a valid positive comment on this person's style as if you were their friend hyping them up. Highlight the positive and compliment them in looks, fashion, pose.",
        "medium": "Write a valid critique of this person's style. Highlight the positive. If there are negatives, explain them and suggest actionable improvements they can make. Be constructive.",
        "dark": "Write a valid roast of this person's style as if you were a fashion critic. Highlight the positive if any. Highlight the negative and be mean if it warrants it. Suggest improvements they can make. Be very critical."
    }

    # Make a call to openAI API
    res = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Here is a description of someone's fit:\n {desc}\n " + prompts[roast_level] + "DO NOT make additions to their outfit. Be specific using ONLY the given description. Answer in less than 5 sentences.",
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )

    return {
        "critique": res.choices[0].text
    }

def get_gpt_json(prompt, expected_keys):
    while True:
        res = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=100,
            top_p=1,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        try:
            json_data = json.loads(res.choices[0].text.lower())
            if sorted(json_data.keys()) == sorted(expected_keys):
                return json_data
        except:
            pass

@api.route('/rating')
def rate():
    desc = request.args.get('desc')
    feedback = request.args.get('roast')
    expected_keys = ["originality", "cohesiveness", "flair", "execution"]
    prompt =  f"Description: {desc}\n\n Feedback: {feedback}\n\n Given this feedback, rate the outfit on a scale of 1-10 in the following criteria: originality, cohesiveness, flair, execution. Be critical, where 10 is very trendy, fashionable, and modern and 1 is someone who threw things together without thought. Output a json."
    return {
        "rating": get_gpt_json(prompt, expected_keys)
    }

@api.route('/aura')
def aura():
    auras = {
        "tech bro": {
            "title": "tech bro",
            "description": "You have a tech bro aura, characterized by a mix of casual and formal pieces with a focus on comfort and practicality. It is a versatile look that is perfect for a day at the office or a night out with friends.",
        },
        "diva": {
            "title": "diva",
            "description": "You have a glamorous, bold, and eye-catching aura with an emphasis on making a statement and looking fabulous. It is a mix of classic cuts and bright, daring colors with bold accessories for a dramatic and unforgettable look.",
        },
        "basic": {
            "title": "basic",
            "description": "You have an aura that focuses on clean, timeless pieces in neutral colors. It features classic silhouettes and minimal accessories for a minimalistic, effortless look.",
        },
        "dapper": {
            "title": "dapper",
            "description": "You have a polished aura that emphasizes tailored pieces with a modern twist, such as slim-fitting suits, crisp dress shirts, and polished accessories. It's the perfect look for a timeless, sophisticated style.",
        },
        "artsy": {
            "title": "artsy",
            "description": "Your aura is characterized by bold statement pieces and creative, unique designs that are sure to make a statement. It is often experimental and unconventional, making it perfect for those looking to stand out from the crowd.",
        },
        "avant-garde": {
            "title": "avant-garde",
            "description": "You have an edgy, trendsetting aura that incorporates innovative, artistic elements to create forward-thinking looks. It often plays with traditional silhouettes and materials to create unexpected and unique designs.",
        },
        "fashionista": {
            "title": "fashionista",
            "description": "Your have a fashionable and stylish aura, characterized by bold and trendy outfits that make a statement. It celebrates individual style and encourages experimentation with fashion trends.",
        },
        "cottagecore": {
            "title": "cottagecore",
            "description": "Your aura celebrates the beauty and comfort of rural living, with a focus on soft, comfortable fabrics, floral prints, and natural colors. It emphasizes natural materials, homespun touches, and a peaceful and relaxed atmosphere.",
        },
        "emo": {
            "title": "emo",
            "description": "You have an edgy, dark aura that features dark colors, dramatic silhouettes, and bold accessories. It is a unique and unconventional look that is perfect for those looking to make a statement.",
        },
        "lumberjack": {
            "title": "lumberjack",
            "description": "Your aura is inspired by traditional outdoor workwear, featuring plaid shirts, heavy boots, and other warm and durable items. It is a rugged, comfortable look that is perfect for a chilly day spent in the great outdoors."
        },
    }

    desc = request.args.get('desc')
    expected_keys = ["aura"]

    prompt = f"Description: {desc}\n\n Given this description, pick one out of the following to describe the outfit's aesthetics. It must be one of the following objects in this JSON object (do not interpret the titles when choosing, only the description): {auras}. Output a JSON, the key should be \"{expected_keys[0]}\"."

    json_data = get_gpt_json(prompt, expected_keys)
    print(json_data)

    # check if the aura is valid -- default tech bro
    if json_data["aura"] not in auras:
        json_data["aura"] = "tech bro"

    return auras[json_data["aura"]]

@api.route('/desc')
def describe():
    """
    Describes an image based on a given prompt.

    @param: image: URL of the image
    @param: prompt: question about the image (i.e. "What type of top is the person wearing?")
    """
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

    parts = fullbody['is'] + top['is'] + bottom['is'] + ['shoes']

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
    
    def describe_valid_part(part):
        """
        Describes a part in detail after determining the part is valid
        """
        part_result = "They're wearing " + part + " which is"
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

    # This wil allow any accessories that are __ % as confident as the highest accessory
    accessory_tolerance = .6
    
    # Identify accessories
    accessory_prompt = "What accessories is the person wearing?"
    accessory_distribution = describe_image_expanded(url, accessory_prompt, 5)
    max_prob = max(accessory_distribution)[0]

    # Only parse accessories if substantial
    if max_prob >= .1:
        accessories = [acc[1] for acc in accessory_distribution if acc[0] >= accessory_tolerance * max_prob and acc[1] not in parts + bottom['is']]
    else:
        accessories = []
    
    print("accessories identified: ", accessories)

    # Describe each accessory
    for accessory in accessories:
        part_description = describe_valid_part(accessory)
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
