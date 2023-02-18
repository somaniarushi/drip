from flask import Flask, jsonify, request
from flask_cors import CORS
from transformers import ViltProcessor, ViltForQuestionAnswering
import requests
from PIL import Image

api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'

@api.route('/hello')
def hello():
    response_body = {
        "description": "Hello World",
    }

    return response_body

@api.route('/test')
def test():
    name = request.args['name']
    res = "Hello " + name

    response_body = {
        "description": res,
    }

    return response_body

@api.route('/describe')
def describe():
    url = request.args['image']
    prompt = request.args['prompt']

    image = Image.open(requests.get(url, stream=True).raw)

    processor = ViltProcessor.from_pretrained("dandelin/vilt-b32-finetuned-vqa")
    model = ViltForQuestionAnswering.from_pretrained("dandelin/vilt-b32-finetuned-vqa")

    # prepare inputs
    encoding = processor(image, prompt, return_tensors="pt")

    # forward pass
    outputs = model(**encoding)
    logits = outputs.logits

    # Change logits to probabilities
    probs = logits.softmax(-1)

    # Get the top prediction
    probs, idxs = probs.topk(1)

    return jsonify({
        "answer": model.config.id2label[idxs[0][0].item()],
        "probability": probs[0].item()
    })